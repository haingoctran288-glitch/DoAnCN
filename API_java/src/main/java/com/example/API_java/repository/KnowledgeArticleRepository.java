package com.example.API_java.repository;

import com.example.API_java.entity.KnowledgeArticle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KnowledgeArticleRepository extends JpaRepository<KnowledgeArticle, Long> {
    Optional<KnowledgeArticle> findBySlug(String slug);

    @Query("SELECT k FROM KnowledgeArticle k WHERE " +
           "(:keyword IS NULL OR LOWER(k.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:category IS NULL OR k.category = :category) AND " +
           "(:status IS NULL OR k.status = :status)")
    Page<KnowledgeArticle> searchAdmin(@Param("keyword") String keyword, 
                                       @Param("category") String category, 
                                       @Param("status") String status, 
                                       Pageable pageable);

    @Query("SELECT k FROM KnowledgeArticle k WHERE " +
           "k.status = 'Hiển thị' AND " +
           "(:keyword IS NULL OR LOWER(k.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:category IS NULL OR k.category = :category)")
    Page<KnowledgeArticle> searchPublic(@Param("keyword") String keyword, 
                                        @Param("category") String category, 
                                        Pageable pageable);

    List<KnowledgeArticle> findTop3ByStatusOrderByViewCountDesc(String status);
    
    List<KnowledgeArticle> findTop5ByStatusOrderByCreatedAtDesc(String status);
    
    List<KnowledgeArticle> findTop4ByCategoryAndStatusAndIdNotOrderByCreatedAtDesc(String category, String status, Long id);
}
