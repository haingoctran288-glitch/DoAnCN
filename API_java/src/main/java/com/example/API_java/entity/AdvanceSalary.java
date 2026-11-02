package com.example.API_java.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "advance_salaries")
@Data
public class AdvanceSalary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;

    private LocalDate advanceDate;
    private Double amount;
    private String notes;
    private LocalDateTime createdAt = LocalDateTime.now();
}
