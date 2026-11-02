package com.example.API_java.repository;

import com.example.API_java.entity.PayrollDeduction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PayrollDeductionRepository extends JpaRepository<PayrollDeduction, Integer> {

    // Lấy tất cả khấu trừ của 1 nhân viên trong 1 tháng (cho bảng lương)
    @Query("SELECT pd FROM PayrollDeduction pd WHERE pd.staff.id = :staffId " +
           "AND YEAR(pd.deductionDate) = :year AND MONTH(pd.deductionDate) = :month " +
           "ORDER BY pd.deductionDate ASC")
    List<PayrollDeduction> findByStaffAndMonth(@Param("staffId") Integer staffId,
                                               @Param("year") int year,
                                               @Param("month") int month);

    // Tổng khấu trừ của 1 nhân viên trong 1 tháng
    @Query("SELECT COALESCE(SUM(pd.deductionAmount), 0) FROM PayrollDeduction pd " +
           "WHERE pd.staff.id = :staffId AND YEAR(pd.deductionDate) = :year AND MONTH(pd.deductionDate) = :month")
    BigDecimal sumDeductionByStaffAndMonth(@Param("staffId") Integer staffId,
                                           @Param("year") int year,
                                           @Param("month") int month);

    // Lấy tất cả khấu trừ theo kỳ nghỉ (để xóa khi hủy/sửa kỳ nghỉ)
    List<PayrollDeduction> findByStaffLeave_Id(Integer staffLeaveId);
}
