package com.example.API_java.service;

import com.example.API_java.dto.*;

/**
 * Interface định nghĩa các chức năng xác thực
 */
public interface AuthService {

    // Đăng ký tài khoản mới
    String register(RegisterRequest request);

    // Đăng nhập và trả về JWT token
    AuthResponse login(LoginRequest request);

    // Quên mật khẩu - gửi OTP qua email
    String forgotPassword(ForgotPasswordRequest request);

    // Xác nhận mã OTP
    String verifyOtp(VerifyOtpRequest request);

    // Đặt lại mật khẩu (sau khi xác nhận OTP)
    String resetPassword(ResetPasswordRequest request);

    // Đổi mật khẩu (khi đã đăng nhập)
    String changePassword(String username, ChangePasswordRequest request);

    // Gửi OTP đăng ký
    void sendRegisterOtp(String email);

    // Gửi OTP đổi mật khẩu
    void sendChangePasswordOtp(String username, ChangePasswordRequest request);
}
