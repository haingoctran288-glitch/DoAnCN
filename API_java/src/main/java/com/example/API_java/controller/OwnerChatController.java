package com.example.API_java.controller;

import com.example.API_java.entity.OwnerChat;
import com.example.API_java.entity.User;
import com.example.API_java.repository.OwnerChatRepository;
import com.example.API_java.repository.UserRepository;
import com.example.API_java.repository.NotificationRepository;
import com.example.API_java.entity.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/owner-chat")
@CrossOrigin(origins = "*")
public class OwnerChatController {

    @Autowired
    private OwnerChatRepository ownerChatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/admin/threads")
    public ResponseEntity<?> getAllThreads(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        User admin = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (admin == null || (!"ADMIN".equals(admin.getRole()))) {
            return ResponseEntity.status(403).body("Chỉ admin mới có quyền truy cập");
        }
        
        List<OwnerChat> latestMessages = ownerChatRepository.findLatestMessagesPerUser();
        return ResponseEntity.ok(latestMessages);
    }

    @GetMapping("/admin/user/{userId}")
    public ResponseEntity<?> getUserThread(@PathVariable Integer userId, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        User admin = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (admin == null || (!"ADMIN".equals(admin.getRole()))) {
            return ResponseEntity.status(403).body("Chỉ admin mới có quyền truy cập");
        }

        List<OwnerChat> messages = ownerChatRepository.findByUser_IdOrderByCreatedAtAsc(userId);
        
        // Mark as read by admin
        for (OwnerChat msg : messages) {
            if (Boolean.FALSE.equals(msg.getIsReadByAdmin()) && !msg.getSender().getId().equals(admin.getId())) {
                msg.setIsReadByAdmin(true);
                ownerChatRepository.save(msg);
            }
        }
        
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/my-messages")
    public ResponseEntity<?> getMyMessages(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        List<OwnerChat> messages = ownerChatRepository.findByUser_IdOrderByCreatedAtAsc(user.getId());
        
        // Mark as read by user
        for (OwnerChat msg : messages) {
            if (Boolean.FALSE.equals(msg.getIsReadByUser()) && !msg.getSender().getId().equals(user.getId())) {
                msg.setIsReadByUser(true);
                ownerChatRepository.save(msg);
            }
        }

        return ResponseEntity.ok(messages);
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, Object> data, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        User sender = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (sender == null) return ResponseEntity.status(401).build();

        String content = (String) data.get("content");
        String imageUrl = (String) data.get("imageUrl");
        Integer targetUserId = null;

        if (data.containsKey("userId") && data.get("userId") != null) {
            targetUserId = Integer.valueOf(data.get("userId").toString());
        }

        OwnerChat message = new OwnerChat();
        message.setSender(sender);
        message.setContent(content);
        message.setImageUrl(imageUrl);

        if ("ADMIN".equals(sender.getRole()) && targetUserId != null) {
            User targetUser = userRepository.findById(targetUserId).orElse(null);
            if (targetUser == null) return ResponseEntity.badRequest().body("User not found");
            message.setUser(targetUser);
            message.setIsReadByAdmin(true);

            // Notify Customer
            Notification notif = new Notification();
            notif.setUser(targetUser);
            notif.setType("chat");
            notif.setTitle("Phản hồi từ Ban Quản Lý");
            notif.setMessage("Ban quản lý vừa trả lời tin nhắn của bạn. Vui lòng kiểm tra mục Liên hệ chủ tiệm.");
            notificationRepository.save(notif);

        } else {
            message.setUser(sender);
            message.setIsReadByUser(true);

            // Notify Admin (optional, we can just save it for user=null or handle specifically)
            // Or we can find admin user and save. But let's just create a generic admin notification if we have an admin system, or just find any admin.
            List<User> admins = userRepository.findByRole("ADMIN");
            for (User admin : admins) {
                Notification notif = new Notification();
                notif.setUser(admin);
                notif.setType("chat");
                notif.setTitle("Tin nhắn mới từ " + sender.getFullName());
                notif.setMessage("Khách hàng " + sender.getFullName() + " vừa gửi tin nhắn liên hệ mới.");
                notificationRepository.save(notif);
            }
        }

        OwnerChat saved = ownerChatRepository.save(message);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(Authentication authentication) {
        if (authentication == null) return ResponseEntity.ok(Map.of("count", 0));
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.ok(Map.of("count", 0));

        long count = 0;
        if ("ADMIN".equals(user.getRole())) {
            count = ownerChatRepository.countByIsReadByAdminFalseAndSender_IdNot(user.getId());
        } else {
            count = ownerChatRepository.countByUser_IdAndIsReadByUserFalseAndSender_IdNot(user.getId(), user.getId());
        }

        return ResponseEntity.ok(Map.of("count", count));
    }
}
