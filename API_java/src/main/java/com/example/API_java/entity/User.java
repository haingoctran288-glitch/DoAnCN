package com.example.API_java.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Entity User - Ánh xạ tới bảng "users" trong MySQL
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    // Email (unique, bắt buộc)
    @Column(unique = true, length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(nullable = false, length = 20)
    private String role = "USER";

    @Column(length = 100)
    private String branch; // Chi nhánh gắn với Editor

    @Column(name = "employee_id")
    private Integer employeeId; // Liên kết với Staff

    @Column(length = 255)
    private String avatar;

    @Column(name = "birthday")
    private java.time.LocalDate birthday;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "is_cash_payment_locked")
    private Boolean isCashPaymentLocked = false;

    @Column(name = "is_blocked")
    private Boolean isBlocked = false;

    @Column(name = "blocked_reason")
    private String blockedReason;

    @Column(name = "blocked_at")
    private LocalDateTime blockedAt;

    @Column(name = "blocked_by")
    private Integer blockedBy;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
