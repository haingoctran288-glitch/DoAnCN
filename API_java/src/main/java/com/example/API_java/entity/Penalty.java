package com.example.API_java.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "penalties")
@Data
public class Penalty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;

    private String penaltyType;
    private LocalDate penaltyDate;
    private Double amount;
    private String notes;
    private LocalDateTime createdAt = LocalDateTime.now();
}
