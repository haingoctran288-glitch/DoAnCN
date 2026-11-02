package com.example.API_java.repository;

import com.example.API_java.entity.CustomerChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerChatRepository extends JpaRepository<CustomerChat, Integer> {
    List<CustomerChat> findByUserIdOrderByCreatedAtDesc(Integer userId);
    List<CustomerChat> findByBarberIdOrderByCreatedAtDesc(Integer barberId);
}
