package com.example.API_java.controller;
import com.example.API_java.dto.PayrollResponse;
import com.example.API_java.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {
    @Autowired
    private PayrollService payrollService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/generate")
    public ResponseEntity<List<PayrollResponse>> generatePayroll(@RequestParam int year, @RequestParam int month) {
        return ResponseEntity.ok(payrollService.generatePayroll(year, month));
    }
}
