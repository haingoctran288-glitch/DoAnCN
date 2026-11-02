package com.example.API_java.service;

import com.example.API_java.config.VnPayConfig;
import com.example.API_java.entity.Order;
import com.example.API_java.util.VnPayUtility;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VnPayService {

    @Autowired
    private VnPayConfig vnPayConfig;

    public String createPaymentUrl(Order order, String ipAddr) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_OrderType = "other";
        long amount = Math.round(order.getTotalPrice() * 100L); // VNPay yêu cầu số tiền nhân với 100
        String vnp_TxnRef = order.getId().toString();
        String vnp_TmnCode = vnPayConfig.getTmnCode();

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang #" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", vnp_OrderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnp_Params.put("vnp_IpAddr", ipAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VnPayUtility.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        return vnPayConfig.getVnpUrl() + "?" + queryUrl;
    }

    public boolean verifyReturn(Map<String, String> vnp_Params) {
        String vnp_SecureHash = vnp_Params.get("vnp_SecureHash");
        Map<String, String> fields = new HashMap<>();
        for (Map.Entry<String, String> entry : vnp_Params.entrySet()) {
            if (entry.getKey().startsWith("vnp_") && !entry.getKey().equals("vnp_SecureHash") && !entry.getKey().equals("vnp_SecureHashType")) {
                fields.put(entry.getKey(), entry.getValue());
            }
        }
        String calculatedHash = VnPayUtility.hashAllFields(fields, vnPayConfig.getHashSecret());
        System.out.println("Calculated Hash: " + calculatedHash);
        System.out.println("VNPAY Hash: " + vnp_SecureHash);
        return calculatedHash.equalsIgnoreCase(vnp_SecureHash);
    }

    public String createPaymentUrlForBooking(com.example.API_java.entity.Booking booking, String ipAddr, String dynamicReturnUrl) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_OrderType = "other";
        long amount = Math.round(booking.getTotalPrice().doubleValue() * 100L); // VNPay yêu cầu số tiền nhân với 100
        String vnp_TxnRef = "B_" + booking.getId().toString();
        String vnp_TmnCode = vnPayConfig.getTmnCode();

        String returnUrl = (dynamicReturnUrl != null && !dynamicReturnUrl.isEmpty()) ? dynamicReturnUrl : vnPayConfig.getReturnUrl();

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan dat lich #" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", vnp_OrderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", returnUrl);
        vnp_Params.put("vnp_IpAddr", ipAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VnPayUtility.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        return vnPayConfig.getVnpUrl() + "?" + queryUrl;
    }

    public boolean refundPayment(com.example.API_java.entity.Booking booking, String ipAddr) {
        try {
            String vnp_Version = "2.1.0";
            String vnp_Command = "refund";
            String vnp_TmnCode = vnPayConfig.getTmnCode();
            String vnp_TransactionType = "02"; // 02 is full refund
            String vnp_TxnRef = "B_" + booking.getId().toString();
            long amount = Math.round(booking.getTotalPrice().doubleValue() * 100L);
            String vnp_Amount = String.valueOf(amount);
            String vnp_OrderInfo = "Hoan tien dat lich #" + vnp_TxnRef;
            
            // Generate request id (unique per refund)
            String vnp_RequestId = UUID.randomUUID().toString();
            String vnp_CreateBy = "Admin";
            
            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());
            
            // Require transaction date, but we don't store it exactly in format, let's try using booking date or empty
            // Usually we need the exact payment date. Let's use the created_at of booking for simplicity or just create date
            String vnp_TransactionDate = formatter.format(cld.getTime());

            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.put("vnp_TransactionType", vnp_TransactionType);
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_Amount", vnp_Amount);
            vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
            vnp_Params.put("vnp_TransactionDate", vnp_TransactionDate);
            vnp_Params.put("vnp_CreateBy", vnp_CreateBy);
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
            vnp_Params.put("vnp_IpAddr", ipAddr);
            vnp_Params.put("vnp_RequestId", vnp_RequestId);

            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }
            
            // vnp_SecureHash for refund needs a different format according to some docs, 
            // but standard vnp_Command API requires hashing the query string
            String vnp_SecureHash = VnPayUtility.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
            vnp_Params.put("vnp_SecureHash", vnp_SecureHash);

            // Using RestTemplate to post to VNPay API
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
            
            org.springframework.http.HttpEntity<Map<String, String>> entity = new org.springframework.http.HttpEntity<>(vnp_Params, headers);
            
            // Sandbox refund endpoint
            String refundUrl = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";
            
            org.springframework.http.ResponseEntity<Map> response = restTemplate.postForEntity(refundUrl, entity, Map.class);
            Map body = response.getBody();
            if (body != null) {
                String responseCode = (String) body.get("vnp_ResponseCode");
                System.out.println("VNPay Refund Response: " + body);
                // "00" is success
                return "00".equals(responseCode);
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Hoàn tiền cho đơn hàng (Order) qua VNPay
     */
    public boolean refundOrder(Order order, String ipAddr) {
        try {
            String vnp_Version = "2.1.0";
            String vnp_Command = "refund";
            String vnp_TmnCode = vnPayConfig.getTmnCode();
            String vnp_TransactionType = "02"; // full refund
            String vnp_TxnRef = order.getId().toString();
            long amount = Math.round(order.getTotalPrice() * 100L);
            String vnp_Amount = String.valueOf(amount);
            String vnp_OrderInfo = "Hoan tien don hang #" + vnp_TxnRef;

            String vnp_RequestId = UUID.randomUUID().toString();
            String vnp_CreateBy = "Admin";

            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());
            String vnp_TransactionDate = formatter.format(cld.getTime());

            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.put("vnp_TransactionType", vnp_TransactionType);
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_Amount", vnp_Amount);
            vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
            vnp_Params.put("vnp_TransactionDate", vnp_TransactionDate);
            vnp_Params.put("vnp_CreateBy", vnp_CreateBy);
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
            vnp_Params.put("vnp_IpAddr", ipAddr);
            vnp_Params.put("vnp_RequestId", vnp_RequestId);

            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII)).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }

            String vnp_SecureHash = VnPayUtility.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
            vnp_Params.put("vnp_SecureHash", vnp_SecureHash);

            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

            org.springframework.http.HttpEntity<Map<String, String>> entity = new org.springframework.http.HttpEntity<>(vnp_Params, headers);
            String refundUrl = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";

            org.springframework.http.ResponseEntity<Map> response = restTemplate.postForEntity(refundUrl, entity, Map.class);
            Map body = response.getBody();
            if (body != null) {
                String responseCode = (String) body.get("vnp_ResponseCode");
                System.out.println("VNPay Order Refund Response: " + body);
                return "00".equals(responseCode);
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
