package com.example.API_java.controller;

import com.example.API_java.entity.Booking;
import com.example.API_java.entity.User;
import com.example.API_java.repository.BookingRepository;
import com.example.API_java.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/work-schedules")
@CrossOrigin(origins = "*")
public class WorkScheduleController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.example.API_java.service.BookingService bookingService;

    private User getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));
    }

    private Map<String, Object> mapToWorkScheduleDTO(Booking b, String role) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", b.getId());
        dto.put("customerName", b.getCustomerName() != null ? b.getCustomerName() : (b.getUser() != null ? b.getUser().getFullName() : "Khách vãng lai"));
        
        if ("EMPLOYEE".equals(role)) {
            dto.put("customerPhone", "");
            dto.put("customerEmail", "");
        } else {
            dto.put("customerPhone", b.getCustomerPhone() != null ? b.getCustomerPhone() : (b.getUser() != null ? b.getUser().getPhone() : ""));
            dto.put("customerEmail", b.getCustomerEmail() != null ? b.getCustomerEmail() : (b.getUser() != null ? b.getUser().getEmail() : ""));
        }
        
        dto.put("bookingDate", b.getBookingDate());
        dto.put("bookingTime", b.getBookingTime());
        dto.put("staffName", b.getStaff() != null ? b.getStaff().getName() : "");
        dto.put("branch", b.getStaff() != null ? b.getStaff().getBranch() : "");
        
        List<String> serviceNames = b.getServices().stream().map(s -> s.getName()).collect(Collectors.toList());
        if (b.getService() != null && !serviceNames.contains(b.getService().getName())) {
            serviceNames.add(b.getService().getName());
        }
        dto.put("services", serviceNames);
        
        Integer duration = b.getDuration() != null ? b.getDuration() : 0;
        dto.put("totalDuration", duration);
        
        LocalTime finishTime = b.getEndTime();
        if (finishTime == null && b.getBookingTime() != null) {
            finishTime = b.getBookingTime().plusMinutes(duration);
        }
        dto.put("estimatedFinishTime", finishTime);
        dto.put("status", b.getStatus());
        dto.put("note", b.getNote() != null ? b.getNote() : "");
        return dto;
    }

    private java.util.Comparator<Booking> bookingComparator() {
        return (b1, b2) -> {
            if (b1.getBookingDate() == null && b2.getBookingDate() == null) return 0;
            if (b1.getBookingDate() == null) return -1;
            if (b2.getBookingDate() == null) return 1;
            int dateComp = b1.getBookingDate().compareTo(b2.getBookingDate());
            if (dateComp != 0) return dateComp;
            if (b1.getBookingTime() == null && b2.getBookingTime() == null) return 0;
            if (b1.getBookingTime() == null) return -1;
            if (b2.getBookingTime() == null) return 1;
            return b1.getBookingTime().compareTo(b2.getBookingTime());
        };
    }

    @GetMapping("/my-schedule")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<?> getMySchedule(Authentication authentication) {
        try {
            bookingService.autoCompletePastBookings();
            User user = getCurrentUser(authentication);
            if (!"EMPLOYEE".equals(user.getRole())) {
                return ResponseEntity.status(403).body(Map.of("message", "Chỉ nhân viên mới được xem lịch cá nhân"));
            }
            if (user.getEmployeeId() == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Tài khoản chưa được liên kết với nhân viên nào"));
            }
            List<Booking> bookings = bookingRepository.findByStaff_IdOrderByBookingDateDescBookingTimeDesc(user.getEmployeeId());
            List<Map<String, Object>> result = bookings.stream()
                    .sorted(bookingComparator())
                    .map(b -> mapToWorkScheduleDTO(b, user.getRole()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Lỗi hệ thống"));
        }
    }

    @GetMapping("/branch")
    @PreAuthorize("hasRole('EDITOR')")
    public ResponseEntity<?> getBranchSchedule(Authentication authentication) {
        try {
            bookingService.autoCompletePastBookings();
            User user = getCurrentUser(authentication);
            if (!"EDITOR".equals(user.getRole())) {
                return ResponseEntity.status(403).body(Map.of("message", "Chỉ Editor mới được xem lịch chi nhánh"));
            }
            if (user.getBranch() == null || user.getBranch().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Tài khoản Editor chưa được gán chi nhánh"));
            }
            String filterBranch = user.getBranch();
            if ("CN 1".equalsIgnoreCase(filterBranch)) filterBranch = "Quận 1";
            else if ("CN 2".equalsIgnoreCase(filterBranch)) filterBranch = "Quận 2";
            else if ("CN 3".equalsIgnoreCase(filterBranch)) filterBranch = "Quận 3";
            else if ("CN 7".equalsIgnoreCase(filterBranch)) filterBranch = "Quận 7";
            else if ("CN 9".equalsIgnoreCase(filterBranch)) filterBranch = "Quận 9";
            else if ("CN BT".equalsIgnoreCase(filterBranch)) filterBranch = "Bình Thạnh";
            List<Booking> bookings = bookingRepository.findByStaff_BranchOrderByBookingDateDescBookingTimeDesc(filterBranch);
            List<Map<String, Object>> result = bookings.stream()
                    .sorted(bookingComparator())
                    .map(b -> mapToWorkScheduleDTO(b, user.getRole()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Lỗi hệ thống"));
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllSchedules(Authentication authentication) {
        try {
            bookingService.autoCompletePastBookings();
            User user = getCurrentUser(authentication);
            if (!"ADMIN".equals(user.getRole())) {
                return ResponseEntity.status(403).body(Map.of("message", "Bạn không có quyền xem toàn bộ lịch"));
            }
            List<Booking> bookings = bookingRepository.findByStaffNotNullOrderByBookingDateDescBookingTimeDesc();
            List<Map<String, Object>> result = bookings.stream()
                    .sorted(bookingComparator())
                    .map(b -> mapToWorkScheduleDTO(b, user.getRole()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Lỗi hệ thống"));
        }
    }
}
