package com.example.API_java.controller;

import com.example.API_java.dto.*;
import com.example.API_java.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller xử lý API xác thực
 * Base URL: /api/auth
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/register
     * Đăng ký tài khoản mới (với email)
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            String message = authService.register(request);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/register/send-otp
     * Gửi mã OTP đăng ký qua email
     */
    @PostMapping("/register/send-otp")
    public ResponseEntity<?> sendRegisterOtp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email không được để trống!"));
            }
            authService.sendRegisterOtp(email);
            return ResponseEntity.ok(Map.of("message", "Mã OTP đã được gửi tới email của bạn!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/login
     * Đăng nhập và nhận JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().startsWith("BLOCKED:")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of(
                                "message", "Tài khoản của bạn đã bị khóa.",
                                "reason", e.getMessage().substring(8)
                        ));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Sai tên đăng nhập hoặc mật khẩu!"));
        }
    }

    /**
     * POST /api/auth/forgot-password
     * Gửi mã OTP qua email
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            String message = authService.forgotPassword(request);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/verify-otp
     * Xác nhận mã OTP
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        try {
            String message = authService.verifyOtp(request);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/reset-password
     * Đặt lại mật khẩu mới (sau khi xác nhận OTP)
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            String message = authService.resetPassword(request);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/change-password
     * Đổi mật khẩu (yêu cầu đăng nhập - Bearer token)
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request,
                                             Authentication authentication) {
        try {
            String username = authentication.getName();
            String message = authService.changePassword(username, request);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/change-password/send-otp
     * Gửi OTP đổi mật khẩu
     */
    @PostMapping("/change-password/send-otp")
    public ResponseEntity<?> sendChangePasswordOtp(@RequestBody ChangePasswordRequest request,
                                                    Authentication authentication) {
        try {
            String username = authentication.getName();
            authService.sendChangePasswordOtp(username, request);
            return ResponseEntity.ok(Map.of("message", "Mã OTP xác nhận đã được gửi đến email của bạn!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
