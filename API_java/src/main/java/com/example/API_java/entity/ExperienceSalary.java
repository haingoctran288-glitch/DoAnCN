package com.example.API_java.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "experience_salaries")
@Data
public class ExperienceSalary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer yearsOfExperience;
    private Double baseSalary;
}
