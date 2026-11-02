package com.example.API_java.controller;

import com.example.API_java.entity.Review;
import com.example.API_java.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // BARBER REVIEWS
    @GetMapping("/barber/{barberId}")
    public ResponseEntity<?> getBarberReviews(@PathVariable Integer barberId) {
        return ResponseEntity.ok(reviewService.getBarberReviews(barberId));
    }

    @GetMapping("/barber/{barberId}/stats")
    public ResponseEntity<?> getBarberStats(@PathVariable Integer barberId) {
        return ResponseEntity.ok(reviewService.getBarberRatingStats(barberId));
    }

    @PostMapping("/barber")
    public ResponseEntity<?> createBarberReview(@RequestBody Map<String, Object> payload) {
        try {
            Integer userId = (Integer) payload.get("userId");
            Integer barberId = (Integer) payload.get("barberId");
            Integer bookingId = (Integer) payload.get("bookingId");
            Double rating = Double.valueOf(payload.get("rating").toString());
            String comment = (String) payload.get("comment");

            Review review = reviewService.createBarberReview(userId, barberId, bookingId, rating, comment);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // PRODUCT REVIEWS
    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    @GetMapping("/product/{productId}/stats")
    public ResponseEntity<?> getProductStats(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductRatingStats(productId));
    }

    @PostMapping("/product")
    public ResponseEntity<?> createProductReview(@RequestBody Map<String, Object> payload) {
        try {
            Integer userId = (Integer) payload.get("userId");
            Long productId = Long.valueOf(payload.get("productId").toString());
            Long orderId = Long.valueOf(payload.get("orderId").toString());
            Double rating = Double.valueOf(payload.get("rating").toString());
            String comment = (String) payload.get("comment");

            Review review = reviewService.createProductReview(userId, productId, orderId, rating, comment);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ADMIN ACTIONS
    @PostMapping("/{reviewId}/reply")
    public ResponseEntity<?> replyToReview(@PathVariable Integer reviewId, @RequestBody Map<String, Object> payload) {
        try {
            Integer adminId = (Integer) payload.get("adminId");
            String reply = (String) payload.get("reply");
            Review review = reviewService.replyToReview(reviewId, adminId, reply);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Integer reviewId) {
        try {
            reviewService.deleteReview(reviewId);
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
