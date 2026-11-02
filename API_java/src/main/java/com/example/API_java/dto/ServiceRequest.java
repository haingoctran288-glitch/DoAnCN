package com.example.API_java.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ServiceRequest {
    private Integer id;
    private Integer categoryId;
    private String modelTypeName;
    private String mainCategory;
    private String subCategory;
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private Integer duration;
    private String image;
    private String status;
    private String genderType;
    
    // Giữ lại trường cũ để tương thích (nếu frontend cũ gửi)
    private String categoryType;
    private String serviceGroup;
}
