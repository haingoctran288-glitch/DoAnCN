package com.example.API_java.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DashboardService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Map<String, Object> getDashboardData(String branch, String timeRange, String startDateStr, String endDateStr) {
        Map<String, Object> result = new HashMap<>();

        // 1. Resolve Time Range
        String timeCondition = "1=1";
        String timeConditionPrev = "1=1"; // For comparison
        List<Object> timeParams = new ArrayList<>();
        List<Object> timeParamsPrev = new ArrayList<>();
        
        LocalDate today = LocalDate.now();
        if ("today".equals(timeRange)) {
            timeCondition = "DATE(created_at) = ?";
            timeParams.add(today.toString());
            timeConditionPrev = "DATE(created_at) = ?";
            timeParamsPrev.add(today.minusDays(1).toString());
        } else if ("7days".equals(timeRange)) {
            timeCondition = "created_at >= ? AND created_at <= ?";
            timeParams.add(today.minusDays(7).toString() + " 00:00:00");
            timeParams.add(today.toString() + " 23:59:59");
            timeConditionPrev = "created_at >= ? AND created_at < ?";
            timeParamsPrev.add(today.minusDays(14).toString() + " 00:00:00");
            timeParamsPrev.add(today.minusDays(7).toString() + " 00:00:00");
        } else if ("this_month".equals(timeRange)) {
            timeCondition = "YEAR(created_at) = ? AND MONTH(created_at) = ?";
            timeParams.add(today.getYear());
            timeParams.add(today.getMonthValue());
            LocalDate prevMonth = today.minusMonths(1);
            timeConditionPrev = "YEAR(created_at) = ? AND MONTH(created_at) = ?";
            timeParamsPrev.add(prevMonth.getYear());
            timeParamsPrev.add(prevMonth.getMonthValue());
        } else if ("this_year".equals(timeRange)) {
            timeCondition = "YEAR(created_at) = ?";
            timeParams.add(today.getYear());
            timeConditionPrev = "YEAR(created_at) = ?";
            timeParamsPrev.add(today.minusYears(1).getYear());
        } else if (startDateStr != null && endDateStr != null && !startDateStr.isEmpty() && !endDateStr.isEmpty()) {
            timeCondition = "created_at >= ? AND created_at <= ?";
            timeParams.add(startDateStr + " 00:00:00");
            timeParams.add(endDateStr + " 23:59:59");
            timeConditionPrev = "1=0"; // No comparison for custom
        }

        // 2. Resolve Branch Condition
        String branchConditionBooking = "1=1";
        String branchConditionOrder = "1=1";
        List<Object> branchParams = new ArrayList<>();
        if (branch != null && !branch.isEmpty() && !"Tất cả chi nhánh".equals(branch)) {
            branchConditionBooking = "staff_id IN (SELECT id FROM staff WHERE branch = ?)";
            branchConditionOrder = "order_branch = ?";
            branchParams.add(branch);
        }

        // Build Params
        List<Object> bookingParams = new ArrayList<>();
        bookingParams.addAll(branchParams);
        bookingParams.addAll(timeParams);

        List<Object> orderParams = new ArrayList<>();
        orderParams.addAll(branchParams);
        orderParams.addAll(timeParams);

        // 3. Total Revenue
        String serviceRevSql = "SELECT COALESCE(SUM(total_price), 0) FROM bookings WHERE status = 'COMPLETED' AND " + branchConditionBooking + " AND " + timeCondition;
        Double serviceRev = jdbcTemplate.queryForObject(serviceRevSql, Double.class, bookingParams.toArray());

        String productRevSql = "SELECT COALESCE(SUM(total_price), 0) FROM orders WHERE status = 'delivered' AND " + branchConditionOrder + " AND " + timeCondition;
        Double productRev = jdbcTemplate.queryForObject(productRevSql, Double.class, orderParams.toArray());
        
        Double totalRev = serviceRev + productRev;

        // Previous Revenue for trend
        List<Object> bookingParamsPrev = new ArrayList<>();
        bookingParamsPrev.addAll(branchParams);
        bookingParamsPrev.addAll(timeParamsPrev);
        List<Object> orderParamsPrev = new ArrayList<>();
        orderParamsPrev.addAll(branchParams);
        orderParamsPrev.addAll(timeParamsPrev);

        Double prevServiceRev = jdbcTemplate.queryForObject("SELECT COALESCE(SUM(total_price), 0) FROM bookings WHERE status = 'COMPLETED' AND " + branchConditionBooking + " AND " + timeConditionPrev, Double.class, bookingParamsPrev.toArray());
        Double prevProductRev = jdbcTemplate.queryForObject("SELECT COALESCE(SUM(total_price), 0) FROM orders WHERE status = 'delivered' AND " + branchConditionOrder + " AND " + timeConditionPrev, Double.class, orderParamsPrev.toArray());
        Double prevTotalRev = prevServiceRev + prevProductRev;

        double revenueTrend = prevTotalRev == 0 ? (totalRev > 0 ? 100.0 : 0.0) : ((totalRev - prevTotalRev) / prevTotalRev * 100);

        Map<String, Object> revenue = new HashMap<>();
        revenue.put("total", totalRev);
        revenue.put("service", serviceRev);
        revenue.put("product", productRev);
        revenue.put("trend", Math.round(revenueTrend * 10) / 10.0);
        result.put("revenue", revenue);

        // 4. Completed Orders
        Integer serviceOrders = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM bookings WHERE status = 'COMPLETED' AND " + branchConditionBooking + " AND " + timeCondition, Integer.class, bookingParams.toArray());
        Integer productOrders = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM orders WHERE status = 'delivered' AND " + branchConditionOrder + " AND " + timeCondition, Integer.class, orderParams.toArray());
        Integer totalCompletedOrders = serviceOrders + productOrders;

        Integer prevServiceOrders = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM bookings WHERE status = 'COMPLETED' AND " + branchConditionBooking + " AND " + timeConditionPrev, Integer.class, bookingParamsPrev.toArray());
        Integer prevProductOrders = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM orders WHERE status = 'delivered' AND " + branchConditionOrder + " AND " + timeConditionPrev, Integer.class, orderParamsPrev.toArray());
        Integer prevTotalOrders = prevServiceOrders + prevProductOrders;
        double ordersTrend = prevTotalOrders == 0 ? (totalCompletedOrders > 0 ? 100.0 : 0.0) : ((double)(totalCompletedOrders - prevTotalOrders) / prevTotalOrders * 100);
        
        Map<String, Object> ordersData = new HashMap<>();
        ordersData.put("total", totalCompletedOrders);
        ordersData.put("trend", Math.round(ordersTrend * 10) / 10.0);
        result.put("completedOrders", ordersData);

        // 5. New Customers
        // Dựa trên bảng users tạo mới trong khoảng thời gian này
        String newCustSql = "SELECT COUNT(*) FROM users WHERE " + timeCondition;
        Integer newCustomers = jdbcTemplate.queryForObject(newCustSql, Integer.class, timeParams.toArray());
        result.put("newCustomers", newCustomers);

        // 6. Retention Rate
        // Tính tỷ lệ khách hàng quay lại (Số khách >= 2 đơn / Số khách có >= 1 đơn) TRONG TOÀN HỆ THỐNG
        // Để query dễ, tính trên bảng bookings:
        String retentionSql = "SELECT \n" +
                "  CASE \n" +
                "    WHEN COUNT(user_id) = 0 THEN 0\n" +
                "    ELSE SUM(CASE WHEN c >= 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(user_id)\n" +
                "  END as rate\n" +
                "FROM (\n" +
                "  SELECT user_id, COUNT(*) as c FROM bookings WHERE status = 'COMPLETED' GROUP BY user_id\n" +
                ") t";
        Double retentionRate = jdbcTemplate.queryForObject(retentionSql, Double.class);
        result.put("retentionRate", Math.round((retentionRate != null ? retentionRate : 0.0) * 10) / 10.0);

        // 7. Revenue Chart
        String groupByStr = "DATE(created_at)";
        if ("today".equals(timeRange)) groupByStr = "HOUR(created_at)";
        else if ("this_year".equals(timeRange)) groupByStr = "MONTH(created_at)";

        String chartServiceSql = "SELECT " + groupByStr + " as label, SUM(total_price) as val FROM bookings WHERE status = 'COMPLETED' AND " + branchConditionBooking + " AND " + timeCondition + " GROUP BY " + groupByStr;
        String chartProductSql = "SELECT " + groupByStr + " as label, SUM(total_price) as val FROM orders WHERE status = 'delivered' AND " + branchConditionOrder + " AND " + timeCondition + " GROUP BY " + groupByStr;
        
        List<Map<String, Object>> serviceList = jdbcTemplate.queryForList(chartServiceSql, bookingParams.toArray());
        List<Map<String, Object>> productList = jdbcTemplate.queryForList(chartProductSql, orderParams.toArray());

        Map<String, Map<String, Object>> chartMap = new LinkedHashMap<>();
        for (Map<String, Object> row : serviceList) {
            String label = String.valueOf(row.get("label"));
            chartMap.putIfAbsent(label, new HashMap<>(Map.of("name", label, "service", 0.0, "product", 0.0, "total", 0.0)));
            chartMap.get(label).put("service", row.get("val"));
            chartMap.get(label).put("total", ((Number)chartMap.get(label).get("total")).doubleValue() + ((Number)row.get("val")).doubleValue());
        }
        for (Map<String, Object> row : productList) {
            String label = String.valueOf(row.get("label"));
            chartMap.putIfAbsent(label, new HashMap<>(Map.of("name", label, "service", 0.0, "product", 0.0, "total", 0.0)));
            chartMap.get(label).put("product", row.get("val"));
            chartMap.get(label).put("total", ((Number)chartMap.get(label).get("total")).doubleValue() + ((Number)row.get("val")).doubleValue());
        }
        result.put("revenueChart", new ArrayList<>(chartMap.values()));

        // 8. Popular Services
        String popServicesSql = "SELECT s.name, COUNT(b.id) as count, SUM(b.total_price) as revenue FROM bookings b JOIN booking_services bs ON b.id = bs.booking_id JOIN services s ON bs.service_id = s.id WHERE b.status = 'COMPLETED' AND b." + branchConditionBooking + " AND b." + timeCondition + " GROUP BY s.id, s.name ORDER BY count DESC LIMIT 10";
        // Need to replace b.staff_id condition carefully.
        String bBranchCondition = branchConditionBooking.replace("staff_id", "b.staff_id");
        String bTimeCondition = timeCondition.replace("created_at", "b.created_at");
        String pPopSql = "SELECT s.name, COUNT(b.id) as count, COALESCE(SUM(s.price), 0) as revenue FROM bookings b JOIN booking_services bs ON b.id = bs.booking_id JOIN services s ON bs.service_id = s.id WHERE b.status = 'COMPLETED' AND " + bBranchCondition + " AND " + bTimeCondition + " GROUP BY s.id, s.name ORDER BY count DESC LIMIT 10";
        result.put("popularServices", jdbcTemplate.queryForList(pPopSql, bookingParams.toArray()));

        // 9. Best-Selling Products
        String oBranchCondition = branchConditionOrder.replace("order_branch", "o.order_branch");
        String oTimeCondition = timeCondition.replace("created_at", "o.created_at");
        String bestProductsSql = "SELECT p.name, SUM(oi.quantity) as count, SUM(oi.price * oi.quantity) as revenue FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id WHERE o.status = 'delivered' AND " + oBranchCondition + " AND " + oTimeCondition + " GROUP BY p.id, p.name ORDER BY count DESC LIMIT 10";
        result.put("popularProducts", jdbcTemplate.queryForList(bestProductsSql, orderParams.toArray()));

        // 10. Top Staff
        String topStaffSql = "SELECT st.id, st.name, st.avatar, st.branch, COUNT(b.id) as count, COALESCE(SUM(b.total_price), 0) as revenue FROM bookings b JOIN staff st ON b.staff_id = st.id WHERE b.status = 'COMPLETED' AND " + bBranchCondition + " AND " + bTimeCondition + " GROUP BY st.id, st.name, st.avatar, st.branch ORDER BY count DESC, revenue DESC LIMIT 5";
        result.put("topStaff", jdbcTemplate.queryForList(topStaffSql, bookingParams.toArray()));

        // 11. Revenue By Branch
        String revByBranchSql = "SELECT st.branch as name, COALESCE(SUM(b.total_price), 0) as revenue FROM bookings b JOIN staff st ON b.staff_id = st.id WHERE b.status = 'COMPLETED' AND " + bTimeCondition + " GROUP BY st.branch";
        result.put("revenueByBranch", jdbcTemplate.queryForList(revByBranchSql, timeParams.toArray()));

        // 12. Payment Methods
        String paySvcSql = "SELECT payment_method as name, SUM(total_price) as val FROM bookings WHERE status = 'COMPLETED' AND " + branchConditionBooking + " AND " + timeCondition + " GROUP BY payment_method";
        String payProdSql = "SELECT payment_method as name, SUM(total_price) as val FROM orders WHERE status = 'delivered' AND " + branchConditionOrder + " AND " + timeCondition + " GROUP BY payment_method";
        
        List<Map<String, Object>> paySvcList = jdbcTemplate.queryForList(paySvcSql, bookingParams.toArray());
        List<Map<String, Object>> payProdList = jdbcTemplate.queryForList(payProdSql, orderParams.toArray());
        Map<String, Double> paymentMap = new HashMap<>();
        for (Map<String, Object> row : paySvcList) {
            String k = String.valueOf(row.get("name"));
            paymentMap.put(k, paymentMap.getOrDefault(k, 0.0) + ((Number)row.get("val")).doubleValue());
        }
        for (Map<String, Object> row : payProdList) {
            String k = String.valueOf(row.get("name"));
            paymentMap.put(k, paymentMap.getOrDefault(k, 0.0) + ((Number)row.get("val")).doubleValue());
        }
        List<Map<String, Object>> paymentChart = new ArrayList<>();
        paymentMap.forEach((k, v) -> paymentChart.add(Map.of("name", k != null && !k.equals("null") ? k : "Khác", "value", v)));
        result.put("paymentMethods", paymentChart);

        // 13. Order Stats (Booking + Orders)
        // Bookings
        String statSvcSql = "SELECT status as name, COUNT(*) as val FROM bookings WHERE " + branchConditionBooking + " AND " + timeCondition + " GROUP BY status";
        // Orders
        String statProdSql = "SELECT status as name, COUNT(*) as val FROM orders WHERE " + branchConditionOrder + " AND " + timeCondition + " GROUP BY status";
        
        List<Map<String, Object>> statSvcList = jdbcTemplate.queryForList(statSvcSql, bookingParams.toArray());
        List<Map<String, Object>> statProdList = jdbcTemplate.queryForList(statProdSql, orderParams.toArray());
        Map<String, Integer> statusMap = new HashMap<>();
        for (Map<String, Object> row : statSvcList) {
            String k = String.valueOf(row.get("name")).toUpperCase();
            statusMap.put(k, statusMap.getOrDefault(k, 0) + ((Number)row.get("val")).intValue());
        }
        for (Map<String, Object> row : statProdList) {
            String k = String.valueOf(row.get("name")).toUpperCase();
            statusMap.put(k, statusMap.getOrDefault(k, 0) + ((Number)row.get("val")).intValue());
        }
        List<Map<String, Object>> orderStats = new ArrayList<>();
        statusMap.forEach((k, v) -> orderStats.add(Map.of("name", k, "value", v)));
        result.put("orderStats", orderStats);

        return result;
    }
}
