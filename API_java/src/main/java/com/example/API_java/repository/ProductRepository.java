package com.example.API_java.repository;

import com.example.API_java.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByOrderBySortOrderAsc();

    @Query("SELECT p FROM Product p WHERE p.category = :category AND (:branch IS NULL OR :branch = 'Tất cả' OR (:branch = 'Online' AND p.branch IS NULL) OR p.branch = :branch) ORDER BY p.sortOrder ASC, p.id ASC")
    List<Product> findByCategoryAndBranch(@Param("category") String category, @Param("branch") String branch);
    
    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.stock = 100")
    void updateAllStockTo100();
    
    @Query("SELECT p FROM Product p WHERE " +
           "(:keyword IS NULL OR LOWER(p.name) LIKE :keyword) AND " +
           "(:categoryId IS NULL OR p.categoryId = :categoryId) AND " +
           "(:branch IS NULL OR :branch = 'Tất cả' OR (:branch = 'Online' AND p.branch IS NULL) OR p.branch = :branch) " +
           "ORDER BY p.sortOrder ASC, p.id ASC")
    List<Product> searchProducts(@Param("keyword") String keyword, @Param("categoryId") Long categoryId, @Param("branch") String branch);
}
