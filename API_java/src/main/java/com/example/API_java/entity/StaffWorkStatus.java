package com.example.API_java.entity;

/**
 * Trạng thái làm việc của nhân viên.
 * Dùng trong Staff entity và StaffLeaveService.
 */
public enum StaffWorkStatus {
    WORKING,          // Đang làm việc bình thường
    PLANNED_LEAVE,    // Nghỉ có kế hoạch (đã đăng ký trước)
    UNPLANNED_LEAVE,  // Nghỉ đột xuất (báo trong ngày)
    RESIGNED          // Đã nghỉ việc (lưu hồ sơ, không xuất hiện frontend)
}
