package com.example.API_java.scheduler;

import com.example.API_java.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class VoucherScheduler {

    @Autowired
    private VoucherService voucherService;

    // Run at 00:00 (midnight) every day
    @Scheduled(cron = "0 0 0 * * ?")
    public void evaluateBirthdayVouchersDaily() {
        System.out.println("[Scheduler] Starting daily birthday voucher campaign evaluation...");
        try {
            voucherService.evaluateBirthdayVouchers();
            System.out.println("[Scheduler] Daily birthday voucher campaign evaluation completed successfully.");
        } catch (Exception e) {
            System.err.println("[Scheduler] Error running daily birthday voucher campaign evaluation: " + e.getMessage());
        }
    }

    // Run every minute to check and pause expired vouchers
    @Scheduled(cron = "0 * * * * ?")
    public void checkExpiredVouchers() {
        try {
            voucherService.pauseExpiredVouchers();
        } catch (Exception e) {
            System.err.println("[Scheduler] Error running minute-based expired vouchers evaluation: " + e.getMessage());
        }
    }
}
