package com.example.API_java.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "voucher_campaigns")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherCampaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "voucher_id", nullable = false)
    private Voucher voucher;

    @Column(name = "trigger_type", nullable = false, length = 100)
    private String triggerType; 
    // NEW_REGISTER, FIRST_BOOKING_COMPLETED, BOOKING_COUNT_X, COMPLETED_HAIRCUTS_X, 
    // FIRST_PRODUCT_ORDER, ORDER_VALUE_OVER_X, BIRTHDAY, MEMBERSHIP_TIER

    @Column(name = "trigger_value", length = 255)
    private String triggerValue; 
    // Stores criteria: e.g. "5" (for booking count), "300000" (for order threshold), 
    // or tier name: "Người Của Công Chúng", etc.

    @Column(length = 20)
    private String status = "ACTIVE"; // ACTIVE, PAUSED

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
