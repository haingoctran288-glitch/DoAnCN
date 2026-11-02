package com.example.API_java.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "barber_id")
    private Staff barber;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "booking_id")
    private Integer bookingId;

    @Column(name = "order_id")
    private Long orderId;

    @Column(nullable = false)
    private Double rating;

    @Column(columnDefinition = "NVARCHAR(1000)")
    private String comment;

    @Column(columnDefinition = "NVARCHAR(1000)")
    private String reply;

    @Column(name = "replied_by_role")
    private String repliedByRole;

    @Column(name = "replied_by_name")
    private String repliedByName;

    @Column(name = "replied_at")
    private LocalDateTime repliedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
