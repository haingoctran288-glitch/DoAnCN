package com.example.API_java.dto;

import lombok.Data;

/**
 * DTO nhận dữ liệu đăng nhập từ Frontend
 */
@Data
public class LoginRequest {
    private String username;
    private String password;
}
