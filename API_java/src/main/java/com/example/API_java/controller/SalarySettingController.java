package com.example.API_java.controller;
import com.example.API_java.entity.SalarySetting;
import com.example.API_java.repository.SalarySettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/salary-settings")
@PreAuthorize("hasRole('ADMIN')")
public class SalarySettingController {
    @Autowired
    private SalarySettingRepository repo;

    @GetMapping
    public ResponseEntity<SalarySetting> getSetting() {
        return ResponseEntity.ok(repo.findAll().stream().findFirst().orElse(new SalarySetting()));
    }

    @PutMapping
    public ResponseEntity<SalarySetting> updateSetting(@RequestBody SalarySetting setting) {
        SalarySetting existing = repo.findAll().stream().findFirst().orElse(new SalarySetting());
        existing.setCommissionRate(setting.getCommissionRate());
        existing.setPermittedLeaveDeductionRate(setting.getPermittedLeaveDeductionRate());
        existing.setUnpermittedLeaveDeductionRate(setting.getUnpermittedLeaveDeductionRate());
        existing.setUnpermittedLeavePenalty(setting.getUnpermittedLeavePenalty());
        existing.setLatePenalty(setting.getLatePenalty());
        return ResponseEntity.ok(repo.save(existing));
    }
}
