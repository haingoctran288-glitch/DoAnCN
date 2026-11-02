package com.example.API_java.dto;

import lombok.Data;

/**
 * DTO nhận dữ liệu đăng ký từ Frontend
 * Đã thay phone → email
 */
@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String fullName;
    private String email;
    private java.time.LocalDate birthday;
    private String otp;
}
