package com.example.API_java.dto;

import com.example.API_java.entity.Staff;
import lombok.Data;

@Data
public class StaffResponse {
    private Integer id;
    private String name;
    private String specialty;
    private String phone;
    private String email;
    private String branch;
    private Integer experienceYears;
    private String avatar;
    private Boolean isActive;
    
    private Integer orderCount; // completed orders
    private Integer performance; // last 30 days completed
    private Double rating; // average rating
    private Integer reviewCount;

    public StaffResponse(Staff staff, Integer orderCount, Integer performance, Double rating, Integer reviewCount) {
        this.id = staff.getId();
        this.name = staff.getName();
        this.specialty = staff.getSpecialty();
        this.phone = staff.getPhone();
        this.email = staff.getEmail();
        this.branch = staff.getBranch();
        this.experienceYears = staff.getExperienceYears();
        this.avatar = staff.getAvatar();
        this.isActive = staff.getIsActive();
        this.orderCount = orderCount;
        this.performance = performance;
        this.rating = rating;
        this.reviewCount = reviewCount;
    }
}
