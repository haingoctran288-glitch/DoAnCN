package com.example.API_java.service;

import com.example.API_java.entity.*;
import com.example.API_java.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

/**
 * Core service quản lý lịch nghỉ nhân viên.
 *
 * LUỒNG CHÍNH:
 * 1. Admin gọi preview() → Hệ thống phân tích booking bị ảnh hưởng, tìm thợ thay thế → trả về kết quả (KHÔNG LƯU DB)
 * 2. Admin xem Preview, chọn thợ thay thế cho từng booking
 * 3. Admin gọi confirm() → Hệ thống thực thi: tạo StaffLeave, lock booking, đổi thợ, refund, sinh payroll deduction, ghi log
 */
@Service
public class StaffLeaveService {

    private static final Logger log = LoggerFactory.getLogger(StaffLeaveService.class);

    // Tỷ lệ khấu trừ mặc định (có thể cấu hình qua DB sau)
    private static final int PAID_DEDUCTION_RATE = 70;    // Nghỉ có phép: trừ 70%
    private static final int UNPAID_DEDUCTION_RATE = 100; // Không phép: trừ 100%
    private static final BigDecimal DEFAULT_DAILY_SALARY = new BigDecimal("300000"); // 300k/ngày nếu chưa cấu hình

    @Autowired private StaffLeaveRepository staffLeaveRepository;
    @Autowired private StaffRepository staffRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private PayrollDeductionRepository payrollDeductionRepository;
    @Autowired private SystemTransactionLogRepository transactionLogRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private VnPayService vnPayService;
    @Autowired private MoMoService moMoService;

    // =====================================================================
    // BƯỚC 1: TỰ ĐỘNG ĐÓNG CÁC KỲ NGHỈ HẾT HẠN
    // Được gọi tại mọi API GET Staff (không phụ thuộc Cron)
    // =====================================================================
    public void autoFinishExpiredLeaves() {
        List<StaffLeave> expired = staffLeaveRepository.findExpiredActiveLeaves(LocalDate.now());
        for (StaffLeave leave : expired) {
            leave.setLeaveStatus(StaffLeave.LeaveStatus.FINISHED);
            Staff staff = leave.getStaff();
            if (staff != null) {
                staff.setWorkStatus(StaffWorkStatus.WORKING);
                staffRepository.save(staff);
            }
            staffLeaveRepository.save(leave);
            log.info("[AUTO-FINISH] Đã tự động kết thúc kỳ nghỉ #{} của nhân viên {}", leave.getId(), staff != null ? staff.getName() : "?");
        }
    }

    // =====================================================================
    // BƯỚC 2: KIỂM TRA NHÂN VIÊN CÓ ĐANG NGHỈ VÀO NGÀY CỤ THỂ
    // Dùng cho API available-staff và validation khi tạo booking
    // =====================================================================
    public boolean isStaffOnLeave(Integer staffId, LocalDate date) {
        autoFinishExpiredLeaves(); // Kiểm tra hết hạn trước
        List<StaffLeave> leaves = staffLeaveRepository.findActiveLeaveOnDate(staffId, date);
        return !leaves.isEmpty();
    }

    // =====================================================================
    // BƯỚC 3: PREVIEW — Phân tích booking bị ảnh hưởng (KHÔNG LƯU DB)
    // =====================================================================
    public Map<String, Object> preview(Integer staffId, LocalDate startDate, LocalDate endDate, String branch) {
        Map<String, Object> result = new HashMap<>();

        // Lấy danh sách booking bị ảnh hưởng: PENDING hoặc CONFIRMED trong khoảng thời gian
        List<Booking> affectedBookings = bookingRepository.findByStaff_IdAndBookingDateBetweenAndStatusIn(
            staffId, startDate, endDate, List.of("PENDING", "CONFIRMED", "PAID")
        );

        List<Map<String, Object>> bookingsWithAlternative = new ArrayList<>();
        List<Map<String, Object>> bookingsWithNoAlternative = new ArrayList<>();
        BigDecimal totalEstimatedRefund = BigDecimal.ZERO;

        for (Booking booking : affectedBookings) {
            // Tìm thợ thay thế cùng chi nhánh, không nghỉ, không trùng lịch
            List<Map<String, Object>> alternatives = findAlternativeStaff(
                staffId,
                booking.getBookingDate(),
                booking.getBookingTime(),
                booking.getDuration() != null ? booking.getDuration() : 30,
                branch != null ? branch : (booking.getStaff() != null ? booking.getStaff().getBranch() : "")
            );

            Map<String, Object> bookingInfo = buildBookingInfo(booking);
            bookingInfo.put("alternatives", alternatives);

            if (!alternatives.isEmpty()) {
                bookingsWithAlternative.add(bookingInfo);
            } else {
                bookingsWithNoAlternative.add(bookingInfo);
                if ("PAID".equals(booking.getStatus()) && booking.getTotalPrice() != null) {
                    totalEstimatedRefund = totalEstimatedRefund.add(booking.getTotalPrice());
                }
            }
        }

        result.put("totalAffectedBookings", affectedBookings.size());
        result.put("bookingsWithAlternative", bookingsWithAlternative);
        result.put("bookingsWithNoAlternative", bookingsWithNoAlternative);
        result.put("estimatedRefundAmount", totalEstimatedRefund);
        result.put("canProceed", true);
        return result;
    }

    // =====================================================================
    // BƯỚC 4: CONFIRM — Thực thi lịch nghỉ (LƯU DB + XỬ LÝ BOOKING)
    // @Transactional bao toàn bộ thao tác DB (không bao refund API bên ngoài)
    // =====================================================================
    @Transactional
    public Map<String, Object> confirm(
            Integer staffId,
            LocalDate startDate,
            LocalDate endDate,
            StaffLeave.LeaveType leaveType,
            StaffLeave.LeaveSalaryType salaryType,
            String reason,
            Map<Integer, Integer> bookingToStaffMap, // bookingId → staffId thay thế (null = refund)
            String actorUsername,
            String actorIp
    ) {
        Map<String, Object> result = new HashMap<>();

        // === 1. Kiểm tra chồng lịch ===
        List<StaffLeave> overlaps = staffLeaveRepository.findOverlappingLeave(staffId, startDate, endDate, null);
        if (!overlaps.isEmpty()) {
            result.put("success", false);
            result.put("error", "LEAVE_OVERLAP");
            result.put("message", "Nhân viên đã có lịch nghỉ trong khoảng thời gian này.");
            return result;
        }

        // === 2. Tạo StaffLeave ===
        Staff staff = staffRepository.findById(staffId).orElseThrow(() -> new RuntimeException("Staff not found"));
        StaffLeave leave = new StaffLeave();
        leave.setStaff(staff);
        leave.setLeaveType(leaveType);
        leave.setSalaryType(salaryType);
        leave.setLeaveStatus(StaffLeave.LeaveStatus.ACTIVE);
        leave.setStartDate(startDate);
        leave.setEndDate(endDate);
        leave.setReason(reason);
        leave.setCreatedBy(actorUsername);
        leave.setIpCreated(actorIp);
        StaffLeave savedLeave = staffLeaveRepository.save(leave);

        // === 3. Cập nhật trạng thái nhân viên ===
        StaffWorkStatus newWorkStatus = (leaveType == StaffLeave.LeaveType.SICK_LEAVE || leaveType == StaffLeave.LeaveType.PERSONAL)
                && startDate.equals(LocalDate.now())
                ? StaffWorkStatus.UNPLANNED_LEAVE
                : StaffWorkStatus.PLANNED_LEAVE;
        staff.setWorkStatus(newWorkStatus);
        staffRepository.save(staff);

        // Ghi log tạo kỳ nghỉ
        logAction("LEAVE_CREATED", staff, null, savedLeave.getId(), null, null, actorUsername, actorIp, "SUCCESS",
                null, "Admin tạo kỳ nghỉ " + startDate + " đến " + endDate + " cho nhân viên " + staff.getName());

        // === 4. Lấy booking bị ảnh hưởng ===
        List<Booking> affectedBookings = bookingRepository.findByStaff_IdAndBookingDateBetweenAndStatusIn(
            staffId, startDate, endDate, List.of("PENDING", "CONFIRMED", "PAID")
        );

        int staffChanged = 0, refunded = 0, waitingRefund = 0;

        for (Booking booking : affectedBookings) {
            // Lock booking ngay lập tức
            booking.setLocked(true);
            booking.setLockReason("STAFF_ON_LEAVE");
            booking.setLockedAt(LocalDateTime.now());
            bookingRepository.save(booking);

            Integer newStaffId = (bookingToStaffMap != null) ? bookingToStaffMap.get(booking.getId()) : null;

            if (newStaffId != null) {
                // === Đổi thợ ===
                Staff newStaff = staffRepository.findById(newStaffId).orElse(null);
                if (newStaff != null) {
                    booking.setStaff(newStaff);
                    booking.setLocked(false); // Unlock sau khi đổi thợ thành công
                    booking.setLockReason(null);
                    bookingRepository.save(booking);
                    staffChanged++;

                    // Gửi notification cho khách
                    sendStaffChangedNotification(booking, staff, newStaff);
                    logAction("STAFF_CHANGED", staff, booking.getId(), savedLeave.getId(), null, null,
                            actorUsername, actorIp, "SUCCESS", null,
                            "Đổi thợ booking #" + booking.getId() + " từ " + staff.getName() + " sang " + newStaff.getName());
                }
            } else {
                // === Hoàn tiền hoặc hủy ===
                if ("PAID".equals(booking.getStatus())) {
                    // Gọi refund API bên ngoài transaction
                    processRefundForBooking(booking, savedLeave, actorUsername, actorIp);
                    if ("REFUNDED".equals(booking.getRefundStatus())) {
                        refunded++;
                    } else {
                        waitingRefund++;
                    }
                } else {
                    // PENDING/CONFIRMED chưa thanh toán → hủy thẳng
                    booking.setStatus("CANCELLED");
                    booking.setCancelReason("STAFF_ON_LEAVE");
                    booking.setCancelledAt(LocalDateTime.now());
                    booking.setCancelledBy(actorUsername);
                    booking.setRefundStatus("NO_PAYMENT");
                    bookingRepository.save(booking);
                    sendCancelledNotification(booking, staff, false);
                    logAction("BOOKING_CANCELLED", staff, booking.getId(), savedLeave.getId(), null, null,
                            actorUsername, actorIp, "SUCCESS", null,
                            "Hủy booking #" + booking.getId() + " (chưa thanh toán) do nhân viên nghỉ");
                    refunded++;
                }
            }
        }

        // === 5. Sinh PayrollDeduction (1 record/ngày) ===
        generatePayrollDeductions(savedLeave, staff, salaryType);

        // === 6. Gửi Notification tổng hợp cho Admin ===
        sendAdminSummaryNotification(actorUsername, staff, startDate, endDate, staffChanged, refunded + waitingRefund);

        result.put("success", true);
        result.put("leaveId", savedLeave.getId());
        result.put("staffChanged", staffChanged);
        result.put("refunded", refunded);
        result.put("waitingRefund", waitingRefund);
        result.put("message", "Đã tạo lịch nghỉ thành công.");
        return result;
    }

    // =====================================================================
    // XỬ LÝ REFUND CHO 1 BOOKING (gọi ngoài @Transactional để an toàn)
    // Nếu refund lỗi → set WAITING_REFUND, không hủy booking
    // =====================================================================
    private void processRefundForBooking(Booking booking, StaffLeave leave, String actorUsername, String actorIp) {
        Staff staff = booking.getStaff();
        boolean refundSuccess = false;
        String refundErrorMsg = null;

        try {
            if ("VNPAY".equalsIgnoreCase(booking.getPaymentMethod())) {
                refundSuccess = vnPayService.refundPayment(booking, actorIp);
            } else if ("MOMO".equalsIgnoreCase(booking.getPaymentMethod())) {
                refundSuccess = moMoService.refundPayment(booking);
            } else {
                // Phương thức thanh toán tại quầy hoặc không xác định → hủy không cần refund
                refundSuccess = true;
            }
        } catch (Exception e) {
            refundErrorMsg = e.getMessage();
            log.error("[REFUND-ERROR] Booking #{}: {}", booking.getId(), e.getMessage());
        }

        if (refundSuccess) {
            booking.setStatus("CANCELLED");
            booking.setCancelReason("STAFF_ON_LEAVE");
            booking.setCancelledAt(LocalDateTime.now());
            booking.setCancelledBy(actorUsername);
            booking.setRefundStatus("REFUNDED");
            booking.setRefundAt(LocalDateTime.now());
            bookingRepository.save(booking);

            sendCancelledNotification(booking, staff, true);
            logAction("REFUND_SUCCESS", staff, booking.getId(), leave.getId(), null, booking.getTotalPrice(),
                    actorUsername, actorIp, "SUCCESS", null,
                    "Hoàn tiền thành công booking #" + booking.getId() + " do nhân viên nghỉ");
        } else {
            // Không rollback — chỉ đánh dấu WAITING_REFUND để Admin xử lý lại
            booking.setRefundStatus("WAITING_REFUND");
            bookingRepository.save(booking);

            logAction("REFUND_FAILED", staff, booking.getId(), leave.getId(), null, booking.getTotalPrice(),
                    actorUsername, actorIp, "FAILED", refundErrorMsg,
                    "Hoàn tiền THẤT BẠI booking #" + booking.getId() + ". Admin cần xử lý lại.");
            log.warn("[REFUND-WAITING] Booking #{} set WAITING_REFUND. Admin cần retry.", booking.getId());
        }
    }

    // =====================================================================
    // SINH PAYROLL DEDUCTION (1 record/ngày nghỉ)
    // =====================================================================
    private void generatePayrollDeductions(StaffLeave leave, Staff staff, StaffLeave.LeaveSalaryType salaryType) {
        int deductionRate = salaryType == StaffLeave.LeaveSalaryType.PAID ? PAID_DEDUCTION_RATE : UNPAID_DEDUCTION_RATE;

        LocalDate current = leave.getStartDate();
        while (!current.isAfter(leave.getEndDate())) {
            PayrollDeduction deduction = new PayrollDeduction();
            deduction.setStaff(staff);
            deduction.setStaffLeave(leave);
            deduction.setDeductionDate(current);
            deduction.setLeaveType(leave.getLeaveType());
            deduction.setSalaryType(salaryType);
            deduction.setDeductionRate(deductionRate);
            deduction.setBaseDailySalary(DEFAULT_DAILY_SALARY);

            BigDecimal amount = DEFAULT_DAILY_SALARY.multiply(BigDecimal.valueOf(deductionRate)).divide(BigDecimal.valueOf(100));
            deduction.setDeductionAmount(amount);

            String leaveLabel = getLeaveTypeLabel(leave.getLeaveType());
            String salaryLabel = salaryType == StaffLeave.LeaveSalaryType.PAID ? "Có lương" : "Không lương";
            deduction.setNote(leaveLabel + " - " + salaryLabel + " - Khấu trừ " + deductionRate + "%");

            payrollDeductionRepository.save(deduction);
            current = current.plusDays(1);
        }
        log.info("[PAYROLL] Đã sinh {} record khấu trừ cho nhân viên {}", 
                 java.time.temporal.ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()) + 1, 
                 staff.getName());
    }

    // =====================================================================
    // HỦY KỲ NGHỈ (Admin hủy trước ngày bắt đầu)
    // =====================================================================
    @Transactional
    public Map<String, Object> cancelLeave(Integer leaveId, String actorUsername, String actorIp) {
        Map<String, Object> result = new HashMap<>();
        StaffLeave leave = staffLeaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kỳ nghỉ #" + leaveId));

        if (leave.getStartDate().isBefore(LocalDate.now())) {
            result.put("success", false);
            result.put("message", "Không thể hủy kỳ nghỉ đã bắt đầu. Chỉ có thể hủy kỳ nghỉ chưa tới ngày.");
            return result;
        }

        leave.setLeaveStatus(StaffLeave.LeaveStatus.CANCELLED);
        staffLeaveRepository.save(leave);

        // Cập nhật trạng thái thợ về WORKING
        Staff staff = leave.getStaff();
        staff.setWorkStatus(StaffWorkStatus.WORKING);
        staffRepository.save(staff);

        // Unlock tất cả booking liên quan
        List<Booking> lockedBookings = bookingRepository.findByStaff_IdAndBookingDateBetweenAndStatusIn(
            staff.getId(), leave.getStartDate(), leave.getEndDate(), List.of("PENDING", "CONFIRMED", "PAID")
        );
        for (Booking b : lockedBookings) {
            if (Boolean.TRUE.equals(b.getLocked()) && "STAFF_ON_LEAVE".equals(b.getLockReason())) {
                b.setLocked(false);
                b.setLockReason(null);
                b.setLockedAt(null);
                bookingRepository.save(b);
            }
        }

        // Xóa payroll deductions chưa áp dụng
        payrollDeductionRepository.deleteAll(payrollDeductionRepository.findByStaffLeave_Id(leaveId));

        logAction("LEAVE_CANCELLED", staff, null, leaveId, null, null, actorUsername, actorIp, "SUCCESS",
                null, "Admin hủy kỳ nghỉ #" + leaveId + " của nhân viên " + staff.getName());

        result.put("success", true);
        result.put("message", "Đã hủy kỳ nghỉ và mở lại " + lockedBookings.size() + " booking.");
        return result;
    }

    // =====================================================================
    // TÌM THỢ THAY THẾ CHO 1 BOOKING
    // =====================================================================
    public List<Map<String, Object>> findAlternativeStaff(Integer excludeStaffId, LocalDate date, LocalTime bookingTime, int duration, String branch) {
        List<Staff> candidates = staffRepository.findByBranchAndIsActiveTrue(branch);
        List<Map<String, Object>> alternatives = new ArrayList<>();
        LocalTime newEnd = bookingTime.plusMinutes(duration);

        for (Staff s : candidates) {
            if (s.getId().equals(excludeStaffId)) continue;
            if (!StaffWorkStatus.WORKING.equals(s.getWorkStatus())) continue;
            if (isStaffOnLeave(s.getId(), date)) continue;

            // Kiểm tra trùng lịch
            List<Booking> dayBookings = bookingRepository.findByStaff_IdAndBookingDateAndStatusNot(s.getId(), date, "CANCELLED");
            boolean isBusy = dayBookings.stream().anyMatch(b -> {
                LocalTime bStart = b.getBookingTime();
                int bDur = b.getDuration() != null ? b.getDuration() : 30;
                LocalTime bEnd = bStart.plusMinutes(bDur);
                return bookingTime.isBefore(bEnd) && newEnd.isAfter(bStart);
            });

            if (!isBusy) {
                Map<String, Object> info = new HashMap<>();
                info.put("staffId", s.getId());
                info.put("staffName", s.getName());
                info.put("specialty", s.getSpecialty());
                info.put("avatar", s.getAvatar());
                info.put("branch", s.getBranch());
                alternatives.add(info);
            }
        }
        return alternatives;
    }

    // =====================================================================
    // THỐNG KÊ DASHBOARD
    // =====================================================================
    public Map<String, Object> getDashboardStats(User caller) {
        autoFinishExpiredLeaves();
        Map<String, Object> stats = new HashMap<>();
        LocalDate today = LocalDate.now();
        String branch = (caller != null && "EDITOR".equals(caller.getRole())) ? caller.getBranch() : null;

        // Current leaves (filter by branch if editor)
        List<StaffLeave> currentLeaves = staffLeaveRepository.findByLeaveStatusOrderByStartDateAsc(StaffLeave.LeaveStatus.ACTIVE)
                .stream()
                .filter(l -> !l.getStartDate().isAfter(today) && !l.getEndDate().isBefore(today))
                .filter(l -> branch == null || branch.equals(l.getStaff().getBranch()))
                .toList();

        stats.put("staffCurrentlyOnLeave", currentLeaves.size());
        
        // Upcoming leaves (filter by branch if editor)
        List<StaffLeave> upcomingLeaves = staffLeaveRepository.findUpcomingLeaves(today, today.plusDays(7))
                .stream()
                .filter(l -> branch == null || branch.equals(l.getStaff().getBranch()))
                .toList();
        stats.put("upcomingLeaves", upcomingLeaves.size());

        stats.put("cancelledThisMonth", transactionLogRepository.countCancelledThisMonth(branch));
        stats.put("refundThisMonth", transactionLogRepository.sumRefundThisMonth(branch));

        stats.put("currentLeaveDetails", currentLeaves.stream().map(l -> {
            Map<String, Object> m = new HashMap<>();
            m.put("staffName", l.getStaff().getName());
            m.put("startDate", l.getStartDate());
            m.put("endDate", l.getEndDate());
            m.put("leaveType", l.getLeaveType());
            m.put("salaryType", l.getSalaryType());
            return m;
        }).toList());

        return stats;
    }

    // =====================================================================
    // HELPER: GỬI NOTIFICATION
    // =====================================================================
    private void sendStaffChangedNotification(Booking booking, Staff oldStaff, Staff newStaff) {
        if (booking.getUser() == null) return;
        Notification notif = new Notification();
        notif.setUser(booking.getUser());
        notif.setType("staff_changed");
        notif.setTitle("📋 Lịch hẹn đã được cập nhật nhân viên phụ trách");
        notif.setMessage(
            "Lịch hẹn ngày " + booking.getBookingDate() + " lúc " + booking.getBookingTime() +
            " của bạn đã được chuyển sang nhân viên " + newStaff.getName() +
            " (thay cho " + oldStaff.getName() + " do nhân viên nghỉ làm).\n" +
            "Thời gian và dịch vụ không thay đổi. Xin lỗi vì sự bất tiện này!"
        );
        notificationRepository.save(notif);
    }

    private void sendCancelledNotification(Booking booking, Staff staff, boolean refunded) {
        if (booking.getUser() == null) return;
        Notification notif = new Notification();
        notif.setUser(booking.getUser());
        notif.setType("cancel");
        notif.setTitle("❌ Lịch hẹn đã bị hủy");
        notif.setMessage(
            "Rất tiếc! Lịch hẹn ngày " + booking.getBookingDate() + " với nhân viên " + (staff != null ? staff.getName() : "") +
            " đã bị hủy. Lý do: Nhân viên nghỉ làm.\n" +
            (refunded ? "Hệ thống đã hoàn tiền 100% cho bạn. Xin lỗi vì sự bất tiện này!" : "Xin lỗi vì sự bất tiện này!")
        );
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("booking_id", booking.getId());
        dataMap.put("service_name", booking.getService() != null ? booking.getService().getName() : "");
        dataMap.put("service_price", booking.getService() != null ? booking.getService().getPrice() : 0);
        dataMap.put("service_duration", booking.getService() != null ? booking.getService().getDuration() : 0);
        dataMap.put("barber_name", staff != null ? staff.getName() : "");
        dataMap.put("branch_name", staff != null ? staff.getBranch() : "");
        
        // Format date as DD-MM-YYYY for frontend
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy");
        dataMap.put("booking_date", booking.getBookingDate() != null ? booking.getBookingDate().format(formatter) : "");
        dataMap.put("booking_time", booking.getBookingTime() != null ? booking.getBookingTime().toString() : "");
        dataMap.put("payment_method", booking.getPaymentMethod());
        dataMap.put("email", booking.getCustomerEmail());
        dataMap.put("phone", booking.getCustomerPhone());
        dataMap.put("cancel_reason", "STAFF_ON_LEAVE");
        dataMap.put("cancelled_at", booking.getCancelledAt() != null ? booking.getCancelledAt().toString() : LocalDateTime.now().toString());
        dataMap.put("cancelled_by", "SYSTEM");
        dataMap.put("refund_status", refunded ? "success" : "failed");

        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            notif.setDataJson(mapper.writeValueAsString(dataMap));
        } catch (Exception e) {
            notif.setDataJson("{}");
        }

        notificationRepository.save(notif);
    }

    private void sendAdminSummaryNotification(String adminUsername, Staff staff, LocalDate start, LocalDate end, int changed, int cancelled) {
        // Tìm user admin để gửi notification
        userRepository.findByUsername(adminUsername).ifPresent(admin -> {
            Notification notif = new Notification();
            notif.setUser(admin);
            notif.setType("admin_leave_summary");
            notif.setTitle("🔴 Nhân viên " + staff.getName() + " đã được đăng ký nghỉ");
            notif.setMessage(
                "Kỳ nghỉ từ " + start + " đến " + end + ".\n" +
                "Đã đổi thợ: " + changed + " lịch hẹn.\n" +
                "Đã hủy/hoàn tiền: " + cancelled + " lịch hẹn."
            );
            notificationRepository.save(notif);
        });
    }

    // =====================================================================
    // HELPER: GHI TRANSACTION LOG
    // =====================================================================
    private void logAction(String actionType, Staff staff, Integer bookingId, Integer leaveId,
                           String refundId, BigDecimal refundAmount,
                           String actorUsername, String actorIp,
                           String result, String errorMsg, String description) {
        SystemTransactionLog log_ = new SystemTransactionLog();
        log_.setActionType(actionType);
        log_.setStaff(staff);
        log_.setBookingId(bookingId);
        log_.setStaffLeaveId(leaveId);
        log_.setRefundId(refundId);
        log_.setRefundAmount(refundAmount);
        log_.setActorUsername(actorUsername);
        log_.setActorIp(actorIp);
        log_.setResult(result);
        log_.setErrorMessage(errorMsg);
        log_.setDescription(description);
        transactionLogRepository.save(log_);
    }

    // =====================================================================
    // HELPER: NHÃN TIẾNG VIỆT
    // =====================================================================
    private String getLeaveTypeLabel(StaffLeave.LeaveType type) {
        return switch (type) {
            case ANNUAL_LEAVE -> "Nghỉ phép năm";
            case SICK_LEAVE -> "Nghỉ ốm";
            case PERSONAL -> "Việc cá nhân";
            case OTHER -> "Lý do khác";
        };
    }

    private Map<String, Object> buildBookingInfo(Booking booking) {
        Map<String, Object> info = new HashMap<>();
        info.put("bookingId", booking.getId());
        info.put("bookingDate", booking.getBookingDate());
        info.put("bookingTime", booking.getBookingTime());
        info.put("customerName", booking.getCustomerName() != null ? booking.getCustomerName() :
                (booking.getUser() != null ? booking.getUser().getFullName() : "Khách"));
        info.put("serviceName", booking.getService() != null ? booking.getService().getName() : "");
        info.put("totalPrice", booking.getTotalPrice());
        info.put("status", booking.getStatus());
        info.put("paymentMethod", booking.getPaymentMethod());
        return info;
    }
}
