package com.example.API_java.repository;

import com.example.API_java.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    // Lấy tất cả booking của một user, mới nhất trước
    // Dùng User_Id (underscore) để Spring JPA hiểu đây là user.id (nested property)
    List<Booking> findByUser_IdOrderByBookingDateDesc(Integer userId);

    // Lấy booking mới nhất của user
    Optional<Booking> findTopByUser_IdOrderByBookingDateDesc(Integer userId);

    // Tổng tiền đã chi của user (JPQL query, bỏ đơn CANCELLED)
    @Query("SELECT COALESCE(SUM(b.service.price), 0) FROM Booking b WHERE b.user.id = :userId AND b.status != 'CANCELLED'")
    BigDecimal getTotalSpentByUserId(@Param("userId") Integer userId);

    // Đếm số lần đặt của user
    long countByUser_Id(Integer userId);

    // Đếm số lần đặt lịch thành công của user
    long countByUser_IdAndStatus(Integer userId, String status);

    // Lấy các booking của thợ trong một ngày cụ thể (trừ CANCELLED)
    List<Booking> findByStaff_IdAndBookingDateAndStatusNot(Integer staffId, java.time.LocalDate bookingDate, String status);

    // Lấy các booking của thợ theo danh sách status (ví dụ: chỉ lấy PAID, COMPLETED)
    List<Booking> findByStaff_IdAndBookingDateAndStatusIn(Integer staffId, java.time.LocalDate bookingDate, List<String> statuses);

    // Lấy danh sách booking theo trạng thái, sắp xếp mới nhất trước (dùng cho admin)
    List<Booking> findByStatusInOrderByIdDesc(List<String> statuses);

    @Query("SELECT COALESCE(SUM(b.service.price), 0) FROM Booking b WHERE b.user.id = :userId AND b.status = 'COMPLETED'")
    BigDecimal getServiceSpentByUserId(@Param("userId") Integer userId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.user.id = :userId AND b.status = 'COMPLETED'")
    long getCompletedBookingCount(@Param("userId") Integer userId);

    @Query("SELECT b FROM Booking b WHERE b.service.id = :serviceId OR :serviceId IN (SELECT s.id FROM b.services s)")
    List<Booking> findByServiceIdOrInServices(@Param("serviceId") Integer serviceId);

    // Dành cho WorkSchedule (Lịch làm việc)
    List<Booking> findByStaffNotNullOrderByBookingDateDescBookingTimeDesc();
    
    List<Booking> findByStaff_BranchOrderByBookingDateDescBookingTimeDesc(String branch);
    
    List<Booking> findByStaff_IdOrderByBookingDateDescBookingTimeDesc(Integer staffId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.staff.id = :staffId AND b.status = 'COMPLETED'")
    long countCompletedBookingsByStaff(@Param("staffId") Integer staffId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.staff.id = :staffId AND b.status = 'COMPLETED' AND b.bookingDate >= :startDate")
    long countPerformanceByStaff(@Param("staffId") Integer staffId, @Param("startDate") java.time.LocalDate startDate);

    @Query("SELECT b FROM Booking b WHERE b.staff.id = :staffId AND b.status = 'COMPLETED' AND YEAR(b.bookingDate) = :year AND MONTH(b.bookingDate) = :month")
    List<Booking> findCompletedByStaffAndMonth(@Param("staffId") Integer staffId, @Param("year") int year, @Param("month") int month);

    @Query("SELECT COALESCE(SUM(b.duration), 0) FROM Booking b WHERE b.staff.id = :staffId AND b.status != 'CANCELLED' AND b.bookingDate >= :startDate AND b.bookingDate <= :endDate")
    Integer sumDurationByStaffAndDateRange(@Param("staffId") Integer staffId, @Param("startDate") java.time.LocalDate startDate, @Param("endDate") java.time.LocalDate endDate);

    // === STAFF LEAVE MODULE ===
    // Lấy booking bị ảnh hưởng khi nhân viên nghỉ (chỉ PENDING, CONFIRMED, PAID)
    List<Booking> findByStaff_IdAndBookingDateBetweenAndStatusIn(
        Integer staffId, java.time.LocalDate startDate, java.time.LocalDate endDate, List<String> statuses);

    // Lấy booking bị lock (để hiển thị danh sách WAITING_REFUND)
    List<Booking> findByLockedTrueAndRefundStatus(String refundStatus);

    // Đếm booking bị hủy do nhân viên nghỉ trong tháng (Dashboard)
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.cancelReason = 'STAFF_ON_LEAVE' " +
           "AND YEAR(b.cancelledAt) = YEAR(CURRENT_DATE) AND MONTH(b.cancelledAt) = MONTH(CURRENT_DATE)")
    long countCancelledByLeaveThisMonth();
}
