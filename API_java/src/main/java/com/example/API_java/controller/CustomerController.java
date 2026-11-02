package com.example.API_java.controller;

import com.example.API_java.dto.BookingHistoryDto;
import com.example.API_java.dto.CustomerDto;
import com.example.API_java.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller quản lý khách hàng - dành cho Admin Panel
 * Base URL: /api/customers
 */
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    /**
     * GET /api/customers
     * Danh sách tất cả khách hàng (có phân trang, tìm kiếm, lọc)
     */
    @GetMapping
    public ResponseEntity<?> getAllCustomers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "all") String rank,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "all") String status) {
        try {
            Map<String, Object> result = customerService.getCustomersWithFilters(page, sort, rank, search, status);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Không thể tải danh sách khách hàng: " + e.getMessage()));
        }
    }

    /**
     * GET /api/customers/{id}
     * Chi tiết một khách hàng
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable Integer id) {
        try {
            CustomerDto customer = customerService.getCustomerById(id);
            return ResponseEntity.ok(customer);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * GET /api/customers/{id}/bookings
     * Lịch sử đặt lịch của khách hàng
     */
    @GetMapping("/{id}/bookings")
    public ResponseEntity<?> getCustomerBookings(@PathVariable Integer id) {
        try {
            List<BookingHistoryDto> history = customerService.getBookingHistory(id);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Không thể tải lịch sử: " + e.getMessage()));
        }
    }

    /**
     * PATCH /api/customers/{id}/lock-cash-payment
     * Khóa chức năng thanh toán COD
     */
    @PatchMapping("/{id}/lock-cash-payment")
    public ResponseEntity<?> lockCashPayment(@PathVariable Integer id) {
        try {
            CustomerDto customer = customerService.lockCashPayment(id);
            return ResponseEntity.ok(customer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * PATCH /api/customers/{id}/unlock-cash-payment
     * Mở khóa chức năng thanh toán COD
     */
    @PatchMapping("/{id}/unlock-cash-payment")
    public ResponseEntity<?> unlockCashPayment(@PathVariable Integer id) {
        try {
            CustomerDto customer = customerService.unlockCashPayment(id);
            return ResponseEntity.ok(customer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * PATCH /api/customers/{id}/block
     * Khóa tài khoản khách hàng (yêu cầu lý do)
     */
    @PatchMapping("/{id}/block")
    public ResponseEntity<?> blockCustomer(@PathVariable Integer id, @RequestBody Map<String, String> payload) {
        try {
            String reason = payload.getOrDefault("reason", "Không có lý do");
            CustomerDto customer = customerService.blockCustomer(id, reason);
            return ResponseEntity.ok(customer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * PATCH /api/customers/{id}/unblock
     * Mở khóa tài khoản khách hàng
     */
    @PatchMapping("/{id}/unblock")
    public ResponseEntity<?> unblockCustomer(@PathVariable Integer id) {
        try {
            CustomerDto customer = customerService.unblockCustomer(id);
            return ResponseEntity.ok(customer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * DELETE /api/customers/{id}
     * Xóa hoàn toàn một khách hàng
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Integer id) {
        try {
            customerService.deleteCustomer(id);
            return ResponseEntity.ok(Map.of("message", "Xóa khách hàng thành công!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
