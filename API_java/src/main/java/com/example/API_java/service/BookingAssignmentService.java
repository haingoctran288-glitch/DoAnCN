package com.example.API_java.service;

import com.example.API_java.dto.BookingAssignmentResult;
import com.example.API_java.entity.Booking;
import com.example.API_java.entity.Staff;
import com.example.API_java.repository.BookingRepository;
import com.example.API_java.repository.StaffRepository;
import com.example.API_java.service.StaffLeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class BookingAssignmentService {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // @Lazy to avoid circular dependency (StaffLeaveService -> BookingAssignmentService)
    @Autowired @Lazy
    private StaffLeaveService staffLeaveService;

    private static final Random RANDOM = new Random();

    /**
     * BƯỚC 1: Xác định chi nhánh
     * BƯỚC 2: Loại bỏ nhân viên không đủ điều kiện (nghỉ việc, v.v...)
     * BƯỚC 3: Kiểm tra lịch trống
     * BƯỚC 4: Tổng thời gian phục vụ trong ngày
     * BƯỚC 5: Số đơn trong ngày
     * BƯỚC 6: Tổng phút trong tuần
     * BƯỚC 7: Tổng phút trong tháng
     * BƯỚC 8: Random
     */
    public BookingAssignmentResult assignEmployee(String branch, LocalDate bookingDate, LocalTime bookingTime, int durationMins) {
        BookingAssignmentResult result = new BookingAssignmentResult();

        // Step 1 & 2: Get active staff from branch (workStatus = WORKING preferred)
        List<Staff> staffList = staffRepository.findByBranchAndIsActiveTrue(branch);
        if (staffList.isEmpty()) {
            result.setReason("Không có thợ nào đang hoạt động tại chi nhánh này.");
            return result;
        }

        // Bước 2 mở rộng: Loại thợ đang nghỉ khỏi danh sách
        staffList = staffList.stream()
            .filter(s -> !staffLeaveService.isStaffOnLeave(s.getId(), bookingDate))
            .collect(java.util.stream.Collectors.toList());

        if (staffList.isEmpty()) {
            result.setReason("Tất cả thợ tại chi nhánh này đang nghỉ trong ngày này.");
            return result;
        }

        LocalTime newStart = bookingTime;
        LocalTime newEnd = bookingTime.plusMinutes(durationMins);
        
        List<StaffCandidate> candidates = new ArrayList<>();

        for (Staff staff : staffList) {
            // Lấy tất cả bookings của thợ trong ngày, bỏ qua CANCELLED
            List<Booking> todayBookings = bookingRepository.findByStaff_IdAndBookingDateAndStatusNot(staff.getId(), bookingDate, "CANCELLED");

            // Step 3: Kiểm tra trùng lịch
            boolean isBusy = false;
            int totalMinsToday = 0;
            int totalBookingsToday = todayBookings.size();

            for (Booking b : todayBookings) {
                LocalTime bStart = b.getBookingTime();
                int bDur = (b.getDuration() != null) ? b.getDuration() : 30;
                LocalTime bEnd = bStart.plusMinutes(bDur);

                // Check overlap
                // Trùng khi: Start mới < End cũ VÀ End mới > Start cũ
                if (newStart.isBefore(bEnd) && newEnd.isAfter(bStart)) {
                    isBusy = true;
                    break;
                }

                totalMinsToday += bDur;
            }

            if (isBusy) {
                continue; // Loại thợ này vì trùng lịch
            }

            // Thợ hợp lệ
            StaffCandidate sc = new StaffCandidate();
            sc.staff = staff;
            sc.totalMinsToday = totalMinsToday;
            sc.totalBookingsToday = totalBookingsToday;
            candidates.add(sc);
        }

        if (candidates.isEmpty()) {
            result.setReason("Tất cả thợ đều đã kín lịch vào khung giờ này.");
            return result;
        }

        // Nếu chỉ còn 1 người, chọn luôn
        if (candidates.size() == 1) {
            StaffCandidate chosen = candidates.get(0);
            return buildResult(chosen, "Là thợ duy nhất trống lịch.");
        }

        // BƯỚC 4: Lọc theo Tổng thời gian phục vụ trong ngày (tìm Min)
        int minMinsToday = candidates.stream().mapToInt(c -> c.totalMinsToday).min().orElse(0);
        List<StaffCandidate> step4List = candidates.stream().filter(c -> c.totalMinsToday == minMinsToday).toList();
        if (step4List.size() == 1) {
            return buildResult(step4List.get(0), "Có tổng thời gian làm việc trong ngày ít nhất (" + minMinsToday + " phút).");
        }

        // BƯỚC 5: Lọc theo Số đơn trong ngày (tìm Min)
        int minBookingsToday = step4List.stream().mapToInt(c -> c.totalBookingsToday).min().orElse(0);
        List<StaffCandidate> step5List = step4List.stream().filter(c -> c.totalBookingsToday == minBookingsToday).toList();
        if (step5List.size() == 1) {
            return buildResult(step5List.get(0), "Có cùng phút làm việc nhưng số đơn ít nhất (" + minBookingsToday + " đơn).");
        }

        // Calculate week dates
        LocalDate startOfWeek = bookingDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = bookingDate.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        for (StaffCandidate sc : step5List) {
            sc.totalMinsWeek = bookingRepository.sumDurationByStaffAndDateRange(sc.staff.getId(), startOfWeek, endOfWeek);
        }

        // BƯỚC 6: Tổng số phút trong tuần
        int minMinsWeek = step5List.stream().mapToInt(c -> c.totalMinsWeek).min().orElse(0);
        List<StaffCandidate> step6List = step5List.stream().filter(c -> c.totalMinsWeek == minMinsWeek).toList();
        if (step6List.size() == 1) {
            return buildResult(step6List.get(0), "Có tổng thời gian làm việc trong tuần ít nhất (" + minMinsWeek + " phút).");
        }

        // Calculate month dates
        LocalDate startOfMonth = bookingDate.withDayOfMonth(1);
        LocalDate endOfMonth = bookingDate.with(TemporalAdjusters.lastDayOfMonth());

        for (StaffCandidate sc : step6List) {
            sc.totalMinsMonth = bookingRepository.sumDurationByStaffAndDateRange(sc.staff.getId(), startOfMonth, endOfMonth);
        }

        // BƯỚC 7: Tổng số phút trong tháng
        int minMinsMonth = step6List.stream().mapToInt(c -> c.totalMinsMonth).min().orElse(0);
        List<StaffCandidate> step7List = step6List.stream().filter(c -> c.totalMinsMonth == minMinsMonth).toList();
        if (step7List.size() == 1) {
            return buildResult(step7List.get(0), "Có tổng thời gian làm việc trong tháng ít nhất (" + minMinsMonth + " phút).");
        }

        // BƯỚC 8: Random trong nhóm còn lại
        StaffCandidate chosen = step7List.get(RANDOM.nextInt(step7List.size()));
        return buildResult(chosen, "Lựa chọn ngẫu nhiên do cân bằng toàn bộ chỉ số.");
    }

    private BookingAssignmentResult buildResult(StaffCandidate sc, String reason) {
        BookingAssignmentResult result = new BookingAssignmentResult();
        result.setEmployeeId(sc.staff.getId());
        result.setEmployeeName(sc.staff.getName());
        result.setReason(reason);
        result.setTotalMinutesToday(sc.totalMinsToday);
        result.setBookingToday(sc.totalBookingsToday);
        result.setMinutesWeek(sc.totalMinsWeek);
        result.setMinutesMonth(sc.totalMinsMonth);
        result.setStaff(sc.staff);
        return result;
    }

    private static class StaffCandidate {
        Staff staff;
        int totalMinsToday = 0;
        int totalBookingsToday = 0;
        int totalMinsWeek = 0;
        int totalMinsMonth = 0;
    }
}
