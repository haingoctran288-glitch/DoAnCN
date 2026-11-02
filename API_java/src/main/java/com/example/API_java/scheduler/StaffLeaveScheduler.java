package com.example.API_java.scheduler;

import com.example.API_java.service.StaffLeaveService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Cron job tự động kết thúc các kỳ nghỉ đã hết hạn.
 * Chạy lúc 00:00:01 mỗi ngày (backup — API cũng tự kiểm tra).
 */
@Component
public class StaffLeaveScheduler {

    private static final Logger log = LoggerFactory.getLogger(StaffLeaveScheduler.class);

    @Autowired
    private StaffLeaveService staffLeaveService;

    /**
     * Chạy lúc 00:00:01 mỗi ngày.
     * Tự động chuyển trạng thái nhân viên về WORKING sau khi kỳ nghỉ kết thúc.
     */
    @Scheduled(cron = "1 0 0 * * *")
    public void autoFinishExpiredLeaves() {
        log.info("[CRON] Bắt đầu kiểm tra kỳ nghỉ hết hạn...");
        try {
            staffLeaveService.autoFinishExpiredLeaves();
            log.info("[CRON] Hoàn thành kiểm tra kỳ nghỉ hết hạn.");
        } catch (Exception e) {
            log.error("[CRON] Lỗi khi kiểm tra kỳ nghỉ hết hạn: {}", e.getMessage(), e);
        }
    }
}
