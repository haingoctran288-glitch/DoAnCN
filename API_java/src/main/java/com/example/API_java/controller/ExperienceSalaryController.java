package com.example.API_java.controller;
import com.example.API_java.entity.ExperienceSalary;
import com.example.API_java.repository.ExperienceSalaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/experience-salaries")
@PreAuthorize("hasRole('ADMIN')")
public class ExperienceSalaryController {
    @Autowired
    private ExperienceSalaryRepository repo;

    @GetMapping
    public ResponseEntity<List<ExperienceSalary>> getAll() {
        return ResponseEntity.ok(repo.findAll());
    }

    @PostMapping
    public ResponseEntity<ExperienceSalary> create(@RequestBody ExperienceSalary ex) {
        return ResponseEntity.ok(repo.save(ex));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExperienceSalary> update(@PathVariable Integer id, @RequestBody ExperienceSalary exDetails) {
        ExperienceSalary ex = repo.findById(id).orElseThrow();
        ex.setYearsOfExperience(exDetails.getYearsOfExperience());
        ex.setBaseSalary(exDetails.getBaseSalary());
        return ResponseEntity.ok(repo.save(ex));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
