package com.example.API_java.controller;

import com.example.API_java.entity.User;
import com.example.API_java.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller trả về thông tin người dùng đang đăng nhập
 * Yêu cầu JWT token hợp lệ trong header Authorization
 */
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    /**
     * GET /api/user/profile
     * Trả về thông tin cá nhân của user đang đăng nhập
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));

        // Trả về thông tin user (KHÔNG trả password)
        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId());
        data.put("username", user.getUsername());
        data.put("fullName", user.getFullName());
        data.put("email", user.getEmail() != null ? user.getEmail() : "");
        data.put("phone", user.getPhone() != null ? user.getPhone() : "");
        data.put("role", user.getRole());
        data.put("avatar", user.getAvatar() != null ? user.getAvatar() : "");
        data.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : "");
        data.put("birthday", user.getBirthday() != null ? user.getBirthday().toString() : "");
        data.put("isCashPaymentLocked", user.getIsCashPaymentLocked() != null ? user.getIsCashPaymentLocked() : false);

        return ResponseEntity.ok(data);
    }
}
