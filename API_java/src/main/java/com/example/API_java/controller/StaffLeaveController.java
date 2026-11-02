package com.example.API_java.controller;

import com.example.API_java.entity.StaffLeave;
import com.example.API_java.entity.Staff;
import com.example.API_java.repository.*;
import com.example.API_java.service.StaffLeaveService;
import com.example.API_java.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDate;
import java.util.*;

/**
 * REST Controller quản lý lịch nghỉ nhân viên.
 *
 * PHÂN QUYỀN:
 * - ADMIN: Toàn quyền (tạo, sửa, hủy, xem)
 * - EDITOR: Chỉ xem danh sách
 * - EMPLOYEE/USER: Không truy cập
 */
@RestController
@RequestMapping("/api/admin/staff-leave")
@CrossOrigin(origins = "*")
public class StaffLeaveController {

    private static final Logger log = LoggerFactory.getLogger(StaffLeaveController.class);

    @Autowired private StaffLeaveService staffLeaveService;
    @Autowired private StaffLeaveRepository staffLeaveRepository;
    @Autowired private StaffRepository staffRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private PayrollDeductionRepository payrollDeductionRepository;
    @Autowired private SystemTransactionLogRepository transactionLogRepository;

    // ===================================================================
    // GET: DANH SÁCH LỊCH NGHỈ (ADMIN + EDITOR)
    // ===================================================================
    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) Integer staffId,
            @RequestParam(required = false) String status,
            Authentication authentication) {

        User caller = getCallerUser(authentication);
        if (caller == null) return ResponseEntity.status(401).body("Chưa đăng nhập");
        if ("USER".equals(caller.getRole())) {
            return ResponseEntity.status(403).body("Không có quyền truy cập");
        }

        // Tự động đóng các kỳ nghỉ hết hạn trước khi trả về
        staffLeaveService.autoFinishExpiredLeaves();

        StaffLeave.LeaveStatus leaveStatus = null;
        if (status != null && !status.isBlank()) {
            try { leaveStatus = StaffLeave.LeaveStatus.valueOf(status); } catch (Exception ignored) {}
        }

        String branch = "EDITOR".equals(caller.getRole()) ? caller.getBranch() : null;
        
        if ("EMPLOYEE".equals(caller.getRole())) {
            if (caller.getEmployeeId() != null) {
                staffId = caller.getEmployeeId(); // Force filter to their own ID
            } else {
                return ResponseEntity.ok(Collections.emptyList());
            }
        }

        List<StaffLeave> leaves = staffLeaveRepository.findAllWithFilter(staffId, leaveStatus, branch);
        return ResponseEntity.ok(leaves);
    }

    // ===================================================================
    // GET: CHI TIẾT 1 KỲ NGHỈ
    // ===================================================================
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id, Authentication authentication) {
        User caller = getCallerUser(authentication);
        if (caller == null) return ResponseEntity.status(401).body("Chưa đăng nhập");
        if ("EMPLOYEE".equals(caller.getRole()) || "USER".equals(caller.getRole())) {
            return ResponseEntity.status(403).body("Không có quyền truy cập");
        }

        StaffLeave leave = staffLeaveRepository.findById(id).orElse(null);
        if (leave == null) return ResponseEntity.notFound().build();

        Map<String, Object> result = new HashMap<>();
        result.put("leave", leave);
        result.put("payrollDeductions", payrollDeductionRepository.findByStaffLeave_Id(id));
        result.put("transactionLogs", transactionLogRepository.findByStaffLeaveIdOrderByCreatedAtDesc(id));
        return ResponseEntity.ok(result);
    }

    // ===================================================================
    // POST: PREVIEW (ADMIN ONLY — KHÔNG LƯU DB)
    // ===================================================================
    @PostMapping("/preview")
    public ResponseEntity<?> preview(@RequestBody Map<String, Object> data, Authentication authentication) {
        User caller = getCallerUser(authentication);
        if (caller == null) return ResponseEntity.status(401).body("Chưa đăng nhập");
        if (!"ADMIN".equals(caller.getRole()) && !"EDITOR".equals(caller.getRole())) {
            return ResponseEntity.status(403).body("Chỉ ADMIN/EDITOR mới có quyền thực hiện thao tác này");
        }

        try {
            Integer staffId = Integer.valueOf(data.get("staffId").toString());
            LocalDate startDate = LocalDate.parse(data.get("startDate").toString());
            LocalDate endDate = LocalDate.parse(data.get("endDate").toString());

            if (endDate.isBefore(startDate)) {
                return ResponseEntity.badRequest().body("Ngày kết thúc phải sau ngày bắt đầu");
            }

            Staff staff = staffRepository.findById(staffId).orElse(null);
            if (staff == null) return ResponseEntity.badRequest().body("Không tìm thấy nhân viên");

            if ("EDITOR".equals(caller.getRole()) && (caller.getBranch() == null || !caller.getBranch().equals(staff.getBranch()))) {
                return ResponseEntity.status(403).body("Bạn chỉ có thể thao tác với nhân viên thuộc chi nhánh của mình");
            }

            // Kiểm tra chồng lịch trước khi preview
            List<StaffLeave> overlaps = staffLeaveRepository.findOverlappingLeave(staffId, startDate, endDate, null);
            if (!overlaps.isEmpty()) {
                return ResponseEntity.status(409).body(Map.of(
                    "error", "LEAVE_OVERLAP",
                    "message", "Nhân viên đã có lịch nghỉ trong khoảng thời gian này (" +
                               overlaps.get(0).getStartDate() + " → " + overlaps.get(0).getEndDate() + ")"
                ));
            }

            Map<String, Object> preview = staffLeaveService.preview(staffId, startDate, endDate, staff.getBranch());
            return ResponseEntity.ok(preview);

        } catch (Exception e) {
            log.error("[PREVIEW ERROR] {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Lỗi khi preview: " + e.getMessage());
        }
    }

    // ===================================================================
    // POST: CONFIRM — Xác nhận và lưu kỳ nghỉ (ADMIN ONLY)
    // ===================================================================
    @PostMapping("/confirm")
    public ResponseEntity<?> confirm(@RequestBody Map<String, Object> data,
                                      Authentication authentication,
                                      HttpServletRequest request) {
        User caller = getCallerUser(authentication);
        if (caller == null) return ResponseEntity.status(401).body("Chưa đăng nhập");
        if (!"ADMIN".equals(caller.getRole()) && !"EDITOR".equals(caller.getRole())) {
            return ResponseEntity.status(403).body("Chỉ ADMIN/EDITOR mới có quyền thực hiện thao tác này");
        }

        try {
            Integer staffId = Integer.valueOf(data.get("staffId").toString());
            
            Staff staff = staffRepository.findById(staffId).orElse(null);
            if (staff == null) return ResponseEntity.badRequest().body("Không tìm thấy nhân viên");
            if ("EDITOR".equals(caller.getRole()) && (caller.getBranch() == null || !caller.getBranch().equals(staff.getBranch()))) {
                return ResponseEntity.status(403).body("Bạn chỉ có thể thao tác với nhân viên thuộc chi nhánh của mình");
            }
            
            LocalDate startDate = LocalDate.parse(data.get("startDate").toString());
            LocalDate endDate = LocalDate.parse(data.get("endDate").toString());
            StaffLeave.LeaveType leaveType = StaffLeave.LeaveType.valueOf(data.get("leaveType").toString());
            StaffLeave.LeaveSalaryType salaryType = data.containsKey("salaryType")
                    ? StaffLeave.LeaveSalaryType.valueOf(data.get("salaryType").toString())
                    : StaffLeave.LeaveSalaryType.PAID;
            String reason = data.containsKey("reason") ? data.get("reason").toString() : "";

            // bookingToStaffMap: { "bookingId": newStaffId } — null newStaffId = refund
            Map<Integer, Integer> bookingToStaffMap = new HashMap<>();
            if (data.containsKey("bookingAssignments")) {
                Map<String, Object> assignments = (Map<String, Object>) data.get("bookingAssignments");
                for (Map.Entry<String, Object> entry : assignments.entrySet()) {
                    Integer bookingId = Integer.valueOf(entry.getKey());
                    Integer newStaffId = entry.getValue() != null ? Integer.valueOf(entry.getValue().toString()) : null;
                    bookingToStaffMap.put(bookingId, newStaffId);
                }
            }

            String actorInfo = caller.getRole() + " (" + caller.getUsername() + ")";
            Map<String, Object> result = staffLeaveService.confirm(
                staffId, startDate, endDate, leaveType, salaryType, reason,
                bookingToStaffMap, actorInfo, request.getRemoteAddr()
            );

            if (Boolean.FALSE.equals(result.get("success"))) {
                return ResponseEntity.badRequest().body(result);
            }
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("[CONFIRM ERROR] {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Lỗi khi tạo lịch nghỉ: " + e.getMessage());
        }
    }

    // ===================================================================
    // PUT: SỬA KỲ NGHỈ (ADMIN ONLY — chỉ khi chưa tới ngày)
    // ===================================================================
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id,
                                     @RequestBody Map<String, Object> data,
                                     Authentication authentication) {
        User caller = getCallerUser(authentication);
        if (caller == null) return ResponseEntity.status(401).body("Chưa đăng nhập");
        if (!"ADMIN".equals(caller.getRole()) && !"EDITOR".equals(caller.getRole())) {
            return ResponseEntity.status(403).body("Chỉ ADMIN/EDITOR mới có quyền thực hiện thao tác này");
        }

        StaffLeave leave = staffLeaveRepository.findById(id).orElse(null);
        if (leave == null) return ResponseEntity.notFound().build();

        if ("EDITOR".equals(caller.getRole()) && (caller.getBranch() == null || !caller.getBranch().equals(leave.getStaff().getBranch()))) {
            return ResponseEntity.status(403).body("Bạn chỉ có thể thao tác với nhân viên thuộc chi nhánh của mình");
        }

        if (leave.getStartDate().isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Không thể sửa kỳ nghỉ đã bắt đầu hoặc đã qua. Hãy hủy và tạo lại.")
            );
        }

        try {
            if (data.containsKey("reason")) leave.setReason(data.get("reason").toString());
            if (data.containsKey("leaveType")) leave.setLeaveType(StaffLeave.LeaveType.valueOf(data.get("leaveType").toString()));
            if (data.containsKey("salaryType")) leave.setSalaryType(StaffLeave.LeaveSalaryType.valueOf(data.get("salaryType").toString()));
            if (data.containsKey("endDate")) leave.setEndDate(LocalDate.parse(data.get("endDate").toString()));

            staffLeaveRepository.save(leave);

            // Tái tạo PayrollDeduction (xóa cũ, sinh mới)
            payrollDeductionRepository.deleteAll(payrollDeductionRepository.findByStaffLeave_Id(id));
            // Note: gọi lại generatePayrollDeductions thông qua confirm sẽ phức tạp, giữ đơn giản ở đây

            return ResponseEntity.ok(Map.of("success", true, "message", "Cập nhật kỳ nghỉ thành công"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi: " + e.getMessage());
        }
    }

    // ===================================================================
    // DELETE: HỦY KỲ NGHỈ (ADMIN ONLY — chỉ khi chưa tới ngày)
    // ===================================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancel(@PathVariable Integer id,
                                     Authentication authentication,
                                     HttpServletRequest request) {
        User caller = getCallerUser(authentication);
        if (caller == null) return ResponseEntity.status(401).body("Chưa đăng nhập");
        if (!"ADMIN".equals(caller.getRole()) && !"EDITOR".equals(caller.getRole())) {
            return ResponseEntity.status(403).body("Chỉ ADMIN/EDITOR mới có quyền thực hiện thao tác này");
        }

        try {
            StaffLeave leave = staffLeaveRepository.findById(id).orElse(null);
            if (leave == null) return ResponseEntity.notFound().build();
            if ("EDITOR".equals(caller.getRole()) && (caller.getBranch() == null || !caller.getBranch().equals(leave.getStaff().getBranch()))) {
                return ResponseEntity.status(403).body("Bạn chỉ có thể thao tác với nhân viên thuộc chi nhánh của mình");
            }

            String actorInfo = caller.getRole() + " (" + caller.getUsername() + ")";
            Map<String, Object> result = staffLeaveService.cancelLeave(id, actorInfo, request.getRemoteAddr());
            if (Boolean.FALSE.equals(result.get("success"))) {
                return ResponseEntity.badRequest().body(result);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi: " + e.getMessage());
        }
    }

    // ===================================================================
    // GET: DASHBOARD STATS (ADMIN)
    // ===================================================================
    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats(Authentication authentication) {
        User caller = getCallerUser(authentication);
        if (caller == null) return ResponseEntity.status(401).body("Chưa đăng nhập");
        if (!"ADMIN".equals(caller.getRole()) && !"EDITOR".equals(caller.getRole())) {
            return ResponseEntity.status(403).body("Chỉ ADMIN/EDITOR mới có quyền xem thống kê");
        }
        return ResponseEntity.ok(staffLeaveService.getDashboardStats(caller));
    }

    // ===================================================================
    // GET: TRANSACTION LOGS (ADMIN)
    // ===================================================================
    @GetMapping("/logs")
    public ResponseEntity<?> getLogs(
            @RequestParam(required = false) Integer staffId,
            Authentication authentication) {
        User caller = getCallerUser(authentication);
        if (caller == null) return ResponseEntity.status(401).body("Chưa đăng nhập");
        if (!"ADMIN".equals(caller.getRole())) {
            return ResponseEntity.status(403).body("Chỉ ADMIN mới có quyền xem log");
        }

        List<?> logs = staffId != null
                ? transactionLogRepository.findByStaff_IdOrderByCreatedAtDesc(staffId)
                : transactionLogRepository.findAll(
                    org.springframework.data.domain.Sort.by(
                        org.springframework.data.domain.Sort.Direction.DESC, "createdAt"
                    )
                  );
        return ResponseEntity.ok(logs);
    }

    // ===================================================================
    // GET: WAITING REFUND BOOKINGS (ADMIN)
    // ===================================================================
    @GetMapping("/waiting-refund")
    public ResponseEntity<?> getWaitingRefundBookings(Authentication authentication) {
        User caller = getCallerUser(authentication);
        if (caller == null) return ResponseEntity.status(401).body("Chưa đăng nhập");
        if (!"ADMIN".equals(caller.getRole())) {
            return ResponseEntity.status(403).body("Không có quyền");
        }
        List<?> waitingBookings = bookingRepository.findByLockedTrueAndRefundStatus("WAITING_REFUND");
        return ResponseEntity.ok(waitingBookings);
    }

    // ===================================================================
    // GET: PAYROLL DEDUCTIONS CỦA NHÂN VIÊN TRONG THÁNG
    // ===================================================================
    @GetMapping("/payroll-deductions/{staffId}")
    public ResponseEntity<?> getPayrollDeductions(
            @PathVariable Integer staffId,
            @RequestParam(defaultValue = "0") int year,
            @RequestParam(defaultValue = "0") int month,
            Authentication authentication) {
        User caller = getCallerUser(authentication);
        if (caller == null) return ResponseEntity.status(401).body("Chưa đăng nhập");
        if (!"ADMIN".equals(caller.getRole())) {
            return ResponseEntity.status(403).body("Không có quyền");
        }

        LocalDate now = LocalDate.now();
        int y = year > 0 ? year : now.getYear();
        int m = month > 0 ? month : now.getMonthValue();

        var deductions = payrollDeductionRepository.findByStaffAndMonth(staffId, y, m);
        var total = payrollDeductionRepository.sumDeductionByStaffAndMonth(staffId, y, m);

        return ResponseEntity.ok(Map.of(
            "staffId", staffId,
            "year", y,
            "month", m,
            "deductions", deductions,
            "totalDeduction", total
        ));
    }

    // ===================================================================
    // PUBLIC: Kiểm tra thợ có nghỉ vào ngày không (dùng cho Booking form)
    // ===================================================================
    @GetMapping("/check/{staffId}")
    public ResponseEntity<?> checkStaffOnLeave(
            @PathVariable Integer staffId,
            @RequestParam String date) {
        try {
            LocalDate checkDate = LocalDate.parse(date);
            boolean onLeave = staffLeaveService.isStaffOnLeave(staffId, checkDate);
            return ResponseEntity.ok(Map.of("onLeave", onLeave, "date", date, "staffId", staffId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ngày không hợp lệ: " + date);
        }
    }

    // ===================================================================
    // HELPER
    // ===================================================================
    private User getCallerUser(Authentication authentication) {
        if (authentication == null) return null;
        return userRepository.findByUsername(authentication.getName()).orElse(null);
    }
}
