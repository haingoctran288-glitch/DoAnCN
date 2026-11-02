package com.example.API_java.repository;

import com.example.API_java.entity.Penalty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PenaltyRepository extends JpaRepository<Penalty, Integer> {
    @Query("SELECT p FROM Penalty p WHERE p.staff.id = :staffId AND YEAR(p.penaltyDate) = :year AND MONTH(p.penaltyDate) = :month ORDER BY p.penaltyDate DESC")
    List<Penalty> findByStaffAndMonth(@Param("staffId") Integer staffId, @Param("year") int year, @Param("month") int month);

    List<Penalty> findAllByOrderByPenaltyDateDesc();
}
