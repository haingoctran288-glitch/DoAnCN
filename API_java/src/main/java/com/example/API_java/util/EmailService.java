package com.example.API_java.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service gửi email (OTP, thông báo...)
 */
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Gửi email chứa mã OTP
     * @param toEmail - email người nhận
     * @param otpCode - mã OTP 6 số
     * @param isRegister - nếu true thì là email đăng ký, false là quên mật khẩu
     */
    public void sendOtpEmail(String toEmail, String otpCode, boolean isRegister) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        
        if (isRegister) {
            message.setSubject("HORNET ROYALE - Mã xác nhận tài khoản của bạn");
            message.setText(
                "Xin chào,\n\n" +
                "Bạn vừa yêu cầu đăng ký tài khoản tại HORNET ROYALE.\n\n" +
                "Mã xác nhận của bạn là: " + otpCode + "\n\n" +
                "Mã này có hiệu lực trong 2 phút.\n" +
                "Nếu bạn không yêu cầu, vui lòng bỏ qua email này.\n\n" +
                "Trân trọng,\nHORNET ROYALE Team"
            );
        } else {
            message.setSubject("HORNET ROYALE - Mã xác nhận đặt lại mật khẩu");
            message.setText(
                "Xin chào,\n\n" +
                "Bạn vừa yêu cầu đặt lại mật khẩu tại HORNET ROYALE.\n\n" +
                "Mã xác nhận của bạn là: " + otpCode + "\n\n" +
                "Mã này có hiệu lực trong 2 phút.\n" +
                "Nếu bạn không yêu cầu, vui lòng bỏ qua email này.\n\n" +
                "Trân trọng,\nHORNET ROYALE Team"
            );
        }

        mailSender.send(message);
    }
}
