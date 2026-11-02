package com.example.API_java.repository;

import com.example.API_java.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Integer> {
    ServiceCategory findByCode(String code);
}
