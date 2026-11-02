package com.example.API_java.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "salary_settings")
@Data
public class SalarySetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Double commissionRate = 15.0; 
    private Double permittedLeaveDeductionRate = 70.0; 
    private Double unpermittedLeaveDeductionRate = 100.0; 
    private Double unpermittedLeavePenalty = 100000.0; 
    private Double latePenalty = 50000.0; 
}
