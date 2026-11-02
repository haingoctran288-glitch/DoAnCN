package com.example.API_java.repository;

import com.example.API_java.entity.CustomerVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerVoucherRepository extends JpaRepository<CustomerVoucher, Integer> {
    List<CustomerVoucher> findByUserIdOrderByClaimedAtDesc(Integer userId);
    List<CustomerVoucher> findByUserIdAndStatusOrderByClaimedAtDesc(Integer userId, String status);
    Optional<CustomerVoucher> findByIdAndUserId(Integer id, Integer userId);
    
    // Check if user has already claimed from a specific campaign/voucher to avoid duplicate issuing
    boolean existsByUserIdAndVoucherId(Integer userId, Integer voucherId);
    
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(cv) > 0 FROM CustomerVoucher cv WHERE cv.user.id = :userId AND cv.voucher.id = :voucherId AND YEAR(cv.claimedAt) = :year")
    boolean existsByUserIdAndVoucherIdAndYear(@org.springframework.data.repository.query.Param("userId") Integer userId, @org.springframework.data.repository.query.Param("voucherId") Integer voucherId, @org.springframework.data.repository.query.Param("year") int year);
    
    void deleteByVoucherId(Integer voucherId);
}
