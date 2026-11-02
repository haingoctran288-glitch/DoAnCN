package com.example.API_java.dto;

import lombok.Data;

/**
 * DTO đặt lại mật khẩu (sau khi xác nhận OTP)
 */
@Data
public class ResetPasswordRequest {
    private String email;
    private String newPassword;
}
