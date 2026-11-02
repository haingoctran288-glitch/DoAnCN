package com.example.API_java.controller;

import com.example.API_java.entity.CustomerChat;
import com.example.API_java.entity.Notification;
import com.example.API_java.entity.Staff;
import com.example.API_java.entity.User;
import com.example.API_java.repository.CustomerChatRepository;
import com.example.API_java.repository.NotificationRepository;
import com.example.API_java.repository.StaffRepository;
import com.example.API_java.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;

@RestController
@RequestMapping("/api/chats")
@CrossOrigin(origins = "*")
public class CustomerChatController {

    @Autowired
    private CustomerChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private com.example.API_java.util.JwtUtil jwtUtil;

    // 1. Customer gửi yêu cầu chat
    @PostMapping
    public ResponseEntity<?> createChat(@RequestBody Map<String, Object> payload) {
        try {
            Integer userId = (Integer) payload.get("userId");
            Integer barberId = (Integer) payload.get("barberId");
            String name = (String) payload.get("name");
            String contact = (String) payload.get("contact");
            String message = (String) payload.get("message");
            String imageUrl = (String) payload.get("imageUrl");

            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            Staff barber = staffRepository.findById(barberId).orElseThrow(() -> new RuntimeException("Barber not found"));

            CustomerChat chat = new CustomerChat();
            chat.setUser(user);
            chat.setBarber(barber);
            chat.setCustomerName(name);
            chat.setCustomerContact(contact);
            chat.setMessage(message);
            chat.setImageUrl(imageUrl);
            chatRepository.save(chat);

            // Generate Notifications
            Set<User> targets = new HashSet<>();
            targets.addAll(userRepository.findByRole("ADMIN"));
            
            if (barber.getBranch() != null) {
                targets.addAll(userRepository.findByRoleAndBranch("EDITOR", barber.getBranch()));
            }
            
            userRepository.findByEmployeeId(barber.getId()).ifPresent(targets::add);

            for (User target : targets) {
                Notification notif = new Notification();
                notif.setUser(target);
                notif.setType("system");
                notif.setTitle("Yêu cầu tư vấn mới");
                notif.setMessage("Khách hàng " + name + " vừa gửi tin nhắn cho " + barber.getName());
                notif.setDataJson("{\"chatId\": " + chat.getId() + "}");
                notificationRepository.save(notif);
            }

            return ResponseEntity.ok(chat);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Lấy lịch sử chat của khách hàng hiện tại
    @GetMapping("/my-chats")
    public ResponseEntity<?> getMyChats(@RequestHeader("Authorization") String token) {
        try {
            // Lấy email/username từ token
            String jwt = token.substring(7);
            String username = jwtUtil.extractUsername(jwt);
            User user = userRepository.findByUsername(username).orElse(null);
            if (user == null) {
                user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));
            }
            List<CustomerChat> myChats = chatRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
            return ResponseEntity.ok(myChats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // 2. Lấy danh sách chat cho Admin / Editor / Barber
    @GetMapping
    public ResponseEntity<?> getAllChats() {
        return ResponseEntity.ok(chatRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt")));
    }

    // 3. Thợ (Barber) trả lời chat
    @PostMapping("/{id}/reply")
    public ResponseEntity<?> replyChat(@PathVariable Integer id, @RequestBody Map<String, String> payload) {
        try {
            CustomerChat chat = chatRepository.findById(id).orElseThrow(() -> new RuntimeException("Chat not found"));
            String reply = payload.get("reply");
            
            if (chat.getIsRecalled() != null && chat.getIsRecalled()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Tin nhắn đã bị thu hồi, không thể trả lời."));
            }

            chat.setReply(reply);
            chat.setRepliedAt(LocalDateTime.now());
            chat.setStatus("REPLIED");
            chatRepository.save(chat);

            // Gửi Notification cho Customer
            Notification notif = new Notification();
            notif.setUser(chat.getUser());
            notif.setType("chat_reply");
            notif.setTitle("Phản hồi từ thợ " + chat.getBarber().getName());
            notif.setMessage("Thợ " + chat.getBarber().getName() + " đã trả lời tin nhắn của bạn.");
            // Lưu id của chat vào data_json để frontend xử lý (report)
            notif.setDataJson("{\"chatId\": " + chat.getId() + ", \"replyMessage\": \"" + chat.getReply().replace("\"", "\\\"").replace("\n", "\\n") + "\"}");
            notificationRepository.save(notif);

            return ResponseEntity.ok(chat);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // 4. Thu hồi tin nhắn (chỉ thu hồi, không xóa thực sự - admin vẫn thấy log)
    @PostMapping("/{id}/recall")
    public ResponseEntity<?> recallChat(@PathVariable Integer id) {
        try {
            CustomerChat chat = chatRepository.findById(id).orElseThrow(() -> new RuntimeException("Chat not found"));
            chat.setIsRecalled(true);
            chatRepository.save(chat);
            return ResponseEntity.ok(chat);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // 5. Customer báo cáo chat
    @PostMapping("/{id}/report")
    public ResponseEntity<?> reportChat(@PathVariable Integer id, @RequestBody Map<String, String> payload) {
        try {
            CustomerChat chat = chatRepository.findById(id).orElseThrow(() -> new RuntimeException("Chat not found"));
            
            if ("REPORTED".equals(chat.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Tin nhắn này đã được báo cáo. Bạn không thể báo cáo lại."));
            }

            chat.setStatus("REPORTED");
            chat.setReportReason(payload.get("reason"));
            chat.setReportDetails(payload.get("details"));
            chat.setReportedAt(LocalDateTime.now());
            chatRepository.save(chat);

            Set<User> targets = new HashSet<>();
            targets.addAll(userRepository.findByRole("ADMIN"));
            
            if (chat.getBarber() != null && chat.getBarber().getBranch() != null) {
                targets.addAll(userRepository.findByRoleAndBranch("EDITOR", chat.getBarber().getBranch()));
            }

            if (chat.getBarber() != null) {
                userRepository.findByEmployeeId(chat.getBarber().getId()).ifPresent(targets::add);
            }

            for (User target : targets) {
                Notification notif = new Notification();
                notif.setUser(target);
                notif.setType("system");
                notif.setTitle("Khách hàng báo cáo vi phạm");
                notif.setMessage("Khách hàng " + chat.getCustomerName() + " vừa báo cáo tin nhắn của thợ " + (chat.getBarber() != null ? chat.getBarber().getName() : ""));
                notif.setDataJson("{\"chatId\": " + chat.getId() + "}");
                notificationRepository.save(notif);
            }

            return ResponseEntity.ok(chat);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    // Lấy chi tiết 1 chat (cho phần notification modal bên frontend)
    @GetMapping("/{id}")
    public ResponseEntity<?> getChat(@PathVariable Integer id) {
        return chatRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
