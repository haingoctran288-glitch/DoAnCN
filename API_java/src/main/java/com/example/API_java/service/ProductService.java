package com.example.API_java.service;

import com.example.API_java.entity.Product;
import com.example.API_java.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository repo;

    public List<Product> getAll(String keyword, Long categoryId, String branch) {
        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? "%" + keyword.trim().toLowerCase() + "%" : null;
        String cleanBranch = (branch != null && !branch.trim().isEmpty() && !"Tất cả".equalsIgnoreCase(branch.trim())) ? branch.trim() : null;
        return repo.searchProducts(cleanKeyword, categoryId, cleanBranch);
    }

    public Product getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public List<Product> getByCategory(String category, String branch) {
        return repo.findByCategoryAndBranch(category, branch);
    }

    public Product save(Product product) {
        return repo.save(product);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Transactional
    public void decreaseStock(Long productId, int quantity) {
        Product product = repo.findById(productId).orElse(null);
        if (product != null && product.getStock() != null) {
            int newStock = product.getStock() - quantity;
            product.setStock(Math.max(newStock, 0));
            repo.save(product);
        }
    }
}
