package com.example.API_java.repository;

import com.example.API_java.entity.ExperienceSalary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExperienceSalaryRepository extends JpaRepository<ExperienceSalary, Integer> {
    Optional<ExperienceSalary> findByYearsOfExperience(Integer years);
}
