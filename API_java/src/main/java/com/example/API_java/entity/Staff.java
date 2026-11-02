package com.example.API_java.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "staff")
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String specialty;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(length = 50)
    private String branch;

    @Column(name = "experience_years")
    private Integer experienceYears = 0;

    @Column(length = 500)
    private String avatar;

    @Column(name = "is_active")
    private Boolean isActive = true;

    // Trạng thái làm việc (để quản lý nghỉ phép)
    @Enumerated(EnumType.STRING)
    @Column(name = "work_status", length = 30)
    private StaffWorkStatus workStatus = StaffWorkStatus.WORKING;

    @Column(name = "order_count")
    private Integer orderCount = 0;

    private Double rating = 0.0;

    public Staff() {}

    // === GETTERS ===
    public Integer getId() { return id; }
    public String getName() { return name; }
    public String getSpecialty() { return specialty; }
    public String getPhone() { return phone; }
    public String getEmail() { return email; }
    public String getBranch() { return branch; }
    public Integer getExperienceYears() { return experienceYears; }
    public String getAvatar() { return avatar; }
    public Boolean getIsActive() { return isActive; }
    public StaffWorkStatus getWorkStatus() { return workStatus; }
    public Integer getOrderCount() { return orderCount; }
    public Double getRating() { return rating; }

    // === SETTERS ===
    public void setId(Integer id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setEmail(String email) { this.email = email; }
    public void setBranch(String branch) { this.branch = branch; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public void setWorkStatus(StaffWorkStatus workStatus) { this.workStatus = workStatus; }
    public void setOrderCount(Integer orderCount) { this.orderCount = orderCount; }
    public void setRating(Double rating) { this.rating = rating; }
}
