package com.example.API_java.controller;

import com.example.API_java.entity.KnowledgeArticle;
import com.example.API_java.service.KnowledgeArticleService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public/knowledge")
@CrossOrigin(origins = "*")
public class PublicKnowledgeController {

    @Autowired
    private KnowledgeArticleService service;

    @GetMapping
    public ResponseEntity<Page<KnowledgeArticle>> getArticles(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "Tất cả") String category,
            @RequestParam(defaultValue = "Mới nhất") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        return ResponseEntity.ok(service.searchPublic(keyword, category, sort, page, size));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<KnowledgeArticle> getArticleBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(service.getArticleBySlug(slug));
    }

    @PostMapping("/{slug}/view")
    public ResponseEntity<?> incrementViewCount(@PathVariable String slug, HttpServletRequest request) {
        String clientIp = getClientIp(request);
        service.incrementViewCount(slug, clientIp);
        return ResponseEntity.ok(Map.of("message", "Success"));
    }

    @GetMapping("/top-viewed")
    public ResponseEntity<List<KnowledgeArticle>> getTopViewed() {
        return ResponseEntity.ok(service.getTopViewed());
    }

    @GetMapping("/latest")
    public ResponseEntity<List<KnowledgeArticle>> getLatest() {
        return ResponseEntity.ok(service.getLatest());
    }

    @GetMapping("/{slug}/related")
    public ResponseEntity<List<KnowledgeArticle>> getRelated(@PathVariable String slug) {
        return ResponseEntity.ok(service.getRelatedArticles(slug));
    }

    private String getClientIp(HttpServletRequest request) {
        String remoteAddr = "";
        if (request != null) {
            remoteAddr = request.getHeader("X-FORWARDED-FOR");
            if (remoteAddr == null || "".equals(remoteAddr)) {
                remoteAddr = request.getRemoteAddr();
            } else {
                // Return the first IP in the list if there are multiple
                remoteAddr = remoteAddr.split(",")[0];
            }
        }
        return remoteAddr;
    }
}
