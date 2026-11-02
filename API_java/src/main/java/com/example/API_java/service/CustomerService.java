package com.example.API_java.service;

import com.example.API_java.dto.BookingHistoryDto;
import com.example.API_java.dto.CustomerDto;
import com.example.API_java.entity.Booking;
import com.example.API_java.entity.User;
import com.example.API_java.repository.OrderRepository;
import com.example.API_java.repository.BookingRepository;
import com.example.API_java.repository.UserRepository;
import com.example.API_java.repository.NotificationRepository;
import com.example.API_java.entity.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private com.example.API_java.repository.CustomerVoucherRepository customerVoucherRepository;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd-MM-yyyy");

    public String getCustomerTier(long bookingCount) {
        if (bookingCount <= 3)
            return "Ngôi Sao Mới";
        if (bookingCount >= 4 && bookingCount <= 10)
            return "Người Của Công Chúng";
        if (bookingCount >= 11 && bookingCount <= 25)
            return "Sát Thủ Lịch Lãm";
        if (bookingCount >= 26 && bookingCount <= 50)
            return "Biểu Tượng Thời Đại";
        return "Vũ Trụ Nhan Sắc";
    }

    public Map<String, Object> getCustomersWithFilters(int page, String sort, String rank, String search, String status) {
        List<User> users = userRepository.findAll().stream()
                .filter(u -> "USER".equalsIgnoreCase(u.getRole()))
                .collect(Collectors.toList());

        if (search != null && !search.trim().isEmpty()) {
            String keyword = search.toLowerCase().trim();
            users = users.stream()
                    .filter(u -> (u.getFullName() != null && u.getFullName().toLowerCase().contains(keyword)) ||
                            (u.getEmail() != null && u.getEmail().toLowerCase().contains(keyword)))
                    .collect(Collectors.toList());
        }

        List<CustomerDto> customers = users.stream()
                .map(this::toCustomerDto)
                .collect(Collectors.toList());

        if (rank != null && !rank.trim().isEmpty() && !"all".equalsIgnoreCase(rank)) {
            // Map the frontend rank code to actual tier name
            String targetTier = rank;
            if ("elite".equalsIgnoreCase(rank))
                targetTier = "Sát Thủ Lịch Lãm"; // Just an example, better exact string match

            // Actually, we'll match directly or by mapping. Let's just match the string or
            // ignore case
            final String finalRank = rank.toLowerCase();
            customers = customers.stream()
                    .filter(c -> c.getTier().toLowerCase().contains(finalRank))
                    .collect(Collectors.toList());
        }

        if ("locked_cod".equalsIgnoreCase(status)) {
            customers = customers.stream()
                    .filter(CustomerDto::getIsCashPaymentLocked)
                    .collect(Collectors.toList());
        } else if ("locked_account".equalsIgnoreCase(status)) {
            customers = customers.stream()
                    .filter(CustomerDto::getIsBlocked)
                    .collect(Collectors.toList());
        }

        if ("oldest".equalsIgnoreCase(sort)) {
            customers.sort(Comparator.comparing(c -> c.getId())); // assuming ID correlates with created_at
        } else {
            customers.sort((c1, c2) -> c2.getId().compareTo(c1.getId())); // newest
        }

        int limit = 10;
        int total = customers.size();
        int totalPages = (int) Math.ceil((double) total / limit);
        int start = (page - 1) * limit;
        int end = Math.min(start + limit, total);

        List<CustomerDto> paginated = (start <= total) ? customers.subList(start, end) : List.of();

        Map<String, Object> response = new HashMap<>();
        response.put("data", paginated);
        response.put("total", total);
        response.put("page", page);
        response.put("totalPages", totalPages);
        return response;
    }

    /** Lấy chi tiết một khách hàng theo ID */
    public CustomerDto getCustomerById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng!"));
        return toCustomerDto(user);
    }

    /**
     * Lấy lịch sử đặt lịch của một khách hàng (Không cần thiết nữa nhưng giữ tạm)
     */
    public List<BookingHistoryDto> getBookingHistory(Integer userId) {
        List<Booking> bookings = bookingRepository.findByUser_IdOrderByBookingDateDesc(userId);
        return bookings.stream()
                .map(b -> {
                    String date = b.getBookingDate() != null
                            ? b.getBookingDate().format(DATE_FMT)
                            : "N/A";
                    String serviceName = (b.getService() != null) ? b.getService().getName() : "N/A";
                    BigDecimal price = (b.getService() != null) ? b.getService().getPrice() : BigDecimal.ZERO;
                    return new BookingHistoryDto(b.getId(), date, serviceName, price, b.getStatus());
                })
                .collect(Collectors.toList());
    }

    /** Chuyển entity User → CustomerDto */
    private CustomerDto toCustomerDto(User user) {
        int userId = (user.getId() != null) ? user.getId() : 0;
        long uIdLong = (long) userId;

        BigDecimal serviceSpent = bookingRepository.getServiceSpentByUserId(userId);
        if (serviceSpent == null)
            serviceSpent = BigDecimal.ZERO;

        Double prodSpentDb = orderRepository.getProductSpentByUserId(uIdLong);
        BigDecimal productSpent = (prodSpentDb != null) ? BigDecimal.valueOf(prodSpentDb) : BigDecimal.ZERO;

        BigDecimal totalSpent = serviceSpent.add(productSpent);

        long count = bookingRepository.getCompletedBookingCount(userId);
        String tier = getCustomerTier(count);

        String lastVisit = bookingRepository
                .findTopByUser_IdOrderByBookingDateDesc(userId)
                .map(b -> b.getBookingDate() != null ? b.getBookingDate().format(DATE_FMT) : "N/A")
                .orElse("Chưa có");

        String createdAt = (user.getCreatedAt() != null)
                ? user.getCreatedAt().toLocalDate().format(DATE_FMT)
                : "N/A";

        return new CustomerDto(
                user.getId(),
                user.getFullName() != null ? user.getFullName() : user.getUsername(),
                user.getEmail() != null ? user.getEmail() : "",
                user.getAvatar() != null ? user.getAvatar() : "", // Default in frontend if empty
                createdAt,
                totalSpent,
                serviceSpent,
                productSpent,
                count,
                tier,
                lastVisit,
                user.getIsCashPaymentLocked() != null ? user.getIsCashPaymentLocked() : false,
                user.getIsBlocked() != null ? user.getIsBlocked() : false,
                user.getBlockedReason());
    }

    public CustomerDto lockCashPayment(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng!"));
        user.setIsCashPaymentLocked(true);
        userRepository.save(user);

        // Tạo thông báo
        Notification notif = new Notification();
        notif.setUser(user);
        notif.setType("system");
        notif.setTitle("Thông Báo Hệ Thống - Khóa COD 😢");
        notif.setMessage(
                "Xin chào quý khách. Hệ thống ghi nhận tài khoản của quý khách có lịch sử đặt hàng chưa thành công nhiều lần. Vì vậy, tính năng Thanh toán khi nhận hàng (COD) đã bị tạm khóa.\n\nQuý khách vẫn có thể tiếp tục mua sắm bình thường bằng các hình thức thanh toán trực tuyến (VNPay, MoMo). Hệ thống sẽ tự động xem xét và mở lại chức năng COD khi quý khách khôi phục mức độ uy tín qua các đơn hàng sắp tới. Cảm ơn quý khách đã đồng hành cùng Hornet Royale!");
        notificationRepository.save(notif);

        return toCustomerDto(user);
    }

    public CustomerDto unlockCashPayment(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng!"));
        user.setIsCashPaymentLocked(false);
        userRepository.save(user);

        // Tạo thông báo
        Notification notif = new Notification();
        notif.setUser(user);
        notif.setType("system");
        notif.setTitle("Thông Báo Hệ Thống - Mở COD 🥳");
        notif.setMessage(
                "Tuyệt vời! Chức năng Thanh toán khi nhận hàng (COD) của quý khách đã được mở lại thành công. Cảm ơn quý khách đã duy trì uy tín mua sắm cùng Hornet Royale!");
        notificationRepository.save(notif);

        return toCustomerDto(user);
    }

    public CustomerDto blockCustomer(Integer id, String reason) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng!"));
        user.setIsBlocked(true);
        user.setBlockedReason(reason);
        user.setBlockedAt(java.time.LocalDateTime.now());
        // blockedBy could be set if we pass adminId, assuming 1 for now or skip
        userRepository.save(user);
        return toCustomerDto(user);
    }

    public CustomerDto unblockCustomer(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng!"));
        user.setIsBlocked(false);
        user.setBlockedReason(null);
        user.setBlockedAt(null);
        userRepository.save(user);
        return toCustomerDto(user);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteCustomer(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng!"));

        // 1. Delete notifications
        List<Notification> notifs = notificationRepository.findByUser_IdOrderByCreatedAtDesc(id);
        notificationRepository.deleteAll(notifs);

        // 2. Delete CustomerVouchers
        List<com.example.API_java.entity.CustomerVoucher> cvs = customerVoucherRepository.findByUserIdOrderByClaimedAtDesc(id);
        customerVoucherRepository.deleteAll(cvs);

        // 3. Nullify Bookings
        List<Booking> bookings = bookingRepository.findByUser_IdOrderByBookingDateDesc(id);
        for (Booking b : bookings) {
            b.setUser(null);
            bookingRepository.save(b);
        }

        // 4. Nullify Orders
        List<com.example.API_java.entity.Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc((long) id);
        for (com.example.API_java.entity.Order o : orders) {
            o.setUserId(null);
            o.setUser(null);
            orderRepository.save(o);
        }

        // 5. Delete User
        userRepository.delete(user);
    }
}
