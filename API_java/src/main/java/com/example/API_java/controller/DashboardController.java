package com.example.API_java.controller;

import com.example.API_java.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardData(
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) String timeRange,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        return ResponseEntity.ok(dashboardService.getDashboardData(branch, timeRange, startDate, endDate));
    }
}
