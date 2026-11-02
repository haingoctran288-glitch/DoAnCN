package com.example.API_java.dto;

import com.example.API_java.entity.Staff;
import lombok.Data;

@Data
public class BookingAssignmentResult {
    private Integer employeeId;
    private String employeeName;
    private String reason;
    private Integer totalMinutesToday;
    private Integer bookingToday;
    private Integer minutesWeek;
    private Integer minutesMonth;
    
    // Not serialized usually or just ignored in json response
    private Staff staff;
}
