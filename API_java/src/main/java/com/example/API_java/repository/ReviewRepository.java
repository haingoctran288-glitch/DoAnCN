package com.example.API_java.repository;

import com.example.API_java.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByBarberIdOrderByCreatedAtDesc(Integer barberId);
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);

    boolean existsByUserIdAndBookingId(Integer userId, Integer bookingId);
    boolean existsByUserIdAndOrderId(Integer userId, Long orderId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.barber.id = :barberId")
    Double getAverageRatingForBarber(@Param("barberId") Integer barberId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.barber.id = :barberId")
    Long getReviewCountForBarber(@Param("barberId") Integer barberId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRatingForProduct(@Param("productId") Long productId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId")
    Long getReviewCountForProduct(@Param("productId") Long productId);
}
