package com.example.API_java.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Lưu thông tin từng kỳ nghỉ của nhân viên.
 * Mỗi lần Admin đăng ký nghỉ cho nhân viên là 1 record.
 */
@Entity
@Table(name = "staff_leave")
@Data
public class StaffLeave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Nhân viên được đăng ký nghỉ
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    // Loại nghỉ: ANNUAL_LEAVE, SICK_LEAVE, PERSONAL, OTHER
    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type", nullable = false, length = 30)
    private LeaveType leaveType;

    // Loại lương: PAID (trừ 70%), UNPAID (trừ 100%)
    @Enumerated(EnumType.STRING)
    @Column(name = "salary_type", nullable = false, length = 20)
    private LeaveSalaryType salaryType = LeaveSalaryType.PAID;

    // Trạng thái kỳ nghỉ
    @Enumerated(EnumType.STRING)
    @Column(name = "leave_status", nullable = false, length = 20)
    private LeaveStatus leaveStatus = LeaveStatus.ACTIVE;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(columnDefinition = "TEXT")
    private String reason;

    // Admin đã tạo lịch nghỉ
    @Column(name = "created_by", length = 100)
    private String createdBy;

    // IP của Admin khi tạo (phục vụ audit log)
    @Column(name = "ip_created", length = 50)
    private String ipCreated;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ===== ENUMS INNER =====

    public enum LeaveType {
        ANNUAL_LEAVE,   // Nghỉ phép năm
        SICK_LEAVE,     // Nghỉ ốm
        PERSONAL,       // Việc cá nhân
        OTHER           // Khác
    }

    public enum LeaveSalaryType {
        PAID,           // Có lương (trừ một phần theo cấu hình)
        UNPAID          // Không lương (trừ 100%)
    }

    public enum LeaveStatus {
        ACTIVE,         // Đang trong kỳ nghỉ
        FINISHED,       // Đã kết thúc
        CANCELLED       // Đã hủy (Admin hủy sớm)
    }
}
