package com.example.API_java.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * DTO trả về lịch sử đặt lịch của khách hàng
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingHistoryDto {
    private Integer id;
    private String date;         // booking_date + booking_time
    private String serviceName;  // Tên dịch vụ
    private BigDecimal price;    // Giá tiền
    private String status;       // Trạng thái
}
