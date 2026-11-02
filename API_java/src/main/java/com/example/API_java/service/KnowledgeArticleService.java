package com.example.API_java.service;

import com.example.API_java.entity.KnowledgeArticle;
import com.example.API_java.repository.KnowledgeArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class KnowledgeArticleService {
    @Autowired
    private KnowledgeArticleRepository repository;

    // Bộ đệm chống spam view count: Key = IP + "_" + ArticleId, Value = timestamp
    private final Map<String, Long> viewCache = new ConcurrentHashMap<>();
    private static final long VIEW_COOLDOWN_MS = 60 * 60 * 1000; // 1 giờ

    public Page<KnowledgeArticle> searchAdmin(String keyword, String category, String status, String sort, int page, int size) {
        if ("Tất cả".equals(category)) category = null;
        if ("Tất cả".equals(status)) status = null;

        Sort.Direction direction = "Mới nhất".equals(sort) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "createdAt"));
        
        return repository.searchAdmin(keyword, category, status, pageable);
    }

    public Page<KnowledgeArticle> searchPublic(String keyword, String category, String sort, int page, int size) {
        if ("Tất cả".equals(category)) category = null;

        Sort.Direction direction = "Mới nhất".equals(sort) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "createdAt"));
        
        return repository.searchPublic(keyword, category, pageable);
    }

    public KnowledgeArticle getArticleBySlug(String slug) {
        return repository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết!"));
    }
    
    public KnowledgeArticle getArticleById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết!"));
    }

    public KnowledgeArticle createArticle(KnowledgeArticle article, String username) {
        article.setCreatedBy(username);
        // Ensure slug is unique, simple check
        if(repository.findBySlug(article.getSlug()).isPresent()) {
            article.setSlug(article.getSlug() + "-" + System.currentTimeMillis());
        }
        return repository.save(article);
    }

    public KnowledgeArticle updateArticle(Long id, KnowledgeArticle updatedArticle) {
        KnowledgeArticle existing = getArticleById(id);
        existing.setTitle(updatedArticle.getTitle());
        
        // Only update slug if it changed and is unique
        if (!existing.getSlug().equals(updatedArticle.getSlug())) {
            if(repository.findBySlug(updatedArticle.getSlug()).isPresent()) {
                existing.setSlug(updatedArticle.getSlug() + "-" + System.currentTimeMillis());
            } else {
                existing.setSlug(updatedArticle.getSlug());
            }
        }
        
        existing.setThumbnailImage(updatedArticle.getThumbnailImage());
        existing.setShortDescription(updatedArticle.getShortDescription());
        existing.setContent(updatedArticle.getContent());
        existing.setCategory(updatedArticle.getCategory());
        existing.setStatus(updatedArticle.getStatus());
        
        return repository.save(existing);
    }

    public void deleteArticle(Long id) {
        repository.deleteById(id);
    }

    public void updateStatus(Long id, String status) {
        KnowledgeArticle article = getArticleById(id);
        article.setStatus(status);
        repository.save(article);
    }

    @Transactional
    public void incrementViewCount(String slug, String clientIp) {
        KnowledgeArticle article = getArticleBySlug(slug);
        
        // Anti-spam mechanism
        String cacheKey = clientIp + "_" + article.getId();
        Long lastViewed = viewCache.get(cacheKey);
        long now = System.currentTimeMillis();
        
        if (lastViewed == null || (now - lastViewed) > VIEW_COOLDOWN_MS) {
            article.setViewCount(article.getViewCount() + 1);
            repository.save(article);
            viewCache.put(cacheKey, now);
            
            // Clean up old cache entries periodically to prevent memory leak
            if (viewCache.size() > 10000) {
                viewCache.entrySet().removeIf(entry -> (now - entry.getValue()) > VIEW_COOLDOWN_MS);
            }
        }
    }

    public List<KnowledgeArticle> getTopViewed() {
        return repository.findTop3ByStatusOrderByViewCountDesc("Hiển thị");
    }

    public List<KnowledgeArticle> getLatest() {
        return repository.findTop5ByStatusOrderByCreatedAtDesc("Hiển thị");
    }

    public List<KnowledgeArticle> getRelatedArticles(String slug) {
        KnowledgeArticle article = getArticleBySlug(slug);
        return repository.findTop4ByCategoryAndStatusAndIdNotOrderByCreatedAtDesc(
                article.getCategory(), "Hiển thị", article.getId());
    }
}
