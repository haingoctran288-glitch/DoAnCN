package com.example.API_java.repository;

import com.example.API_java.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUser_IdOrderByCreatedAtDesc(Integer userId);
    long countByUser_IdAndIsRead(Integer userId, Boolean isRead);
}
