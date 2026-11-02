package com.example.API_java.repository;

import com.example.API_java.entity.StaffLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StaffLeaveRepository extends JpaRepository<StaffLeave, Integer> {

    // Lấy tất cả kỳ nghỉ của một nhân viên
    List<StaffLeave> findByStaff_IdOrderByStartDateDesc(Integer staffId);

    // Lấy tất cả kỳ nghỉ đang ACTIVE
    List<StaffLeave> findByLeaveStatusOrderByStartDateAsc(StaffLeave.LeaveStatus leaveStatus);

    // Kiểm tra xem một nhân viên có đang nghỉ vào một ngày cụ thể không
    @Query("SELECT sl FROM StaffLeave sl WHERE sl.staff.id = :staffId " +
           "AND sl.leaveStatus = 'ACTIVE' " +
           "AND sl.startDate <= :date AND sl.endDate >= :date")
    List<StaffLeave> findActiveLeaveOnDate(@Param("staffId") Integer staffId, @Param("date") LocalDate date);

    // Kiểm tra chồng lịch nghỉ (trừ chính nó khi sửa)
    @Query("SELECT sl FROM StaffLeave sl WHERE sl.staff.id = :staffId " +
           "AND sl.leaveStatus = 'ACTIVE' " +
           "AND sl.startDate <= :endDate AND sl.endDate >= :startDate " +
           "AND (:excludeId IS NULL OR sl.id != :excludeId)")
    List<StaffLeave> findOverlappingLeave(@Param("staffId") Integer staffId,
                                          @Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate,
                                          @Param("excludeId") Integer excludeId);

    // Lấy kỳ nghỉ ACTIVE đã qua end_date (để Cron/API tự động đóng)
    @Query("SELECT sl FROM StaffLeave sl WHERE sl.leaveStatus = 'ACTIVE' AND sl.endDate < :today")
    List<StaffLeave> findExpiredActiveLeaves(@Param("today") LocalDate today);

    // Đếm nhân viên đang nghỉ (cho Dashboard)
    @Query("SELECT COUNT(DISTINCT sl.staff.id) FROM StaffLeave sl WHERE sl.leaveStatus = 'ACTIVE' " +
           "AND sl.startDate <= :today AND sl.endDate >= :today")
    long countStaffCurrentlyOnLeave(@Param("today") LocalDate today);

    // Nhân viên sắp nghỉ trong N ngày tới (cho Dashboard)
    @Query("SELECT sl FROM StaffLeave sl WHERE sl.leaveStatus = 'ACTIVE' " +
           "AND sl.startDate > :today AND sl.startDate <= :futureDate " +
           "ORDER BY sl.startDate ASC")
    List<StaffLeave> findUpcomingLeaves(@Param("today") LocalDate today, @Param("futureDate") LocalDate futureDate);

    // Lấy tất cả kỳ nghỉ với filter
    @Query("SELECT sl FROM StaffLeave sl WHERE " +
           "(:staffId IS NULL OR sl.staff.id = :staffId) AND " +
           "(:status IS NULL OR sl.leaveStatus = :status) AND " +
           "(:branch IS NULL OR sl.staff.branch = :branch) " +
           "ORDER BY sl.createdAt DESC")
    List<StaffLeave> findAllWithFilter(@Param("staffId") Integer staffId,
                                       @Param("status") StaffLeave.LeaveStatus status,
                                       @Param("branch") String branch);
}
