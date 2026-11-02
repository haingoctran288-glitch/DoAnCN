package com.example.API_java.repository;

import com.example.API_java.entity.Staff;
import com.example.API_java.entity.StaffWorkStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {
    List<Staff> findByIsActiveTrue();
    @Query("SELECT s FROM Staff s WHERE s.isActive = true AND (s.workStatus IS NULL OR s.workStatus != :status)")
    List<Staff> findActiveStaffExceptStatus(@Param("status") StaffWorkStatus status);
    
    @Query("SELECT s FROM Staff s WHERE s.isActive = true AND (s.workStatus IS NULL OR s.workStatus = 'WORKING')")
    List<Staff> findActiveAndWorkingStaff();
    List<Staff> findByBranchAndIsActiveTrue(String branch);

    // Lấy thợ đang làm việc (workStatus = WORKING) tại chi nhánh — dùng cho auto-assign và leave module
    @Query("SELECT s FROM Staff s WHERE s.branch = :branch AND s.isActive = true AND s.workStatus = 'WORKING'")
    List<Staff> findWorkingStaffByBranch(@Param("branch") String branch);

    // Lấy tất cả thợ đang làm việc (không nghỉ, không nghỉ việc)
    @Query("SELECT s FROM Staff s WHERE s.isActive = true AND s.workStatus = 'WORKING'")
    List<Staff> findAllWorkingStaff();
}
