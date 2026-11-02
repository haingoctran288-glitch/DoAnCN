package com.example.API_java.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Entity lưu mã OTP cho chức năng quên mật khẩu
 */
@Entity
@Table(name = "otp_codes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Otp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, length = 6)
    private String code;

    // Thời gian hết hạn (5 phút sau khi tạo)
    @Column(name = "expired_at", nullable = false)
    private LocalDateTime expiredAt;

    // Đã sử dụng chưa (tránh dùng lại)
    @Column(name = "is_used", nullable = false)
    private boolean isUsed = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
