package com.example.API_java.controller;

import com.example.API_java.entity.Order;
import com.example.API_java.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;
import com.example.API_java.entity.User;
import com.example.API_java.repository.UserRepository;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.example.API_java.repository.NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<?> getAllOrders(@RequestParam(required = false) String branch, Authentication authentication) {
        String filterBranch = branch;
        if (authentication != null && authentication.getName() != null && !authentication.getName().equals("anonymousUser")) {
            User user = userRepository.findByUsername(authentication.getName()).orElse(null);
            if (user != null) {
                if ("EMPLOYEE".equals(user.getRole())) {
                    return ResponseEntity.status(403).body("Bạn không có quyền truy cập");
                }
                if ("EDITOR".equals(user.getRole())) {
                    filterBranch = user.getBranch();
                }
            }
        }

        List<Order> orders = orderService.getAllOrders();
        if (filterBranch != null && !filterBranch.trim().isEmpty()) {
            final String fBranch = filterBranch;
            orders = orders.stream()
                    .filter(o -> fBranch.equals(o.getOrderBranch()))
                    .collect(java.util.stream.Collectors.toList());
        }
        return ResponseEntity.ok(orders);
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order, Authentication authentication) {
        if (authentication != null) {
            User user = userRepository.findByUsername(authentication.getName()).orElse(null);
            if (user != null) {
                if (Boolean.TRUE.equals(user.getIsBlocked())) {
                    return ResponseEntity.status(403).body(Map.of("error", "Tài khoản của bạn đã bị khóa. Lý do: " + (user.getBlockedReason() != null ? user.getBlockedReason() : "")));
                }
                if (Boolean.TRUE.equals(user.getIsCashPaymentLocked()) && "cod".equalsIgnoreCase(order.getPaymentMethod())) {
                    return ResponseEntity.status(403).body(Map.of("error", "Tài khoản của bạn đã bị hạn chế thanh toán tiền mặt."));
                }
                
                if ("EDITOR".equals(user.getRole())) {
                    order.setCreatedByEditor(user.getUsername());
                    order.setOrderBranch(user.getBranch());
                } else {
                    order.setUserId((long) user.getId());
                }
            }
        }
        try {
            Order savedOrder = orderService.createOrder(order);
            
            // Notify Admin
            List<User> admins = userRepository.findByRole("ADMIN");
            for (User admin : admins) {
                com.example.API_java.entity.Notification notif = new com.example.API_java.entity.Notification();
                notif.setUser(admin);
                notif.setType("order");
                notif.setTitle("Đơn đặt hàng mới");
                int itemCount = (savedOrder.getItems() != null) ? savedOrder.getItems().size() : 0;
                notif.setMessage("Khách hàng " + savedOrder.getName() + " vừa đặt " + itemCount + " sản phẩm.");
                notificationRepository.save(notif);
            }

            return ResponseEntity.ok(savedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(
            @PathVariable Long userId,
            @RequestParam(required = false) String status) {
        if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(orderService.getOrdersByUserIdAndStatus(userId, status));
        }
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        if (order == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id, @RequestBody Map<String, String> body, HttpServletRequest request) {
        String reason = body.getOrDefault("reason", "Không rõ lý do");
        String ipAddr = request.getRemoteAddr();
        try {
            Order order = orderService.cancelOrder(id, reason, ipAddr);
            if (order == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Không thể hủy đơn hàng này"));
            }
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirmOrder(@PathVariable Long id) {
        Order order = orderService.confirmOrder(id);
        if (order == null) return ResponseEntity.badRequest().body(Map.of("error", "Không tìm thấy đơn"));
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/deliver")
    public ResponseEntity<?> deliverOrder(@PathVariable Long id) {
        Order order = orderService.deliverOrder(id);
        if (order == null) return ResponseEntity.badRequest().body(Map.of("error", "Không tìm thấy đơn"));
        return ResponseEntity.ok(order);
    }
}
