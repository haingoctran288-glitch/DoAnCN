package com.example.API_java.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO trả về cho Frontend sau khi đăng nhập thành công
 */
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String message;
    private Integer id;
    private String fullName;
    private String role;
    private String branch;
    private Integer employeeId;
}
