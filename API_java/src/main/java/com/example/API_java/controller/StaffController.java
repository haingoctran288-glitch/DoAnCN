package com.example.API_java.controller;

import com.example.API_java.entity.Staff;
import com.example.API_java.dto.StaffResponse;
import com.example.API_java.repository.StaffRepository;
import com.example.API_java.repository.BookingRepository;
import com.example.API_java.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
public class StaffController {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private com.example.API_java.repository.UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    private StaffResponse mapToResponse(Staff staff) {
        long orderCount = bookingRepository.countCompletedBookingsByStaff(staff.getId());
        long performance = bookingRepository.countPerformanceByStaff(staff.getId(), LocalDate.now().minusDays(30));
        Double rating = reviewRepository.getAverageRatingForBarber(staff.getId());
        Long reviewCount = reviewRepository.getReviewCountForBarber(staff.getId());
        return new StaffResponse(staff, (int) orderCount, (int) performance, rating, reviewCount != null ? reviewCount.intValue() : 0);
    }

    @GetMapping
    public List<StaffResponse> getActiveStaff() {
        return staffRepository.findActiveAndWorkingStaff()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAll(@RequestParam(required = false) String branch, Authentication authentication) {
        String filterBranch = branch;
        if (authentication != null && authentication.getName() != null && !authentication.getName().equals("anonymousUser")) {
            com.example.API_java.entity.User user = userRepository.findByUsername(authentication.getName()).orElse(null);
            if (user != null) {
                if ("EDITOR".equals(user.getRole())) {
                    filterBranch = user.getBranch();
                }
            }
        }

        List<Staff> staffList = staffRepository.findAll().stream()
                .filter(s -> s.getWorkStatus() != com.example.API_java.entity.StaffWorkStatus.RESIGNED)
                .collect(Collectors.toList());
        if (filterBranch != null && !filterBranch.trim().isEmpty()) {
            final String fBranch = filterBranch;
            List<StaffResponse> filtered = staffList.stream()
                    .filter(s -> fBranch.equals(s.getBranch()))
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(filtered);
        }
        return ResponseEntity.ok(staffList.stream().map(this::mapToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public StaffResponse getById(@PathVariable Integer id) {
        Staff staff = staffRepository.findById(id).orElse(null);
        if (staff == null) return null;
        return mapToResponse(staff);
    }

    @PostMapping
    public Staff create(@RequestBody Staff staff) {
        return staffRepository.save(staff);
    }

    @PutMapping("/{id}")
    public Staff update(@PathVariable Integer id, @RequestBody Staff staffDetails) {
        Staff staff = staffRepository.findById(id).orElse(null);
        if (staff != null) {
            staff.setName(staffDetails.getName());
            staff.setSpecialty(staffDetails.getSpecialty());
            staff.setPhone(staffDetails.getPhone());
            staff.setEmail(staffDetails.getEmail());
            staff.setBranch(staffDetails.getBranch());
            staff.setExperienceYears(staffDetails.getExperienceYears());
            staff.setAvatar(staffDetails.getAvatar());
            staff.setIsActive(staffDetails.getIsActive());
            staff.setOrderCount(staffDetails.getOrderCount());
            staff.setRating(staffDetails.getRating());
            return staffRepository.save(staff);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        staffRepository.deleteById(id);
    }
}
