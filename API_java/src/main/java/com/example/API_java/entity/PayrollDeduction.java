package com.example.API_java.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Lưu chi tiết khấu trừ lương từng ngày khi nhân viên nghỉ.
 * Mỗi ngày nghỉ sinh 1 record — không gộp — để PDF bảng lương chi tiết.
 */
@Entity
@Table(name = "payroll_deductions")
@Data
public class PayrollDeduction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    // Liên kết về kỳ nghỉ gốc để biết context
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_leave_id", nullable = false)
    private StaffLeave staffLeave;

    // Ngày cụ thể bị khấu trừ
    @Column(name = "deduction_date", nullable = false)
    private LocalDate deductionDate;

    // Loại nghỉ (copy từ StaffLeave để tránh join phức tạp khi in PDF)
    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type", nullable = false, length = 30)
    private StaffLeave.LeaveType leaveType;

    // Loại lương (PAID/UNPAID)
    @Enumerated(EnumType.STRING)
    @Column(name = "salary_type", nullable = false, length = 20)
    private StaffLeave.LeaveSalaryType salaryType;

    // Tỷ lệ khấu trừ (%): 70 = trừ 70%, 100 = trừ 100%
    @Column(name = "deduction_rate", nullable = false)
    private Integer deductionRate;

    // Lương ngày cơ bản (lấy từ SalarySetting tại thời điểm tạo)
    @Column(name = "base_daily_salary", precision = 12, scale = 2)
    private BigDecimal baseDailySalary;

    // Số tiền bị khấu trừ thực tế = baseDailySalary * deductionRate / 100
    @Column(name = "deduction_amount", precision = 12, scale = 2)
    private BigDecimal deductionAmount;

    // Ghi chú hiển thị trên PDF bảng lương (ví dụ: "Nghỉ phép có lương - 70%")
    @Column(length = 255)
    private String note;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
