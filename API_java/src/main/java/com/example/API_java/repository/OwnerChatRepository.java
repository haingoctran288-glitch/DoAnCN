package com.example.API_java.repository;

import com.example.API_java.entity.OwnerChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OwnerChatRepository extends JpaRepository<OwnerChat, Integer> {
    
    List<OwnerChat> findByUser_IdOrderByCreatedAtAsc(Integer userId);

    @Query("SELECT o FROM OwnerChat o WHERE o.id IN (SELECT MAX(o2.id) FROM OwnerChat o2 GROUP BY o2.user.id) ORDER BY o.createdAt DESC")
    List<OwnerChat> findLatestMessagesPerUser();
    
    Long countByUser_IdAndIsReadByUserFalseAndSender_IdNot(Integer userId, Integer senderId);
    
    Long countByIsReadByAdminFalseAndSender_IdNot(Integer senderId);
}
