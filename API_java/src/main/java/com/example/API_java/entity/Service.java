package com.example.API_java.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity ánh xạ bảng services
 */
@Entity
@Table(name = "services")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "model_type_id")
    private ModelType modelType;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 255, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column
    private Integer duration; // phút

    @Column(length = 500)
    private String image;

    @Column(length = 20)
    private String status = "active"; // active, inactive

    @Column(name = "gender_type", length = 50)
    private String genderType = "male"; // male, female, unisex

    // service_type removed (combo logic eliminated)

    @Column(name = "main_category", length = 50)
    private String mainCategory = "NAM"; // NAM, NU

    @Column(name = "sub_category", length = 100)
    private String subCategory; // CAT_TOC_CHAM_SOC_DA_RAU...

    // Giữ nguyên các trường cũ để backward compatibility
    @Column(name = "category_type", length = 50)
    private String categoryType = "nam"; // nam, nu, home, event

    @Column(name = "service_group", length = 20)
    private String serviceGroup; // legacy field, kept for backward compatibility

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "sort_order", columnDefinition = "INT DEFAULT 0")
    private Integer sortOrder = 0;

    @Column(name = "model_sort_order", columnDefinition = "INT DEFAULT 0")
    private Integer modelSortOrder = 0;

    @Column(name = "global_sort_order", columnDefinition = "INT DEFAULT 0")
    private Integer globalSortOrder = 0;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.sortOrder == null) {
            this.sortOrder = 0;
        }
        if (this.modelSortOrder == null) {
            this.modelSortOrder = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
