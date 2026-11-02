package com.example.API_java.controller;

import com.example.API_java.entity.News;
import com.example.API_java.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@CrossOrigin("*")
public class NewsController {

    @Autowired
    private NewsRepository newsRepository;

    @GetMapping
    public ResponseEntity<List<News>> getAllNews() {
        return ResponseEntity.ok(newsRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<News> getNewsById(@PathVariable Long id) {
        return newsRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<News>> getNewsByType(@PathVariable String type) {
        return ResponseEntity.ok(newsRepository.findByTypeOrderByCreatedAtDesc(type));
    }

    @GetMapping("/category/{categorySlug}")
    public ResponseEntity<List<News>> getNewsByCategorySlug(@PathVariable String categorySlug) {
        return ResponseEntity.ok(newsRepository.findByCategorySlugOrderByCreatedAtDesc(categorySlug));
    }

    @PostMapping
    public ResponseEntity<News> createNews(@RequestBody News news) {
        return ResponseEntity.ok(newsRepository.save(news));
    }

    @PutMapping("/{id}")
    public ResponseEntity<News> updateNews(@PathVariable Long id, @RequestBody News newsDetails) {
        return newsRepository.findById(id)
                .map(existingNews -> {
                    existingNews.setTitle(newsDetails.getTitle());
                    existingNews.setContent(newsDetails.getContent());
                    existingNews.setThumbnail(newsDetails.getThumbnail());
                    existingNews.setType(newsDetails.getType());
                    existingNews.setCategorySlug(newsDetails.getCategorySlug());
                    existingNews.setAuthor(newsDetails.getAuthor());
                    existingNews.setSortOrder(newsDetails.getSortOrder());
                    existingNews.setAttachedVoucher(newsDetails.getAttachedVoucher());
                    return ResponseEntity.ok(newsRepository.save(existingNews));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNews(@PathVariable Long id) {
        return newsRepository.findById(id)
                .map(existingNews -> {
                    newsRepository.delete(existingNews);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
