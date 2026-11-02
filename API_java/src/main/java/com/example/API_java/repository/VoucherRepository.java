package com.example.API_java.repository;

import com.example.API_java.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
    Optional<Voucher> findByCode(String code);
    List<Voucher> findAllByOrderByCreatedAtDesc();
    List<Voucher> findByIssueTypeAndStatus(String issueType, String status);
    List<Voucher> findByStatusNotOrderByCreatedAtDesc(String status);
}
