package com.example.API_java.repository;

import com.example.API_java.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository truy vấn bảng otp_codes
 */
@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {

    // Tìm OTP mới nhất theo email, chưa sử dụng, sắp xếp theo thời gian tạo giảm dần
    Optional<Otp> findTopByEmailAndIsUsedFalseOrderByCreatedAtDesc(String email);

    // Đếm số lượng OTP đã gửi cho một email từ thời điểm chỉ định
    long countByEmailAndCreatedAtAfter(String email, java.time.LocalDateTime dateTime);
}
