package com.example.API_java.controller;

import com.example.API_java.entity.Product;
import com.example.API_java.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.example.API_java.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService service;

    @Autowired
    private ProductRepository repo;

    @GetMapping
    public List<Product> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String branch) {
        return service.getAll(keyword, categoryId, branch);
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/category/{category}")
    public List<Product> getByCategory(@PathVariable String category, @RequestParam(required = false) String branch) {
        return service.getByCategory(category, branch);
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        if ("Online".equals(product.getBranch())) {
            product.setBranch(null);
        }
        return service.save(product);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        if ("Online".equals(product.getBranch())) {
            product.setBranch(null);
        }
        product.setId(id);
        return service.save(product);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PatchMapping("/reorder")
    public ResponseEntity<?> reorder(@RequestBody Map<String, Object> data) {
        try {
            Long productId = Long.valueOf(data.get("productId").toString());
            String action = data.get("action").toString();
            
            Product product = service.getById(productId);
            if (product == null) return ResponseEntity.notFound().build();
            
            List<Product> allProducts = repo.findAllByOrderBySortOrderAsc();
            if (allProducts.size() <= 1) return ResponseEntity.ok().build();
            
            int currentIndex = -1;
            for (int i = 0; i < allProducts.size(); i++) {
                if (allProducts.get(i).getId().equals(productId)) {
                    currentIndex = i;
                    break;
                }
            }
            if (currentIndex == -1) return ResponseEntity.badRequest().build();
            
            switch (action) {
                case "move_top":
                    if (currentIndex > 0) {
                        allProducts.remove(currentIndex);
                        allProducts.add(0, product);
                    }
                    break;
                case "move_up":
                    if (currentIndex > 0) {
                        Product temp = allProducts.get(currentIndex - 1);
                        allProducts.set(currentIndex - 1, product);
                        allProducts.set(currentIndex, temp);
                    }
                    break;
                case "move_down":
                    if (currentIndex < allProducts.size() - 1) {
                        Product temp = allProducts.get(currentIndex + 1);
                        allProducts.set(currentIndex + 1, product);
                        allProducts.set(currentIndex, temp);
                    }
                    break;
                case "move_bottom":
                    if (currentIndex < allProducts.size() - 1) {
                        allProducts.remove(currentIndex);
                        allProducts.add(product);
                    }
                    break;
                default:
                    return ResponseEntity.badRequest().body("Invalid action");
            }
            
            for (int i = 0; i < allProducts.size(); i++) {
                Product p = allProducts.get(i);
                p.setSortOrder(i + 1);
                service.save(p);
            }
            
            return ResponseEntity.ok(allProducts);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
