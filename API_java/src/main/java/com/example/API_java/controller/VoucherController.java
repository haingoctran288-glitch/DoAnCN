package com.example.API_java.controller;

import com.example.API_java.entity.Voucher;
import com.example.API_java.entity.VoucherCampaign;
import com.example.API_java.entity.CustomerVoucher;
import com.example.API_java.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class VoucherController {

    @Autowired
    private VoucherService voucherService;
    
    @Autowired
    private com.example.API_java.repository.UserRepository userRepository;

    // ==========================================
    // VOUCHER ENDPOINTS (Admin)
    // ==========================================

    @GetMapping("/vouchers")
    public List<Voucher> getAllVouchers() {
        return voucherService.getAllVouchers();
    }

    @GetMapping("/vouchers/{id}")
    public ResponseEntity<Voucher> getVoucherById(@PathVariable Integer id) {
        return ResponseEntity.ok(voucherService.getVoucherById(id));
    }

    @PostMapping("/vouchers")
    public ResponseEntity<?> createVoucher(@RequestBody Voucher voucher) {
        try {
            return ResponseEntity.ok(voucherService.createVoucher(voucher));
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage() != null ? e.getMessage() : e.toString()));
        }
    }

    @PutMapping("/vouchers/{id}")
    public ResponseEntity<?> updateVoucher(@PathVariable Integer id, @RequestBody Voucher details) {
        try {
            return ResponseEntity.ok(voucherService.updateVoucher(id, details));
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage() != null ? e.getMessage() : e.toString()));
        }
    }

    @DeleteMapping("/vouchers/{id}")
    public ResponseEntity<?> deleteVoucher(@PathVariable Integer id) {
        try {
            voucherService.deleteVoucher(id);
            return ResponseEntity.ok(Map.of("message", "Xóa Voucher thành công!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/vouchers/{id}/toggle")
    public ResponseEntity<?> toggleVoucherStatus(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(voucherService.toggleVoucherStatus(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }



    // ==========================================
    // CUSTOMER GIFT & WALLET ENDPOINTS
    // ==========================================

    @PostMapping("/customer-vouchers/gift")
    public ResponseEntity<?> giftVoucherManually(@RequestBody Map<String, Object> body) {
        try {
            Integer userId = (Integer) body.get("userId");
            Integer voucherId = (Integer) body.get("voucherId");
            int quantity = body.containsKey("quantity") ? (Integer) body.get("quantity") : 1;
            String note = (String) body.get("note");
            String startDateStr = (String) body.get("startDate");
            String endDateStr = (String) body.get("endDate");
            java.time.LocalDateTime startDate = startDateStr != null ? java.time.LocalDateTime.parse(startDateStr) : null;
            java.time.LocalDateTime endDate = endDateStr != null ? java.time.LocalDateTime.parse(endDateStr) : null;

            List<CustomerVoucher> cvList = voucherService.giftVoucherManually(userId, voucherId, quantity, note, startDate, endDate);
            return ResponseEntity.ok(Map.of(
                "message", "Đã tặng " + quantity + " voucher thành công cho khách hàng!",
                "data", cvList
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/customer-vouchers/claim/{voucherId}")
    public ResponseEntity<?> claimVoucher(@PathVariable Integer voucherId, java.security.Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Đăng nhập để nhận Voucher"));
            }
            com.example.API_java.entity.User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy user!"));
                    
            CustomerVoucher cv = voucherService.claimVoucher(user.getId(), voucherId);
            return ResponseEntity.ok(Map.of(
                "message", "Bạn đã nhận Voucher thành công.",
                "data", cv
            ));
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if ("Bạn đã nhận voucher này rồi!".equals(msg) || "Voucher này đã hết số lượng phát hành!".equals(msg)) {
                return ResponseEntity.badRequest().body(Map.of("message", msg));
            }
            return ResponseEntity.badRequest().body(Map.of("message", msg));
        }
    }
    @PostMapping("/customer-vouchers/gift-birthday")
    public ResponseEntity<?> giftBirthdayVouchers(@RequestBody Map<String, Object> body) {
        try {
            Integer voucherId = (Integer) body.get("voucherId");
            Integer month = (Integer) body.get("month");
            if (voucherId == null || month == null) {
                throw new RuntimeException("Thiếu voucherId hoặc tháng sinh!");
            }
            List<CustomerVoucher> cvList = voucherService.giftBirthdayVouchers(voucherId, month);
            return ResponseEntity.ok(Map.of(
                "message", "Đã phát hành voucher sinh nhật tháng " + month + " thành công cho các khách hàng phù hợp!",
                "data", cvList
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/customer-vouchers/claim")
    public ResponseEntity<?> claimVoucher(@RequestBody Map<String, Object> body) {
        try {
            Object userIdObj = body.get("userId");
            Integer userId = userIdObj instanceof Integer ? (Integer) userIdObj : Integer.parseInt(userIdObj.toString());
            String code = (String) body.get("code");

            if (code == null || code.trim().isEmpty()) {
                throw new RuntimeException("Vui lòng nhập mã voucher!");
            }

            CustomerVoucher cv = voucherService.claimVoucher(userId, code.trim());
            return ResponseEntity.ok(Map.of(
                "message", "Lưu mã voucher thành công!",
                "data", cv
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/customer-vouchers/my-vouchers")
    public ResponseEntity<?> getMyVouchers(@RequestParam Integer userId, @RequestParam(required = false) String status) {
        try {
            return ResponseEntity.ok(voucherService.getCustomerVouchers(userId, status));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/customer-vouchers/apply")
    public ResponseEntity<?> applyVoucher(@RequestBody Map<String, Object> body) {
        try {
            Integer userId = (Integer) body.get("userId");
            Integer customerVoucherId = (Integer) body.get("customerVoucherId");
            String applyTo = (String) body.get("applyTo");
            Double amount = ((Number) body.get("amount")).doubleValue();

            Map<String, Object> result = voucherService.validateAndCalculateDiscount(userId, customerVoucherId, applyTo, amount);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
