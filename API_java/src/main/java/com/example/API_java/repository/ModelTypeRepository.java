package com.example.API_java.repository;

import com.example.API_java.entity.ModelType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModelTypeRepository extends JpaRepository<ModelType, Integer> {
    List<ModelType> findByCategoryId(Integer categoryId);
    ModelType findByNameAndCategoryId(String name, Integer categoryId);
}
