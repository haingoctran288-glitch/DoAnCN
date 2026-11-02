package com.example.API_java.dto;

import lombok.Data;

/**
 * DTO đổi mật khẩu (khi đã đăng nhập)
 */
@Data
public class ChangePasswordRequest {
    private String oldPassword;
    private String newPassword;
    private String otp;
}
