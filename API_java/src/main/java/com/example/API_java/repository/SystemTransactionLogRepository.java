package com.example.API_java.repository;

import com.example.API_java.entity.SystemTransactionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemTransactionLogRepository extends JpaRepository<SystemTransactionLog, Long> {

    // Lấy log theo kỳ nghỉ
    List<SystemTransactionLog> findByStaffLeaveIdOrderByCreatedAtDesc(Integer staffLeaveId);

    // Lấy log theo booking
    List<SystemTransactionLog> findByBookingIdOrderByCreatedAtDesc(Integer bookingId);

    @Query("SELECT COUNT(l) FROM SystemTransactionLog l WHERE l.actionType = 'BOOKING_CANCELLED' " +
           "AND YEAR(l.createdAt) = YEAR(CURRENT_DATE) AND MONTH(l.createdAt) = MONTH(CURRENT_DATE) " +
           "AND (:branch IS NULL OR l.staff.branch = :branch)")
    long countCancelledThisMonth(@Param("branch") String branch);

    @Query("SELECT COALESCE(SUM(l.refundAmount), 0) FROM SystemTransactionLog l " +
           "WHERE l.actionType = 'REFUND_SUCCESS' AND l.result = 'SUCCESS' " +
           "AND YEAR(l.createdAt) = YEAR(CURRENT_DATE) AND MONTH(l.createdAt) = MONTH(CURRENT_DATE) " +
           "AND (:branch IS NULL OR l.staff.branch = :branch)")
    java.math.BigDecimal sumRefundThisMonth(@Param("branch") String branch);

    // Lấy log gần nhất theo nhân viên
    List<SystemTransactionLog> findByStaff_IdOrderByCreatedAtDesc(Integer staffId);
}
