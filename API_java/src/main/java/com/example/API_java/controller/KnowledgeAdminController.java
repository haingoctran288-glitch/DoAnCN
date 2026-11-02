package com.example.API_java.controller;

import com.example.API_java.entity.KnowledgeArticle;
import com.example.API_java.service.KnowledgeArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/knowledge")
@CrossOrigin(origins = "*")
public class KnowledgeAdminController {

    @Autowired
    private KnowledgeArticleService service;

    @GetMapping
    public ResponseEntity<Page<KnowledgeArticle>> getArticles(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "Tất cả") String category,
            @RequestParam(defaultValue = "Tất cả") String status,
            @RequestParam(defaultValue = "Mới nhất") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        return ResponseEntity.ok(service.searchAdmin(keyword, category, status, sort, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<KnowledgeArticle> getArticle(@PathVariable Long id) {
        return ResponseEntity.ok(service.getArticleById(id));
    }

    @PostMapping
    public ResponseEntity<?> createArticle(@RequestBody KnowledgeArticle article, Authentication auth) {
        try {
            KnowledgeArticle saved = service.createArticle(article, auth.getName());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateArticle(@PathVariable Long id, @RequestBody KnowledgeArticle article) {
        try {
            KnowledgeArticle updated = service.updateArticle(id, article);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id) {
        try {
            service.deleteArticle(id);
            return ResponseEntity.ok(Map.of("message", "Đã xóa thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            service.updateStatus(id, body.get("status"));
            return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
