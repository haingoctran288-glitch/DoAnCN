package com.example.API_java.controller;

import com.example.API_java.entity.Notification;
import com.example.API_java.entity.User;
import com.example.API_java.repository.NotificationRepository;
import com.example.API_java.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getMyNotifications(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }

        List<Notification> list = notificationRepository.findByUser_IdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok(0);
        }
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.ok(0);
        }

        long count = notificationRepository.countByUser_IdAndIsRead(user.getId(), false);
        return ResponseEntity.ok(count);
    }

    @PostMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }

        List<Notification> unreadList = notificationRepository.findByUser_IdOrderByCreatedAtDesc(user.getId())
                .stream()
                .filter(n -> !n.getIsRead())
                .toList();

        for (Notification n : unreadList) {
            n.setIsRead(true);
            notificationRepository.save(n);
        }

        return ResponseEntity.ok("All marked as read");
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Integer id, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Notification n = notificationRepository.findById(id).orElse(null);
        if (n != null && n.getUser().getUsername().equals(authentication.getName())) {
            n.setIsRead(true);
            notificationRepository.save(n);
            return ResponseEntity.ok("Marked as read");
        }
        return ResponseEntity.notFound().build();
    }
}
