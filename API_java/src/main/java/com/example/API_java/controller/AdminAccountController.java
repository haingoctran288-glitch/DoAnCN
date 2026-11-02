package com.example.API_java.controller;

import com.example.API_java.entity.User;
import com.example.API_java.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.EntityManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/accounts")
public class AdminAccountController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    // Check role before processing
    private User checkAdminRole(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));
        if (!"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Bạn không có quyền truy cập!");
        }
        return user;
    }

    @GetMapping
    public ResponseEntity<?> getAllAccounts(Authentication authentication) {
        try {
            checkAdminRole(authentication);
            List<User> accounts = userRepository.findAll().stream()
                    .filter(u -> "ADMIN".equals(u.getRole()) || "EDITOR".equals(u.getRole()) || "EMPLOYEE".equals(u.getRole()))
                    .collect(Collectors.toList());
            
            // Map to safe DTO-like map
            List<Map<String, Object>> result = accounts.stream().map(u -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", u.getId());
                map.put("username", u.getUsername());
                map.put("fullName", u.getFullName());
                map.put("email", u.getEmail());
                map.put("phone", u.getPhone());
                map.put("role", u.getRole());
                map.put("branch", u.getBranch());
                map.put("employeeId", u.getEmployeeId());
                return map;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Lỗi hệ thống"));
        }
    }

    @PostMapping
    public ResponseEntity<?> createAccount(@RequestBody User user, Authentication authentication) {
        try {
            checkAdminRole(authentication);
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Tên đăng nhập đã tồn tại!"));
            }
            if (user.getEmail() != null && !user.getEmail().trim().isEmpty() && userRepository.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email đã được sử dụng bởi tài khoản khác!"));
            }
            
            User newUser = new User();
            newUser.setUsername(user.getUsername());
            newUser.setPassword(passwordEncoder.encode(user.getPassword()));
            newUser.setFullName(user.getFullName());
            newUser.setEmail(user.getEmail());
            newUser.setPhone(user.getPhone());
            String role = user.getRole();
            if ("EDITOR".equals(role)) {
                newUser.setRole("EDITOR");
                newUser.setBranch(user.getBranch());
                newUser.setEmployeeId(null);
            } else if ("EMPLOYEE".equals(role)) {
                newUser.setRole("EMPLOYEE");
                newUser.setBranch(user.getBranch());
                newUser.setEmployeeId(user.getEmployeeId());
            } else {
                newUser.setRole("ADMIN");
                newUser.setBranch(null);
                newUser.setEmployeeId(null);
            }
            
            userRepository.save(newUser);
            return ResponseEntity.ok(Map.of("message", "Thêm tài khoản thành công!"));
        } catch (Exception e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Lỗi hệ thống"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable Integer id, @RequestBody User request, Authentication authentication) {
        try {
            checkAdminRole(authentication);
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));
            
            // Tên đăng nhập không được trùng với người khác
            if (!user.getUsername().equals(request.getUsername()) && userRepository.findByUsername(request.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Tên đăng nhập đã tồn tại!"));
            }

            // Email không được trùng với người khác
            if (request.getEmail() != null && !request.getEmail().trim().isEmpty() 
                && !request.getEmail().equals(user.getEmail()) 
                && userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email đã được sử dụng bởi tài khoản khác!"));
            }

            user.setUsername(request.getUsername());
            user.setFullName(request.getFullName());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            String role = request.getRole();
            if ("EDITOR".equals(role)) {
                user.setRole("EDITOR");
                user.setBranch(request.getBranch());
                user.setEmployeeId(null);
            } else if ("EMPLOYEE".equals(role)) {
                user.setRole("EMPLOYEE");
                user.setBranch(request.getBranch());
                user.setEmployeeId(request.getEmployeeId());
            } else {
                user.setRole("ADMIN");
                user.setBranch(null);
                user.setEmployeeId(null);
            }

            if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }

            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Cập nhật thành công!"));
        } catch (Exception e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Lỗi hệ thống"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Integer id, Authentication authentication) {
        try {
            User currentAdmin = checkAdminRole(authentication);
            if (currentAdmin.getId().equals(id)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Không thể xóa chính mình!"));
            }
            
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));
            
            userRepository.delete(user);
            return ResponseEntity.ok(Map.of("message", "Đã xóa tài khoản!"));
        } catch (Exception e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Lỗi hệ thống"));
        }
    }

    @Transactional
    @PostMapping("/reset-system-data")
    public ResponseEntity<?> resetSystemData(Authentication authentication) {
        try {
            checkAdminRole(authentication);

            entityManager.createNativeQuery("SET FOREIGN_KEY_CHECKS = 0").executeUpdate();
            entityManager.createNativeQuery("TRUNCATE TABLE order_items").executeUpdate();
            entityManager.createNativeQuery("TRUNCATE TABLE orders").executeUpdate();
            entityManager.createNativeQuery("TRUNCATE TABLE booking_services").executeUpdate();
            entityManager.createNativeQuery("TRUNCATE TABLE bookings").executeUpdate();
            entityManager.createNativeQuery("TRUNCATE TABLE customer_vouchers").executeUpdate();
            entityManager.createNativeQuery("TRUNCATE TABLE notifications").executeUpdate();
            entityManager.createNativeQuery("TRUNCATE TABLE addresses").executeUpdate();
            entityManager.createNativeQuery("TRUNCATE TABLE otp_codes").executeUpdate();
            entityManager.createNativeQuery("DELETE FROM users WHERE role = 'USER'").executeUpdate();
            entityManager.createNativeQuery("SET FOREIGN_KEY_CHECKS = 1").executeUpdate();

            return ResponseEntity.ok(Map.of("message", "Reset dữ liệu hệ thống thành công!"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Reset dữ liệu thất bại: " + e.getMessage()));
        }
    }
}
