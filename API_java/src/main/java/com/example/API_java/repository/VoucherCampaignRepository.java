package com.example.API_java.repository;

import com.example.API_java.entity.VoucherCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VoucherCampaignRepository extends JpaRepository<VoucherCampaign, Integer> {
    List<VoucherCampaign> findByStatus(String status);
    List<VoucherCampaign> findByTriggerTypeAndStatus(String triggerType, String status);
    List<VoucherCampaign> findAllByOrderByCreatedAtDesc();
    void deleteByVoucherId(Integer voucherId);
}
