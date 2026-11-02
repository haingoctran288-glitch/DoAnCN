package com.example.API_java.service;

import com.example.API_java.entity.Order;
import com.example.API_java.entity.OrderItem;
import com.example.API_java.entity.Address;
import com.example.API_java.entity.Notification;
import com.example.API_java.repository.OrderRepository;
import com.example.API_java.repository.AddressRepository;
import com.example.API_java.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
    private VoucherService voucherService;

    @Autowired
    private CustomerVoucherRepository customerVoucherRepository;

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

        // Send cancel notification to customer
        if (savedOrder.getUser() != null) {
            Notification notif = new Notification();
            notif.setUser(savedOrder.getUser());
            notif.setType("cancel");
            notif.setTitle("❌ Đơn hàng #" + savedOrder.getId() + " đã bị hủy");
            
            String msg = "Chúng tôi vô cùng xin lỗi quý khách vì sự bất tiện này. Đơn hàng mã số #" + savedOrder.getId() + " của bạn đã bị hủy.";
            if ("PAID".equalsIgnoreCase(order.getPaymentStatus())) {
                msg += " Hệ thống đã tiến hành hoàn tiền qua " + order.getPaymentMethod() + ".";
            }
            notif.setMessage(msg);
            
            Map<String, Object> dataMap = new HashMap<>();
            dataMap.put("order_id", savedOrder.getId());
            dataMap.put("total_price", savedOrder.getTotalPrice());
            dataMap.put("cancel_reason", reason);
            try {
                ObjectMapper mapper = new ObjectMapper();
                notif.setDataJson(mapper.writeValueAsString(dataMap));
            } catch (Exception e) {
                notif.setDataJson("{}");
            }
            notificationRepository.save(notif);
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

        // Send approve notification to customer
        if (savedOrder.getUser() != null) {
            Notification notif = new Notification();
            notif.setUser(savedOrder.getUser());
            notif.setType("approve"); // Map to green style in frontend
            notif.setTitle("✅ Đơn hàng #" + savedOrder.getId() + " đã được duyệt");
            notif.setMessage("Đơn hàng mã số #" + savedOrder.getId() + " của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!");
            
            Map<String, Object> dataMap = new HashMap<>();
            dataMap.put("order_id", savedOrder.getId());
            dataMap.put("total_price", savedOrder.getTotalPrice());
            try {
                ObjectMapper mapper = new ObjectMapper();
                notif.setDataJson(mapper.writeValueAsString(dataMap));
            } catch (Exception e) {
                notif.setDataJson("{}");
            }
            notificationRepository.save(notif);
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

        // Send delivery notification to customer
        if (savedOrder.getUser() != null) {
            Notification notif = new Notification();
            notif.setUser(savedOrder.getUser());
            notif.setType("approve"); // Map to green style in frontend or create new style
            notif.setTitle("📦 Đơn hàng #" + savedOrder.getId() + " đã giao thành công");
            notif.setMessage("Đơn hàng mã số #" + savedOrder.getId() + " của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!");
            
            Map<String, Object> dataMap = new HashMap<>();
            dataMap.put("order_id", savedOrder.getId());
            dataMap.put("total_price", savedOrder.getTotalPrice());
            try {
                ObjectMapper mapper = new ObjectMapper();
                notif.setDataJson(mapper.writeValueAsString(dataMap));
            } catch (Exception e) {
                notif.setDataJson("{}");
            }
            notificationRepository.save(notif);
        }

        return savedOrder;
    }

    @Transactional
    public void updatePaymentSuccess(Long orderId, String transactionNo) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order != null) {
            // Keep status as pending so admin can review and approve/cancel manually
            order.setPaymentStatus("PAID");
            order.setVnpTransactionNo(transactionNo);
            order.setPaidAt(LocalDateTime.now());
            orderRepository.save(order);
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

