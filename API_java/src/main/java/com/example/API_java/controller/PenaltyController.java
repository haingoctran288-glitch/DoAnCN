package com.example.API_java.controller;
import com.example.API_java.entity.Penalty;
import com.example.API_java.repository.PenaltyRepository;
import com.example.API_java.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/penalties")
@PreAuthorize("hasRole('ADMIN')")
public class PenaltyController {
    @Autowired
    private PenaltyRepository repo;
    @Autowired
    private StaffRepository staffRepo;

    @GetMapping
    public ResponseEntity<List<Penalty>> getAll() {
        return ResponseEntity.ok(repo.findAllByOrderByPenaltyDateDesc());
    }

    @PostMapping
    public ResponseEntity<Penalty> create(@RequestBody Penalty p) {
        if(p.getStaff() != null && p.getStaff().getId() != null) {
            p.setStaff(staffRepo.findById(p.getStaff().getId()).orElse(null));
        }
        return ResponseEntity.ok(repo.save(p));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Penalty> update(@PathVariable Integer id, @RequestBody Penalty details) {
        Penalty p = repo.findById(id).orElseThrow();
        if(details.getStaff() != null && details.getStaff().getId() != null) {
            p.setStaff(staffRepo.findById(details.getStaff().getId()).orElse(null));
        }
        p.setPenaltyDate(details.getPenaltyDate());
        p.setPenaltyType(details.getPenaltyType());
        p.setAmount(details.getAmount());
        p.setNotes(details.getNotes());
        return ResponseEntity.ok(repo.save(p));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
