package com.example.API_java.repository;

import com.example.API_java.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    List<News> findAllByOrderByCreatedAtDesc();
    List<News> findByTypeOrderByCreatedAtDesc(String type);
    List<News> findByCategorySlugOrderByCreatedAtDesc(String categorySlug);
}
