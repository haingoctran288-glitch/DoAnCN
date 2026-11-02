package com.example.API_java.repository;

import com.example.API_java.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Integer> {
    List<Service> findByStatusOrderBySortOrderAsc(String status);
    List<Service> findByCategoryTypeOrderBySortOrderAsc(String type);
    List<Service> findByCategoryTypeAndStatusOrderBySortOrderAsc(String type, String status);
    List<Service> findByServiceGroupOrderBySortOrderAsc(String serviceGroup);
    List<Service> findAllByOrderBySortOrderAsc();
    
    // New queries for groups
    List<Service> findByMainCategoryOrderBySortOrderAsc(String mainCategory);
    List<Service> findByMainCategoryAndSubCategoryOrderBySortOrderAsc(String mainCategory, String subCategory);
}
