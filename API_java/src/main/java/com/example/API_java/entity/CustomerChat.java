package com.example.API_java.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_chats")
@Data
public class CustomerChat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "barber_id", nullable = false)
    private Staff barber;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_contact", nullable = false)
    private String customerContact;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String reply;

    @Column(name = "replied_at")
    private LocalDateTime repliedAt;

    @Column(name = "status")
    private String status = "PENDING"; // PENDING, REPLIED, REPORTED

    @Column(name = "report_reason")
    private String reportReason;

    @Column(name = "report_details", columnDefinition = "TEXT")
    private String reportDetails;

    @Column(name = "reported_at")
    private LocalDateTime reportedAt;

    @Column(name = "is_recalled")
    private Boolean isRecalled = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        if (this.isRecalled == null) this.isRecalled = false;
    }
}
