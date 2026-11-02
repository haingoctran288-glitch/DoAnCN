package com.example.API_java.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "model_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModelType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name; // e.g., "Uốn tóc", "Cắt tóc"

    @ManyToOne
    @JoinColumn(name = "category_id")
    private ServiceCategory category;
}
