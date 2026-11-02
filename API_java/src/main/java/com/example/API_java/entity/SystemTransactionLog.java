package com.example.API_java.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Ghi log mọi thao tác liên quan đến kỳ nghỉ nhân viên:
 * tạo nghỉ, đổi thợ, hoàn tiền, hủy booking.
 * Dùng để audit khi có tranh chấp.
 */
@Entity
@Table(name = "system_transaction_logs")
@Data
public class SystemTransactionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Loại hành động
    @Column(name = "action_type", nullable = false, length = 50)
    private String actionType; 
    // Ví dụ: LEAVE_CREATED, STAFF_CHANGED, BOOKING_CANCELLED, REFUND_SUCCESS, REFUND_FAILED, LEAVE_CANCELLED

    // Nhân viên nghỉ (có thể null nếu không liên quan)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    private Staff staff;

    // Booking bị ảnh hưởng (có thể null)
    @Column(name = "booking_id")
    private Integer bookingId;

    // Kỳ nghỉ liên quan
    @Column(name = "staff_leave_id")
    private Integer staffLeaveId;

    // Refund ID từ cổng thanh toán (VNPay/MoMo)
    @Column(name = "refund_id", length = 100)
    private String refundId;

    // Số tiền refund
    @Column(name = "refund_amount", precision = 12, scale = 2)
    private BigDecimal refundAmount;

    // Admin thực hiện thao tác
    @Column(name = "actor_username", length = 100)
    private String actorUsername;

    // IP của Admin
    @Column(name = "actor_ip", length = 50)
    private String actorIp;

    // Kết quả: SUCCESS | FAILED | PENDING
    @Column(name = "result", length = 20)
    private String result;

    // Thông báo lỗi (nếu FAILED)
    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    // Mô tả chi tiết hành động
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
