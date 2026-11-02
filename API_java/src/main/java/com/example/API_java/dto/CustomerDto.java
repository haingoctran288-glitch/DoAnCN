package com.example.API_java.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * DTO trả về danh sách khách hàng cho Admin Panel
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDto {
    private Integer id;
    private String name;        // fullName
    private String email;
    private String avatar;      // avatar
    private String createdAt;   // Ngày gia nhập
    private BigDecimal totalSpent; // Tổng tiền đã chi
    private BigDecimal serviceSpent; // Chi cho dịch vụ
    private BigDecimal productSpent; // Chi cho sản phẩm
    private long bookingCount;  // Số lần đặt (hoàn thành)
    private String tier;        // Hạng mức
    private String lastVisit;   // Lần đến cuối
    private Boolean isCashPaymentLocked;
    private Boolean isBlocked;
    private String blockedReason;
}
