package com.example.API_java.repository;

import com.example.API_java.entity.SalarySetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalarySettingRepository extends JpaRepository<SalarySetting, Integer> {}
