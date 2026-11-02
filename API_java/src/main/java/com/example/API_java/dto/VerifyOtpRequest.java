package com.example.API_java.dto;

import lombok.Data;

/**
 * DTO xác nhận mã OTP
 */
@Data
public class VerifyOtpRequest {
    private String email;
    private String otp;
}
