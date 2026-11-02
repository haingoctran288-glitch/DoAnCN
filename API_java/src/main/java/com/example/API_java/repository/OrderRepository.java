package com.example.API_java.repository;

import com.example.API_java.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Order> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, String status);
    List<Order> findAllByOrderByCreatedAtDesc();

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.userId = :userId AND o.status = 'delivered'")
    Double getProductSpentByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
}
