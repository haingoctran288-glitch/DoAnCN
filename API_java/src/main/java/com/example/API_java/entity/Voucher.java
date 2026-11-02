package com.example.API_java.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "vouchers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String code;

    @Column(name = "voucher_type", nullable = false, length = 50)
    private String voucherType; // FIXED, PERCENTAGE, FREE_SERVICE

    @Column(nullable = false)
    private Double value;

    @Column(name = "max_discount")
    private Double maxDiscount;

    @Column(name = "min_order_value")
    private Double minOrderValue;

    @Column(name = "apply_to", nullable = false, length = 50)
    private String applyTo; // SERVICE, PRODUCT, ALL

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "total_quantity", nullable = false)
    private Integer totalQuantity;

    @Column(name = "used_quantity")
    private Integer usedQuantity = 0;

    @Column(name = "user_limit")
    private Integer userLimit = 1;

    @Column(length = 20)
    private String status = "ACTIVE"; // ACTIVE, PAUSED

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "issue_type", length = 50)
    private String issueType = "MANUAL"; // MANUAL, NEW_CUSTOMER, BIRTHDAY, MEMBERSHIP, ALL_CUSTOMERS

    @Column(name = "membership_level", length = 50)
    private String membershipLevel;

    @Column(name = "birth_month")
    private Integer birthMonth;

    @Column(name = "campaign_start_date")
    private LocalDateTime campaignStartDate;

    @Column(name = "campaign_end_date")
    private LocalDateTime campaignEndDate;

    @Column(name = "notification_title")
    private String notificationTitle;

    @Column(name = "notification_message", columnDefinition = "TEXT")
    private String notificationMessage;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.usedQuantity == null) {
            this.usedQuantity = 0;
        }
    }
}
