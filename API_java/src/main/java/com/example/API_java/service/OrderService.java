package com.example.API_java.service;

import com.example.API_java.entity.Order;
import com.example.API_java.entity.OrderItem;
import com.example.API_java.entity.Address;
import com.example.API_java.entity.Notification;
import com.example.API_java.entity.User;
import com.example.API_java.repository.OrderRepository;
import com.example.API_java.repository.AddressRepository;
import com.example.API_java.repository.NotificationRepository;
import com.example.API_java.repository.UserRepository;
import com.example.API_java.util.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.API_java.entity.CustomerVoucher;
import com.example.API_java.repository.CustomerVoucherRepository;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private VoucherService voucherService;

    @Autowired
    private CustomerVoucherRepository customerVoucherRepository;

    private User resolveOrderUser(Order order) {
        if (order == null) return null;
        if (order.getUser() != null) return order.getUser();
        if (order.getUserId() != null && order.getUserId() > 0) {
            return userRepository.findById(order.getUserId().intValue()).orElse(null);
        }
        return null;
    }

    private String buildOrderDataJson(Order order, String cancelReason) {
        try {
            Map<String, Object> dataMap = new HashMap<>();
            dataMap.put("order_id", order.getId());
            dataMap.put("total_price", order.getTotalPrice());
            dataMap.put("shipping_fee", order.getShippingFee());
            dataMap.put("payment_method", order.getPaymentMethod());
            dataMap.put("payment_status", order.getPaymentStatus());
            dataMap.put("transaction_no", order.getVnpTransactionNo());
            dataMap.put("customer_name", order.getName());
            dataMap.put("phone", order.getPhone());
            dataMap.put("address", order.getAddress());
            dataMap.put("order_branch", order.getOrderBranch());
            dataMap.put("status", order.getStatus());
            if (order.getCreatedAt() != null) {
                dataMap.put("created_at", order.getCreatedAt().toString());
            }
            if (cancelReason != null) {
                dataMap.put("cancel_reason", cancelReason);
            }

            List<Map<String, Object>> itemMaps = new ArrayList<>();
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    Map<String, Object> im = new HashMap<>();
                    im.put("productId", item.getProductId());
                    im.put("productName", item.getProductName());
                    im.put("productImage", item.getProductImage());
                    im.put("quantity", item.getQuantity());
                    im.put("price", item.getPrice());
                    itemMaps.add(im);
                }
            }
            dataMap.put("items", itemMaps);

            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(dataMap);
        } catch (Exception e) {
            return "{}";
        }
    }

    @Transactional
    public Order createOrder(Order order) {
        // Snapshot logic: lấy name, phone, address từ addressId
        if (order.getAddressId() != null) {
            Address address = addressRepository.findById(order.getAddressId()).orElse(null);
            if (address != null) {
                order.setName(address.getName());
                order.setPhone(address.getPhone());
                order.setAddress(address.getAddress());
            }
        }

        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setOrder(order);
                // Check stock
                com.example.API_java.entity.Product product = productService.getById(item.getProductId());
                if (product != null) {
                    if (product.getStock() < item.getQuantity()) {
                        throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ số lượng trong kho.");
                    }
                    productService.decreaseStock(item.getProductId(), item.getQuantity());
                }
            }
        }

        if (order.getOrderBranch() == null || order.getOrderBranch().trim().isEmpty()) {
            if (order.getItems() != null && !order.getItems().isEmpty()) {
                OrderItem firstItem = order.getItems().get(0);
                com.example.API_java.entity.Product product = productService.getById(firstItem.getProductId());
                if (product != null && product.getBranch() != null) {
                    order.setOrderBranch(product.getBranch());
                }
            }
        }

        // Apply Voucher if customerVoucherId is provided
        Integer customerVoucherId = order.getCustomerVoucherId();
        if (customerVoucherId != null && order.getUserId() != null) {
            try {
                double originalPrice = order.getTotalPrice() != null ? order.getTotalPrice() : 0.0;
                Map<String, Object> discountInfo = voucherService.validateAndCalculateDiscount(
                    order.getUserId().intValue(), customerVoucherId, "PRODUCT", originalPrice
                );
                double discountAmount = ((Number) discountInfo.get("discountAmount")).doubleValue();
                order.setTotalPrice(originalPrice - discountAmount);
            } catch (Exception e) {
                System.err.println("Error applying voucher: " + e.getMessage());
                throw new RuntimeException("Lỗi áp dụng voucher: " + e.getMessage());
            }
        }

        Order saved = orderRepository.save(order);

        // Mark Voucher as Used
        if (customerVoucherId != null && order.getUserId() != null) {
            try {
                voucherService.useVoucher(order.getUserId().intValue(), customerVoucherId, saved.getId(), null);
            } catch (Exception e) {
                System.err.println("Error marking voucher as used: " + e.getMessage());
            }
        }

        // Trigger campaigns (like ORDER_VALUE_OVER_X)
        if (order.getUserId() != null) {
            try {
                voucherService.evaluateCampaigns(order.getUserId().intValue(), "ORDER_VALUE_OVER_X", saved.getTotalPrice());
            } catch (Exception e) {
                System.err.println("Error evaluating ORDER_VALUE_OVER_X campaigns: " + e.getMessage());
            }
        }

        // Nếu đặt hàng COD -> gửi thông báo + gửi email xác nhận đơn hàng ngay lập tức
        // (Đối với VNPAY/MOMO sẽ gửi sau khi thanh toán thành công tại updatePaymentSuccess)
        if ("COD".equalsIgnoreCase(saved.getPaymentMethod()) || saved.getPaymentMethod() == null) {
            User customer = resolveOrderUser(saved);
            if (customer != null) {
                try {
                    Notification notif = new Notification();
                    notif.setUser(customer);
                    notif.setType("approve");
                    notif.setTitle("🛒 Đặt hàng thành công #" + saved.getId());
                    notif.setMessage("Cảm ơn quý khách đã đặt hàng tại Hornet Royale! Đơn hàng mã số #" + saved.getId() + " đã được tiếp nhận và đang chờ xác nhận.");
                    notif.setDataJson(buildOrderDataJson(saved, null));
                    notificationRepository.save(notif);
                } catch (Exception e) {
                    System.err.println("Error saving COD order notification: " + e.getMessage());
                }

                try {
                    emailService.sendOrderConfirmationEmail(saved, customer.getEmail(), "NEW");
                } catch (Exception e) {
                    System.err.println("Error sending COD order email: " + e.getMessage());
                }
            }
        }

        return saved;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Order> getOrdersByUserIdAndStatus(Long userId, String status) {
        return orderRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    @Autowired
    private VnPayService vnPayService;

    @Autowired
    private MoMoService moMoService;

    @Transactional
    public Order cancelOrder(Long id, String reason, String ipAddr) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) return null;
        if (!"pending".equalsIgnoreCase(order.getStatus()) && !"confirmed".equalsIgnoreCase(order.getStatus())) return null;

        // Process refund if online payment
        if ("VNPAY".equalsIgnoreCase(order.getPaymentMethod()) && "PAID".equalsIgnoreCase(order.getPaymentStatus())) {
            boolean refundSuccess = vnPayService.refundOrder(order, ipAddr);
            if (!refundSuccess) {
                throw new RuntimeException("Hoàn tiền VNPAY thất bại");
            }
        } else if ("MOMO".equalsIgnoreCase(order.getPaymentMethod()) && "PAID".equalsIgnoreCase(order.getPaymentStatus())) {
            boolean refundSuccess = moMoService.refundOrder(order);
            if (!refundSuccess) {
                throw new RuntimeException("Hoàn tiền MOMO thất bại");
            }
        }

        order.setStatus("cancelled");
        order.setCancelReason(reason);
        order.setCancelTime(LocalDateTime.now());
        
        // Release voucher if applied
        if (order.getUserId() != null) {
            try {
                List<CustomerVoucher> cvs = customerVoucherRepository.findByUserIdOrderByClaimedAtDesc(order.getUserId().intValue());
                for (CustomerVoucher cv : cvs) {
                    if (cv.getOrderId() != null && cv.getOrderId().equals(order.getId())) {
                        voucherService.releaseVoucher(order.getUserId().intValue(), cv.getId());
                    }
                }
            } catch (Exception e) {
                System.err.println("Error releasing voucher for cancelled order: " + e.getMessage());
            }
        }
        
        // Hoàn lại stock sản phẩm
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                productService.decreaseStock(item.getProductId(), -item.getQuantity()); // decrease by negative = increase
            }
        }
        
        Order savedOrder = orderRepository.save(order);

        // Send cancel notification & email to customer
        User customer = resolveOrderUser(savedOrder);
        if (customer != null) {
            Notification notif = new Notification();
            notif.setUser(customer);
            notif.setType("cancel");
            notif.setTitle("❌ Đơn hàng #" + savedOrder.getId() + " đã bị hủy");
            
            String msg = "Chúng tôi vô cùng xin lỗi quý khách vì sự bất tiện này. Đơn hàng mã số #" + savedOrder.getId() + " của bạn đã bị hủy.";
            if ("PAID".equalsIgnoreCase(order.getPaymentStatus())) {
                msg += " Hệ thống đã tiến hành hoàn tiền qua " + order.getPaymentMethod() + ".";
            }
            notif.setMessage(msg);
            notif.setDataJson(buildOrderDataJson(savedOrder, reason));
            notificationRepository.save(notif);

            try {
                emailService.sendOrderConfirmationEmail(savedOrder, customer.getEmail(), "CANCELLED");
            } catch (Exception e) {
                System.err.println("Error sending cancel order email: " + e.getMessage());
            }
        }

        return savedOrder;
    }

    @Transactional
    public Order confirmOrder(Long id) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) return null;
        order.setStatus("confirmed");

        Order savedOrder = orderRepository.save(order);

        // Trigger voucher campaigns
        if (savedOrder.getUserId() != null) {
            try {
                voucherService.evaluateCampaigns(savedOrder.getUserId().intValue(), "FIRST_PRODUCT_ORDER", null);
                voucherService.evaluateCampaigns(savedOrder.getUserId().intValue(), "MEMBERSHIP_TIER", null);
            } catch (Exception e) {
                System.err.println("Error evaluating campaigns for confirmed order: " + e.getMessage());
            }
        }

        // Send approve notification & email to customer
        User customer = resolveOrderUser(savedOrder);
        if (customer != null) {
            Notification notif = new Notification();
            notif.setUser(customer);
            notif.setType("approve"); // Map to green style in frontend
            notif.setTitle("✅ Đơn hàng #" + savedOrder.getId() + " đã được duyệt");
            notif.setMessage("Đơn hàng mã số #" + savedOrder.getId() + " của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!");
            notif.setDataJson(buildOrderDataJson(savedOrder, null));
            notificationRepository.save(notif);

            try {
                emailService.sendOrderConfirmationEmail(savedOrder, customer.getEmail(), "CONFIRMED");
            } catch (Exception e) {
                System.err.println("Error sending confirm order email: " + e.getMessage());
            }
        }

        return savedOrder;
    }

    @Transactional
    public Order deliverOrder(Long id) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) return null;
        order.setStatus("delivered");
        Order savedOrder = orderRepository.save(order);

        // Trigger voucher campaigns
        if (savedOrder.getUserId() != null) {
            try {
                voucherService.evaluateCampaigns(savedOrder.getUserId().intValue(), "FIRST_PRODUCT_ORDER", null);
                voucherService.evaluateCampaigns(savedOrder.getUserId().intValue(), "MEMBERSHIP_TIER", null);
            } catch (Exception e) {
                System.err.println("Error evaluating campaigns for delivered order: " + e.getMessage());
            }
        }

        // Send delivery notification & email to customer
        User customer = resolveOrderUser(savedOrder);
        if (customer != null) {
            Notification notif = new Notification();
            notif.setUser(customer);
            notif.setType("approve"); // Map to green style in frontend or create new style
            notif.setTitle("📦 Đơn hàng #" + savedOrder.getId() + " đã giao thành công");
            notif.setMessage("Đơn hàng mã số #" + savedOrder.getId() + " của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!");
            notif.setDataJson(buildOrderDataJson(savedOrder, null));
            notificationRepository.save(notif);

            try {
                emailService.sendOrderConfirmationEmail(savedOrder, customer.getEmail(), "DELIVERED");
            } catch (Exception e) {
                System.err.println("Error sending deliver order email: " + e.getMessage());
            }
        }

        return savedOrder;
    }

    @Transactional
    public void updatePaymentSuccess(Long orderId, String transactionNo) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order != null) {
            boolean alreadyPaid = "PAID".equalsIgnoreCase(order.getPaymentStatus());
            // Keep status as pending so admin can review and approve/cancel manually
            order.setPaymentStatus("PAID");
            order.setVnpTransactionNo(transactionNo);
            order.setPaidAt(LocalDateTime.now());
            Order savedOrder = orderRepository.save(order);

            if (!alreadyPaid) {
                User customer = resolveOrderUser(savedOrder);
                if (customer != null) {
                    try {
                        Notification notif = new Notification();
                        notif.setUser(customer);
                        notif.setType("approve");
                        notif.setTitle("💳 Thanh toán & Đặt hàng thành công #" + savedOrder.getId());
                        notif.setMessage("Đơn hàng mã số #" + savedOrder.getId() + " của bạn đã được thanh toán thành công qua " + savedOrder.getPaymentMethod() + " và đang chờ xác nhận.");
                        notif.setDataJson(buildOrderDataJson(savedOrder, null));
                        notificationRepository.save(notif);
                    } catch (Exception e) {
                        System.err.println("Error saving payment success notification: " + e.getMessage());
                    }

                    try {
                        emailService.sendOrderConfirmationEmail(savedOrder, customer.getEmail(), "PAID");
                    } catch (Exception e) {
                        System.err.println("Error sending payment success email: " + e.getMessage());
                    }
                }
            }
        }
    }

    @Transactional
    public void updatePaymentFailed(Long orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order != null) {
            order.setPaymentStatus("FAILED");
            orderRepository.save(order);
        }
    }
}
