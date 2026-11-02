package com.example.API_java.dto;

import lombok.Data;

/**
 * DTO cho chức năng quên mật khẩu (gửi OTP)
 */
@Data
public class ForgotPasswordRequest {
    private String email;
}
