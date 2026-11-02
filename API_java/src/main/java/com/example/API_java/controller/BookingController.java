package com.example.API_java.controller;

import com.example.API_java.entity.Booking;
import com.example.API_java.entity.Service;
import com.example.API_java.entity.Staff;
import com.example.API_java.repository.BookingRepository;
import com.example.API_java.repository.ServiceRepository;
import com.example.API_java.repository.StaffRepository;
import com.example.API_java.repository.UserRepository;
import com.example.API_java.repository.NotificationRepository;
import com.example.API_java.service.VnPayService;
import com.example.API_java.service.MoMoService;
import com.example.API_java.service.StaffLeaveService;
import com.example.API_java.entity.User;
import com.example.API_java.entity.Notification;
import com.example.API_java.entity.CustomerVoucher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private static final Logger log = LoggerFactory.getLogger(BookingController.class);

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private VnPayService vnPayService;

    @Autowired
    private MoMoService moMoService;

    @Autowired
    private com.example.API_java.service.VoucherService voucherService;

    @Autowired
    private com.example.API_java.repository.CustomerVoucherRepository customerVoucherRepository;

    @Autowired
    private com.example.API_java.service.BookingService bookingService;

    @Autowired
    private com.example.API_java.service.BookingAssignmentService bookingAssignmentService;

    // Inject StaffLeaveService để validate nhân viên không nghỉ khi tạo booking
    @Autowired
    private StaffLeaveService staffLeaveService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String branch, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        try {
            bookingService.autoCompletePastBookings();
        } catch (Exception e) {
            log.error("Error auto-completing bookings: {}", e.getMessage());
        }

        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null || "EMPLOYEE".equals(user.getRole())) {
            return ResponseEntity.status(403).body("Bạn không có quyền truy cập");
        }

        List<Booking> bookings = bookingRepository.findByStatusInOrderByIdDesc(List.of("PAID", "COMPLETED", "CANCELLED"));
        
        String filterBranch = branch;
        // Nếu là Editor, bắt buộc filter theo chi nhánh của Editor đó, bỏ qua tham số branch từ client
        if ("EDITOR".equals(user.getRole())) {
            filterBranch = user.getBranch();
        }

        if (filterBranch != null && !filterBranch.trim().isEmpty()) {
            String searchBranch = filterBranch;
            if ("CN 1".equalsIgnoreCase(filterBranch)) searchBranch = "Quận 1";
            else if ("CN 2".equalsIgnoreCase(filterBranch)) searchBranch = "Quận 2";
            else if ("CN 3".equalsIgnoreCase(filterBranch)) searchBranch = "Quận 3";
            else if ("CN 7".equalsIgnoreCase(filterBranch)) searchBranch = "Quận 7";
            else if ("CN 9".equalsIgnoreCase(filterBranch)) searchBranch = "Quận 9";
            else if ("CN BT".equalsIgnoreCase(filterBranch)) searchBranch = "Bình Thạnh";

            final String finalSearchBranch = searchBranch;
            bookings = bookings.stream()
                    .filter(b -> b.getStaff() != null && finalSearchBranch.equalsIgnoreCase(b.getStaff().getBranch()))
                    .collect(java.util.stream.Collectors.toList());
        }
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<?> getMyBookings(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        try {
            bookingService.autoCompletePastBookings();
        } catch (Exception e) {
            log.error("Error auto-completing bookings: {}", e.getMessage());
        }

        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }
        List<Booking> list = bookingRepository.findByUser_IdOrderByBookingDateDesc(user.getId());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/my-bookings/count")
    public ResponseEntity<?> getMyBookingsCount(Authentication authentication) {
        if (authentication == null) return ResponseEntity.ok(0);
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.ok(0);

        long count = bookingRepository.countByUser_IdAndStatus(user.getId(), "PAID") +
                     bookingRepository.countByUser_IdAndStatus(user.getId(), "COMPLETED");
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{id}")
    public Booking getById(@PathVariable Integer id) {
        return bookingRepository.findById(id).orElse(null);
    }

    @GetMapping("/debug/last")
    public ResponseEntity<?> getLastBooking() {
        Booking last = bookingRepository.findAll().stream().max(java.util.Comparator.comparing(Booking::getId)).orElse(null);
        return ResponseEntity.ok(last);
    }

    @PostMapping("/assign-employee")
    public ResponseEntity<?> assignEmployeeApi(@RequestBody Map<String, Object> data) {
        try {
            String branch = (String) data.get("branch");
            LocalDate date = LocalDate.parse(data.get("bookingDate").toString());
            LocalTime time = LocalTime.parse(data.get("bookingTime").toString());
            int duration = 30;
            
            if (data.get("duration") != null) {
                duration = Integer.parseInt(data.get("duration").toString());
            } else if (data.get("serviceIds") != null) {
                List<Integer> serviceIds = (List<Integer>) data.get("serviceIds");
                List<Service> svcs = serviceRepository.findAllById(serviceIds);
                duration = svcs.stream().mapToInt(s -> s.getDuration() != null ? s.getDuration() : 30).sum();
            } else if (data.get("serviceId") != null) {
                Integer serviceId = Integer.valueOf(data.get("serviceId").toString());
                Service svc = serviceRepository.findById(serviceId).orElse(null);
                if (svc != null && svc.getDuration() != null) duration = svc.getDuration();
            }

            com.example.API_java.dto.BookingAssignmentResult result = bookingAssignmentService.assignEmployee(branch, date, time, duration);
            if (result.getEmployeeId() == null) {
                return ResponseEntity.badRequest().body(result);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    /**
     * Tạo đơn đặt lịch mới.
     */
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Map<String, Object> data, Authentication authentication) {
        try {
            Booking booking = new Booking();

            // Link user if logged in
            if (authentication != null) {
                User user = userRepository.findByUsername(authentication.getName()).orElse(null);
                if (user != null) {
                    if (Boolean.TRUE.equals(user.getIsBlocked())) {
                        return ResponseEntity.status(403).body("Tài khoản của bạn đã bị khóa. Lý do: " + (user.getBlockedReason() != null ? user.getBlockedReason() : ""));
                    }
                    if ("EDITOR".equals(user.getRole())) {
                        booking.setCreatedByEditor(user.getUsername());
                    } else {
                        booking.setUser(user);
                    }
                }
            }

            booking.setCustomerName((String) data.get("customerName"));
            booking.setCustomerPhone((String) data.get("customerPhone"));
            booking.setCustomerEmail((String) data.get("customerEmail"));

            // Service(s)
            Object serviceIdsObj = data.get("serviceIds");
            if (serviceIdsObj != null) {
                List<Integer> serviceIds = (List<Integer>) serviceIdsObj;
                List<Service> selectedServices = serviceRepository.findAllById(serviceIds);
                if (selectedServices.isEmpty()) {
                    return ResponseEntity.badRequest().body("No valid services selected");
                }

                booking.setService(selectedServices.get(0));
                booking.setServices(selectedServices);

                java.math.BigDecimal total = java.math.BigDecimal.ZERO;
                int duration = 0;
                for (Service s : selectedServices) {
                    total = total.add(s.getPrice());
                    duration += (s.getDuration() != null ? s.getDuration() : 30);
                }
                booking.setTotalPrice(total);
                booking.setDuration(duration);
            } else {
                Integer serviceId = Integer.valueOf(data.get("serviceId").toString());
                Service service = serviceRepository.findById(serviceId).orElse(null);
                if (service == null) {
                    return ResponseEntity.badRequest().body("Service not found");
                }
                booking.setService(service);
                booking.setServices(List.of(service));
                booking.setTotalPrice(service.getPrice());
                booking.setDuration(service.getDuration() != null ? service.getDuration() : 30);
            }

            // Staff
            if (data.get("staffId") != null) {
                Integer staffId = Integer.valueOf(data.get("staffId").toString());
                Staff staff = staffRepository.findById(staffId).orElse(null);
                if (staff == null) {
                    return ResponseEntity.badRequest().body("Không tìm thấy nhân viên");
                }
                // === BACKEND VALIDATION: Kiểm tra nhân viên có nghỉ không (lần kiểm tra cuối ở backend) ===
                LocalDate bookingDate = LocalDate.parse(data.get("bookingDate").toString());
                if (staffLeaveService.isStaffOnLeave(staffId, bookingDate)) {
                    return ResponseEntity.status(409).body(Map.of(
                        "error", "STAFF_NOT_AVAILABLE",
                        "message", "Nhân viên vừa được cập nhật lịch nghỉ. Vui lòng chọn nhân viên khác."
                    ));
                }
                booking.setStaff(staff);
            } else {
                // Auto assign if staffId is null (Bất kỳ thợ nào)
                String branch = (String) data.get("branch");
                if (branch == null || branch.isEmpty()) {
                    return ResponseEntity.badRequest().body("Vui lòng chọn chi nhánh để phân công tự động.");
                }
                LocalDate bookingDate = LocalDate.parse(data.get("bookingDate").toString());
                LocalTime bookingTime = LocalTime.parse(data.get("bookingTime").toString());
                
                com.example.API_java.dto.BookingAssignmentResult assignResult = bookingAssignmentService.assignEmployee(branch, bookingDate, bookingTime, booking.getDuration());
                if (assignResult.getEmployeeId() == null) {
                    return ResponseEntity.badRequest().body("Rất tiếc! " + assignResult.getReason());
                }
                booking.setStaff(assignResult.getStaff());
                booking.setNote((booking.getNote() != null ? booking.getNote() + "\n" : "") + "[Auto Assign] " + assignResult.getReason());
            }

            // Date & Time
            booking.setBookingDate(LocalDate.parse(data.get("bookingDate").toString()));
            LocalTime startTime = LocalTime.parse(data.get("bookingTime").toString());
            booking.setBookingTime(startTime);
            booking.setEndTime(startTime.plusMinutes(booking.getDuration()));

            // Payment
            booking.setPaymentMethod((String) data.get("paymentMethod"));
            booking.setStatus("PENDING");

            if (data.get("note") != null) {
                booking.setNote(data.get("note").toString());
            }

            // Apply Voucher if customerVoucherId is provided
            Integer customerVoucherId = null;
            if (data.containsKey("customerVoucherId") && data.get("customerVoucherId") != null) {
                try {
                    customerVoucherId = Integer.valueOf(data.get("customerVoucherId").toString());

                    Integer voucherUserId = booking.getUser() != null ? booking.getUser().getId() : null;

                    if (voucherUserId == null && authentication != null && authentication.getName() != null && !authentication.getName().equals("anonymousUser")) {
                        User u = userRepository.findByUsername(authentication.getName()).orElse(null);
                        if (u != null) {
                            voucherUserId = u.getId();
                        }
                    }

                    if (voucherUserId == null) {
                        return ResponseEntity.badRequest().body("Vui lòng đăng nhập để sử dụng voucher.");
                    }

                    double originalAmount = booking.getTotalPrice().doubleValue();
                    Map<String, Object> discountInfo = voucherService.validateAndCalculateDiscount(voucherUserId, customerVoucherId, "SERVICE", originalAmount);
                    double discountAmount = ((Number) discountInfo.get("discountAmount")).doubleValue();
                    booking.setTotalPrice(java.math.BigDecimal.valueOf(originalAmount - discountAmount));
                } catch (Exception e) {
                    System.err.println("Error validating voucher for booking: " + e.getMessage());
                    return ResponseEntity.badRequest().body("Lỗi áp dụng voucher: " + e.getMessage());
                }
            }

            Booking saved = bookingRepository.save(booking);

            if (customerVoucherId != null) {
                try {
                    Integer vUserId = null;
                    if (booking.getUser() != null) {
                        vUserId = booking.getUser().getId();
                    } else if (authentication != null && authentication.getName() != null && !authentication.getName().equals("anonymousUser")) {
                        User u = userRepository.findByUsername(authentication.getName()).orElse(null);
                        if (u != null) {
                            vUserId = u.getId();
                        }
                    }
                    if (vUserId != null) {
                        Long bookingIdForVoucher = saved.getId() != null ? saved.getId().longValue() : null;
                        voucherService.useVoucher(vUserId, customerVoucherId, null, bookingIdForVoucher);
                    }
                } catch (Exception ex) {
                    System.err.println("Error marking voucher as used: " + ex.getMessage());
                }
            }

            // Notify Admin
            List<User> admins = userRepository.findByRole("ADMIN");
            for (User admin : admins) {
                com.example.API_java.entity.Notification notif = new com.example.API_java.entity.Notification();
                notif.setUser(admin);
                notif.setType("booking");
                notif.setTitle("Đơn đặt lịch mới");
                notif.setMessage("Khách hàng " + saved.getCustomerName() + " vừa đặt lịch mới.");
                notificationRepository.save(notif);
            }

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating booking: " + e.getMessage());
        }
    }

    /**
     * Cập nhật trạng thái booking (dùng sau khi thanh toán thành công hoặc admin hoàn thành)
     * CHÚ Ý: Chỉ ADMIN/EDITOR mới được phép chuyển trạng thái sang COMPLETED.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Integer id,
                                          @RequestBody Map<String, String> data,
                                          Authentication authentication) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }

        String oldStatus = booking.getStatus();
        String newStatus = data.get("status");

        // --- AUDIT LOGGING ---
        String callerName = (authentication != null) ? authentication.getName() : "[UNAUTHENTICATED]";
        log.info("[STATUS CHANGE] Booking #{}: {} -> {} | Caller: {}",
                id, oldStatus, newStatus, callerName);

        // --- ROLE GUARD: Only ADMIN or EDITOR can set COMPLETED ---
        if ("COMPLETED".equalsIgnoreCase(newStatus)) {
            if (authentication == null) {
                log.warn("[SECURITY] Unauthenticated attempt to set COMPLETED on Booking #{}", id);
                return ResponseEntity.status(401).body("Xác thực bắt buộc để hoàn thành lịch hẹn.");
            }
            User caller = userRepository.findByUsername(authentication.getName()).orElse(null);
            if (caller == null || (!"ADMIN".equals(caller.getRole()) && !"EDITOR".equals(caller.getRole()))) {
                log.warn("[SECURITY] Unauthorized COMPLETED attempt on Booking #{} by user '{}' (role={})",
                        id, callerName, caller != null ? caller.getRole() : "unknown");
                return ResponseEntity.status(403).body("Chỉ ADMIN hoặc EDITOR mới được hoàn thành lịch hẹn.");
            }
            log.info("[AUTHORIZED] COMPLETED status approved for Booking #{} by {} ({})",
                    id, caller.getUsername(), caller.getRole());
        }

        booking.setStatus(newStatus);
        if (data.get("transactionNo") != null) {
            booking.setTransactionNo(data.get("transactionNo"));
        }
        bookingRepository.save(booking);

        // Trigger voucher campaigns on completion
        if ("COMPLETED".equalsIgnoreCase(newStatus) && !"COMPLETED".equalsIgnoreCase(oldStatus) && booking.getUser() != null) {
            try {
                voucherService.evaluateCampaigns(booking.getUser().getId(), "FIRST_BOOKING_COMPLETED", null);
                voucherService.evaluateCampaigns(booking.getUser().getId(), "BOOKING_COUNT_X", null);
                voucherService.evaluateCampaigns(booking.getUser().getId(), "COMPLETED_HAIRCUTS_X", null);
                voucherService.evaluateCampaigns(booking.getUser().getId(), "MEMBERSHIP_TIER", null);
            } catch (Exception e) {
                log.error("[VOUCHER] Error evaluating campaigns for Booking #{}: {}", id, e.getMessage());
            }
        }

        return ResponseEntity.ok(booking);
    }

    @GetMapping("/check-availability")
    public ResponseEntity<?> checkAvailability(@RequestParam Integer barberId, @RequestParam String date) {
        LocalDate bookingDate = LocalDate.parse(date);
        
        // Nếu thợ nghỉ, block toàn bộ lịch trong ngày
        if (staffLeaveService.isStaffOnLeave(barberId, bookingDate)) {
            Booking fullDayBlock = new Booking();
            fullDayBlock.setBookingTime(LocalTime.of(0, 0));
            fullDayBlock.setDuration(1440); // 24 giờ
            return ResponseEntity.ok(List.of(fullDayBlock));
        }

        List<Booking> bookings = bookingRepository.findByStaff_IdAndBookingDateAndStatusIn(barberId, bookingDate, java.util.Arrays.asList("PAID", "COMPLETED"));
        return ResponseEntity.ok(bookings);
    }

    /**
     * Xóa booking PENDING (khi user quay lại từ trang thanh toán)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Integer id) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }
        if (!"PENDING".equals(booking.getStatus())) {
            return ResponseEntity.badRequest().body("Chỉ có thể xóa booking ở trạng thái PENDING");
        }

        // Release voucher if applied
        if (booking.getUser() != null) {
            try {
                List<CustomerVoucher> cvs = customerVoucherRepository.findByUserIdOrderByClaimedAtDesc(booking.getUser().getId());
                for (CustomerVoucher cv : cvs) {
                    if (cv.getBookingId() != null && cv.getBookingId().equals((long) booking.getId())) {
                        voucherService.releaseVoucher(booking.getUser().getId(), cv.getId());
                    }
                }
            } catch (Exception e) {
                System.err.println("Error releasing voucher for deleted booking: " + e.getMessage());
            }
        }

        bookingRepository.delete(booking);
        return ResponseEntity.ok().build();
    }

    /**
     * Admin hủy lịch và hoàn tiền
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBookingAndRefund(@PathVariable Integer id,
                                                     @RequestBody(required = false) Map<String, String> payload,
                                                     HttpServletRequest request) {
        try {
            Booking booking = bookingRepository.findById(id).orElse(null);
            if (booking == null) {
                return ResponseEntity.badRequest().body("Booking not found");
            }

            if ("CANCELLED".equals(booking.getStatus())) {
                return ResponseEntity.badRequest().body("Lịch đặt này đã bị hủy trước đó.");
            }

            String cancelReason = "admin_cancel";
            String cancelledBy = "Admin";

            if (payload != null) {
                if (payload.containsKey("cancelReason")) cancelReason = payload.get("cancelReason");
                if (payload.containsKey("cancelledBy")) cancelledBy = payload.get("cancelledBy");
            }

            boolean refundSuccess = true;
            String refundStatus = "no_refund";

            if ("admin_cancel".equals(cancelReason)) {
                if ("PAID".equals(booking.getStatus())) {
                    if ("VNPAY".equals(booking.getPaymentMethod())) {
                        refundSuccess = vnPayService.refundPayment(booking, request.getRemoteAddr());
                    } else if ("MOMO".equals(booking.getPaymentMethod())) {
                        refundSuccess = moMoService.refundPayment(booking);
                    }
                    if (refundSuccess) refundStatus = "success";
                }
            } else if ("late_customer".equals(cancelReason)) {
                refundStatus = "no_refund";
                refundSuccess = true;
            }

            if (!refundSuccess) {
                return ResponseEntity.badRequest().body("Không thể hoàn tiền (Gateway từ chối hoặc lỗi cấu hình). Không thể hủy lịch.");
            }

            booking.setStatus("CANCELLED");
            booking.setCancelReason(cancelReason);
            booking.setCancelledAt(LocalDateTime.now());
            booking.setCancelledBy(cancelledBy);
            booking.setRefundStatus(refundStatus);
            bookingRepository.save(booking);

            // Release voucher if applied
            if (booking.getUser() != null) {
                try {
                    List<CustomerVoucher> cvs = customerVoucherRepository.findByUserIdOrderByClaimedAtDesc(booking.getUser().getId());
                    for (CustomerVoucher cv : cvs) {
                        if (cv.getBookingId() != null && cv.getBookingId().equals((long) booking.getId())) {
                            voucherService.releaseVoucher(booking.getUser().getId(), cv.getId());
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error releasing voucher for cancelled booking: " + e.getMessage());
                }

                Notification notif = new Notification();
                notif.setUser(booking.getUser());
                notif.setType("cancel");
                notif.setTitle("❌ Lịch hẹn của bạn đã bị hủy");

                if ("late_customer".equals(cancelReason)) {
                    notif.setMessage("Lịch hẹn của bạn đã bị hủy do không đến đúng thời gian đã đặt.\n\nHORNET ROYALE luôn cố gắng giữ đúng lịch phục vụ cho tất cả khách hàng nên hệ thống không thể giữ chỗ quá thời gian quy định.\n\nKhoản thanh toán của lịch hẹn này sẽ không được hoàn lại theo chính sách đặt lịch đã được thông báo trước khi xác nhận thanh toán.\n\nNếu bạn cần hỗ trợ thêm hoặc có vấn đề chưa rõ, vui lòng liên hệ với chúng tôi trong mục Liên Hệ để được hỗ trợ nhanh nhất.");
                } else {
                    notif.setMessage("HORNET ROYALE rất xin lỗi vì sự cố ngoài mong muốn. Lịch hẹn của bạn đã bị hủy và đã được hoàn tiền (nếu có). Mong bạn thông cảm và đặt lại lịch vào một thời gian khác.");
                }

                Map<String, Object> dataMap = new HashMap<>();
                dataMap.put("booking_id", booking.getId());
                dataMap.put("service_name", booking.getService() != null ? booking.getService().getName() : "");
                dataMap.put("service_price", booking.getService() != null ? booking.getService().getPrice() : 0);
                dataMap.put("service_duration", booking.getService() != null ? booking.getService().getDuration() : 0);
                dataMap.put("barber_name", booking.getStaff() != null ? booking.getStaff().getName() : "");
                dataMap.put("branch_name", booking.getStaff() != null ? booking.getStaff().getBranch() : "");
                dataMap.put("booking_date", booking.getBookingDate().toString());
                dataMap.put("booking_time", booking.getBookingTime().toString());
                dataMap.put("payment_method", booking.getPaymentMethod());
                dataMap.put("email", booking.getCustomerEmail());
                dataMap.put("phone", booking.getCustomerPhone());
                dataMap.put("cancel_reason", cancelReason);
                dataMap.put("cancelled_at", booking.getCancelledAt().toString());
                dataMap.put("cancelled_by", cancelledBy);
                dataMap.put("refund_status", refundStatus);

                try {
                    com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                    notif.setDataJson(mapper.writeValueAsString(dataMap));
                } catch (Exception e) {
                    notif.setDataJson("{}");
                }

                notificationRepository.save(notif);
            }

            return ResponseEntity.ok("Hủy lịch và hoàn tiền thành công!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
