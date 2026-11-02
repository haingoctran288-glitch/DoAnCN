package com.example.API_java.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_vouchers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerVoucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "voucher_id", nullable = false)
    private Voucher voucher;

    @Column(nullable = false, length = 100)
    private String code;

    @Column(length = 50)
    private String status = "UNUSED"; // UNUSED, USED, EXPIRED

    @Column(name = "used_count")
    private Integer usedCount = 0;

    @Column(length = 255)
    private String note;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "claimed_at")
    private LocalDateTime claimedAt;

    @Column(name = "used_at")
    private LocalDateTime usedAt;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "booking_id")
    private Long bookingId;

    @PrePersist
    protected void onCreate() {
        this.claimedAt = LocalDateTime.now();
    }
}
