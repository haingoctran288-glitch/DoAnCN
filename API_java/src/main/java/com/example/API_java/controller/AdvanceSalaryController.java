package com.example.API_java.controller;
import com.example.API_java.entity.AdvanceSalary;
import com.example.API_java.repository.AdvanceSalaryRepository;
import com.example.API_java.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/advance-salaries")
@PreAuthorize("hasRole('ADMIN')")
public class AdvanceSalaryController {
    @Autowired
    private AdvanceSalaryRepository repo;
    @Autowired
    private StaffRepository staffRepo;

    @GetMapping
    public ResponseEntity<List<AdvanceSalary>> getAll() {
        return ResponseEntity.ok(repo.findAllByOrderByAdvanceDateDesc());
    }

    @PostMapping
    public ResponseEntity<AdvanceSalary> create(@RequestBody AdvanceSalary adv) {
        if(adv.getStaff() != null && adv.getStaff().getId() != null) {
            adv.setStaff(staffRepo.findById(adv.getStaff().getId()).orElse(null));
        }
        return ResponseEntity.ok(repo.save(adv));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdvanceSalary> update(@PathVariable Integer id, @RequestBody AdvanceSalary details) {
        AdvanceSalary adv = repo.findById(id).orElseThrow();
        if(details.getStaff() != null && details.getStaff().getId() != null) {
            adv.setStaff(staffRepo.findById(details.getStaff().getId()).orElse(null));
        }
        adv.setAdvanceDate(details.getAdvanceDate());
        adv.setAmount(details.getAmount());
        adv.setNotes(details.getNotes());
        return ResponseEntity.ok(repo.save(adv));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
