package com.example.API_java.repository;

import com.example.API_java.entity.AdvanceSalary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdvanceSalaryRepository extends JpaRepository<AdvanceSalary, Integer> {
    @Query("SELECT a FROM AdvanceSalary a WHERE a.staff.id = :staffId AND YEAR(a.advanceDate) = :year AND MONTH(a.advanceDate) = :month ORDER BY a.advanceDate DESC")
    List<AdvanceSalary> findByStaffAndMonth(@Param("staffId") Integer staffId, @Param("year") int year, @Param("month") int month);

    List<AdvanceSalary> findAllByOrderByAdvanceDateDesc();
}
