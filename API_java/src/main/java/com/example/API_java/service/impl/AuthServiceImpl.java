package com.example.API_java.service.impl;

import com.example.API_java.dto.*;
import com.example.API_java.entity.Otp;
import com.example.API_java.entity.User;
import com.example.API_java.repository.OtpRepository;
import com.example.API_java.repository.UserRepository;
import com.example.API_java.service.AuthService;
import com.example.API_java.util.EmailService;
import com.example.API_java.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Triển khai logic xác thực: đăng ký, đăng nhập, OTP, đổi mật khẩu
 */
@Service
public class AuthServiceImpl implements AuthService {

    private static class OtpLockInfo {
        int attempts = 0;
        LocalDateTime lockedUntil = null;
    }
    private final Map<String, OtpLockInfo> otpLocks = new ConcurrentHashMap<>();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmailService emailService;

    @Autowired
    private com.example.API_java.service.VoucherService voucherService;

    /**
     * Đăng ký tài khoản mới (với email thay vì phone)
     */
    @Override
    public String register(RegisterRequest request) {
        // Kiểm tra trùng username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }

        // Kiểm tra trùng email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        // Xác thực OTP đăng ký
        if (request.getOtp() == null || request.getOtp().trim().isEmpty()) {
            throw new RuntimeException("Mã OTP không được để trống!");
        }
        VerifyOtpRequest verifyReq = new VerifyOtpRequest();
        verifyReq.setEmail(request.getEmail());
        verifyReq.setOtp(request.getOtp());
        verifyOtp(verifyReq);

        // Tạo entity User mới
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setBirthday(request.getBirthday());
        user.setRole("USER");

        User savedUser = userRepository.save(user);

        // Trigger voucher campaigns for new register
        try {
            voucherService.evaluateCampaigns(savedUser.getId(), "NEW_REGISTER", null);
            
            // If they register on their birthday, also issue birthday vouchers immediately
            java.time.LocalDate today = java.time.LocalDate.now();
            if (savedUser.getBirthday() != null && 
                savedUser.getBirthday().getMonth() == today.getMonth() && 
                savedUser.getBirthday().getDayOfMonth() == today.getDayOfMonth()) {
                voucherService.evaluateCampaigns(savedUser.getId(), "BIRTHDAY", null);
            }
        } catch (Exception e) {
            System.err.println("Error evaluating registration campaigns: " + e.getMessage());
        }

        return "Đăng ký thành công!";
    }

    /**
     * Đăng nhập
     */
    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));

        if (Boolean.TRUE.equals(user.getIsBlocked())) {
            throw new RuntimeException("BLOCKED:" + (user.getBlockedReason() != null ? user.getBlockedReason() : "Không có lý do cụ thể"));
        }

        String token = jwtUtil.generateToken(user.getUsername());

        return new AuthResponse(token, "Đăng nhập thành công!", user.getId(), user.getFullName(), user.getRole(), user.getBranch(), user.getEmployeeId());
    }

    /**
     * Quên mật khẩu - Tạo OTP 6 số và gửi qua email
     */
    @Override
    public String forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail();
        // Kiểm tra email có tồn tại không
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống!"));

        // Chống spam (max 5 OTP trong vòng 30 phút)
        long sendCount = otpRepository.countByEmailAndCreatedAtAfter(email, LocalDateTime.now().minusMinutes(30));
        if (sendCount >= 5) {
            throw new RuntimeException("Bạn đã yêu cầu OTP quá nhiều lần. Vui lòng thử lại sau.");
        }

        // Vô hiệu hóa OTP cũ
        otpRepository.findTopByEmailAndIsUsedFalseOrderByCreatedAtDesc(email).ifPresent(oldOtp -> {
            oldOtp.setUsed(true);
            otpRepository.save(oldOtp);
        });

        // Tạo mã OTP 6 số ngẫu nhiên
        String otpCode = String.format("%06d", new Random().nextInt(999999));

        // Lưu OTP vào database
        Otp otp = new Otp();
        otp.setEmail(email);
        otp.setCode(otpCode);
        otp.setExpiredAt(LocalDateTime.now().plusSeconds(120)); // Hết hạn sau 2 phút
        otp.setUsed(false);
        otpRepository.save(otp);

        // Gửi OTP qua email (false = quên mật khẩu)
        emailService.sendOtpEmail(email, otpCode, false);

        return "Mã OTP đã được gửi tới email của bạn!";
    }

    /**
     * Xác nhận mã OTP
     */
    @Override
    public String verifyOtp(VerifyOtpRequest request) {
        String email = request.getEmail();

        // Chống đoán OTP (xác thực liên tiếp sai 5 lần sẽ khóa 10 phút)
        OtpLockInfo lockInfo = otpLocks.get(email);
        if (lockInfo != null && lockInfo.lockedUntil != null) {
            if (LocalDateTime.now().isBefore(lockInfo.lockedUntil)) {
                throw new RuntimeException("Bạn đã nhập sai OTP quá nhiều lần. Vui lòng thử lại sau 10 phút.");
            } else {
                // Lock expired, reset
                lockInfo.attempts = 0;
                lockInfo.lockedUntil = null;
            }
        }

        // Tìm OTP mới nhất chưa sử dụng
        Otp otp = otpRepository.findTopByEmailAndIsUsedFalseOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã OTP! Vui lòng yêu cầu lại."));

        // Kiểm tra hết hạn
        if (otp.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.");
        }

        // Kiểm tra mã OTP có khớp không
        if (!otp.getCode().equals(request.getOtp())) {
            if (lockInfo == null) {
                lockInfo = new OtpLockInfo();
                otpLocks.put(email, lockInfo);
            }
            lockInfo.attempts++;
            if (lockInfo.attempts >= 5) {
                lockInfo.lockedUntil = LocalDateTime.now().plusMinutes(10);
                throw new RuntimeException("Bạn đã nhập sai OTP quá nhiều lần. Vui lòng thử lại sau 10 phút.");
            }
            throw new RuntimeException("Mã OTP không đúng!");
        }

        // Thành công: xóa lịch sử nhập sai và đánh dấu OTP đã dùng
        otpLocks.remove(email);
        otp.setUsed(true);
        otpRepository.save(otp);

        return "Xác nhận OTP thành công!";
    }

    /**
     * Đặt lại mật khẩu (sau khi xác nhận OTP)
     */
    @Override
    public String resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại!"));

        // Cập nhật mật khẩu mới (mã hoá BCrypt)
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Đặt lại mật khẩu thành công!";
    }

    /**
     * Đổi mật khẩu (khi đã đăng nhập, cần token)
     */
    @Override
    public String changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));

        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Tài khoản của bạn chưa được liên kết email!");
        }

        if (request.getOtp() == null || request.getOtp().trim().isEmpty()) {
            throw new RuntimeException("Mã OTP không được để trống!");
        }

        // Xác nhận OTP
        VerifyOtpRequest verifyReq = new VerifyOtpRequest();
        verifyReq.setEmail(user.getEmail());
        verifyReq.setOtp(request.getOtp());
        verifyOtp(verifyReq);

        // Kiểm tra mật khẩu cũ có đúng không
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không đúng!");
        }

        // Kiểm tra mật khẩu mới phải khác mật khẩu cũ
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu mới phải khác mật khẩu cũ!");
        }

        // Cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Đổi mật khẩu thành công!";
    }

    @Override
    public void sendRegisterOtp(String email) {
        // Kiểm tra email đã được đăng ký chưa
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email này đã được sử dụng bởi tài khoản khác!");
        }

        // Chống spam (max 5 OTP trong vòng 30 phút)
        long sendCount = otpRepository.countByEmailAndCreatedAtAfter(email, LocalDateTime.now().minusMinutes(30));
        if (sendCount >= 5) {
            throw new RuntimeException("Bạn đã yêu cầu OTP quá nhiều lần. Vui lòng thử lại sau.");
        }

        // Vô hiệu hóa OTP cũ
        otpRepository.findTopByEmailAndIsUsedFalseOrderByCreatedAtDesc(email).ifPresent(oldOtp -> {
            oldOtp.setUsed(true);
            otpRepository.save(oldOtp);
        });

        // Tạo mã OTP 6 số ngẫu nhiên
        String otpCode = String.format("%06d", new Random().nextInt(999999));

        // Lưu OTP vào database
        Otp otp = new Otp();
        otp.setEmail(email);
        otp.setCode(otpCode);
        otp.setExpiredAt(LocalDateTime.now().plusSeconds(120)); // Hết hạn sau 2 phút
        otp.setUsed(false);
        otpRepository.save(otp);

        // Gửi OTP qua email (true = đăng ký)
        emailService.sendOtpEmail(email, otpCode, true);
    }

    @Override
    public void sendChangePasswordOtp(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));

        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Tài khoản của bạn chưa được liên kết email!");
        }

        // Kiểm tra mật khẩu cũ có đúng không
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không đúng!");
        }

        // Kiểm tra mật khẩu mới phải khác mật khẩu cũ
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu mới phải khác mật khẩu cũ!");
        }

        String email = user.getEmail();

        // Chống spam (max 5 OTP trong vòng 30 phút)
        long sendCount = otpRepository.countByEmailAndCreatedAtAfter(email, LocalDateTime.now().minusMinutes(30));
        if (sendCount >= 5) {
            throw new RuntimeException("Bạn đã yêu cầu OTP quá nhiều lần. Vui lòng thử lại sau.");
        }

        // Vô hiệu hóa OTP cũ
        otpRepository.findTopByEmailAndIsUsedFalseOrderByCreatedAtDesc(email).ifPresent(oldOtp -> {
            oldOtp.setUsed(true);
            otpRepository.save(oldOtp);
        });

        // Tạo mã OTP 6 số ngẫu nhiên
        String otpCode = String.format("%06d", new Random().nextInt(999999));

        // Lưu OTP vào database
        Otp otp = new Otp();
        otp.setEmail(email);
        otp.setCode(otpCode);
        otp.setExpiredAt(LocalDateTime.now().plusSeconds(120)); // Hết hạn sau 2 phút
        otp.setUsed(false);
        otpRepository.save(otp);

        // Gửi OTP qua email
        emailService.sendOtpEmail(email, otpCode, false);
    }
}
