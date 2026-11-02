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

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Staff getBarber() { return barber; }
    public void setBarber(Staff barber) { this.barber = barber; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Integer getBookingId() { return bookingId; }
    public void setBookingId(Integer bookingId) { this.bookingId = bookingId; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public String getRepliedByRole() { return repliedByRole; }
    public void setRepliedByRole(String repliedByRole) { this.repliedByRole = repliedByRole; }

    public String getRepliedByName() { return repliedByName; }
    public void setRepliedByName(String repliedByName) { this.repliedByName = repliedByName; }

    public LocalDateTime getRepliedAt() { return repliedAt; }
    public void setRepliedAt(LocalDateTime repliedAt) { this.repliedAt = repliedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
