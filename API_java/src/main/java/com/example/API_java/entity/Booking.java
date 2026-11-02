package com.example.API_java.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Entity ánh xạ bảng bookings
 */
@Entity
@Table(name = "bookings")
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service service; // Keep for backward compatibility

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "booking_services",
        joinColumns = @JoinColumn(name = "booking_id"),
        inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private java.util.List<Service> services = new java.util.ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;

    // Thông tin khách vãng lai (Guest)
    @Column(name = "customer_name", length = 100)
    private String customerName;

    @Column(name = "customer_phone", length = 20)
    private String customerPhone;

    @Column(name = "customer_email", length = 100)
    private String customerEmail;

    @Column(name = "booking_date")
    private LocalDate bookingDate;

    @Column(name = "booking_time")
    private LocalTime bookingTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Column(name = "payment_method", length = 20)
    private String paymentMethod;

    @Column(name = "transaction_no", length = 100)
    private String transactionNo;

    @Column(name = "status", length = 20)
    private String status = "PENDING";

    @Column(name = "cancel_reason", length = 50)
    private String cancelReason;
    // Giá trị cancel_reason: CUSTOMER_CANCEL | STAFF_ON_LEAVE | SYSTEM_CANCEL | PAYMENT_TIMEOUT | admin_cancel | late_customer

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "cancelled_by", length = 50)
    private String cancelledBy;

    @Column(name = "refund_status", length = 50)
    private String refundStatus;
    // Giá trị refund_status: NONE | REFUNDED | WAITING_REFUND | no_refund | success | failed

    // === BOOKING LOCK (khi nhân viên nghỉ) ===
    @Column(name = "locked")
    private Boolean locked = false;

    @Column(name = "lock_reason", length = 50)
    private String lockReason;
    // STAFF_ON_LEAVE | DISPUTE | SYSTEM_HOLD

    @Column(name = "locked_at")
    private LocalDateTime lockedAt;

    @Column(name = "refund_at")
    private LocalDateTime refundAt;

    @Column(name = "created_by_editor", length = 100)
    private String createdByEditor; // Username của Editor nếu đặt hộ

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
    }
}
