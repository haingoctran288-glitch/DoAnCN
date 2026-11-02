package com.example.API_java.controller;

import com.example.API_java.entity.Order;
import com.example.API_java.entity.Booking;
import com.example.API_java.repository.BookingRepository;
import com.example.API_java.service.OrderService;
import com.example.API_java.service.VnPayService;
import com.example.API_java.service.MoMoService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private VnPayService vnPayService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private MoMoService moMoService;
    
    @Autowired
    private BookingRepository bookingRepository;

    // ============================================
    // VNPAY
    // ============================================

    @PostMapping("/vnpay/create")
    public ResponseEntity<?> createPayment(HttpServletRequest request, @RequestBody Map<String, Object> data) {
        try {
            Long orderId = Long.valueOf(data.get("orderId").toString());
            Order order = orderService.getOrderById(orderId);
            if (order == null) {
                return ResponseEntity.badRequest().body("Order not found");
            }

            String ipAddr = request.getRemoteAddr();
            String paymentUrl = vnPayService.createPaymentUrl(order, ipAddr);

            Map<String, String> response = new HashMap<>();
            response.put("paymentUrl", paymentUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/vnpay/create/booking")
    public ResponseEntity<?> createBookingPayment(HttpServletRequest request, @RequestBody Map<String, Object> data) {
        try {
            Integer bookingId = Integer.valueOf(data.get("bookingId").toString());
            Booking booking = bookingRepository.findById(bookingId).orElse(null);
            if (booking == null) {
                return ResponseEntity.badRequest().body("Booking not found");
            }

            String returnUrl = (String) data.get("returnUrl");
            String ipAddr = request.getRemoteAddr();
            String paymentUrl = vnPayService.createPaymentUrlForBooking(booking, ipAddr, returnUrl);

            Map<String, String> response = new HashMap<>();
            response.put("paymentUrl", paymentUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/vnpay/return")
    public ResponseEntity<?> handleVnPayReturn(@RequestParam Map<String, String> params) {
        try {
            System.out.println("VNPAY Return Params: " + params);
            boolean verify = vnPayService.verifyReturn(params);
            System.out.println("VNPAY Verify Result: " + verify);
            
            if (!verify) {
                return ResponseEntity.badRequest().body("Invalid checksum");
            }

            String orderIdStr = params.get("vnp_TxnRef");
            String responseCode = params.get("vnp_ResponseCode");
            String transactionNo = params.get("vnp_TransactionNo");

            if (orderIdStr.startsWith("B_")) {
                Integer bookingId = Integer.valueOf(orderIdStr.substring(2));
                Booking booking = bookingRepository.findById(bookingId).orElse(null);
                if (booking != null) {
                    if ("00".equals(responseCode)) {
                        booking.setStatus("PAID");
                        booking.setTransactionNo(transactionNo);
                        bookingRepository.save(booking);
                    } else {
                        // Thanh toán thất bại → xóa booking PENDING khỏi DB
                        bookingRepository.delete(booking);
                    }
                }
                return ResponseEntity.ok("00".equals(responseCode) ? "Payment Success" : "Payment Failed or Cancelled");
            } else {
                Long orderId = Long.valueOf(orderIdStr);
                if ("00".equals(responseCode)) {
                    orderService.updatePaymentSuccess(orderId, transactionNo);
                    return ResponseEntity.ok("Payment Success");
                } else {
                    orderService.updatePaymentFailed(orderId);
                    return ResponseEntity.ok("Payment Failed or Cancelled");
                }
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // ============================================
    // MOMO
    // ============================================

    @PostMapping("/momo/create")
    public ResponseEntity<?> createMoMoPayment(@RequestBody Map<String, Object> data) {
        try {
            Long orderId = Long.valueOf(data.get("orderId").toString());
            Order order = orderService.getOrderById(orderId);
            if (order == null) {
                return ResponseEntity.badRequest().body("Order not found");
            }

            String returnUrl = (String) data.get("returnUrl");
            Map<String, Object> responseFromMoMo = moMoService.createPayment(order, returnUrl);
            if (responseFromMoMo != null && responseFromMoMo.containsKey("payUrl")) {
                Map<String, String> response = new HashMap<>();
                response.put("paymentUrl", (String) responseFromMoMo.get("payUrl"));
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("Failed to generate MoMo URL");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/momo/create/booking")
    public ResponseEntity<?> createMoMoBookingPayment(@RequestBody Map<String, Object> data) {
        try {
            Integer bookingId = Integer.valueOf(data.get("bookingId").toString());
            Booking booking = bookingRepository.findById(bookingId).orElse(null);
            if (booking == null) {
                return ResponseEntity.badRequest().body("Booking not found");
            }

            String returnUrl = (String) data.get("returnUrl");
            System.out.println("MoMo Booking Payment for Booking ID: " + booking.getId() + " - Total Price: " + booking.getTotalPrice());
            Map<String, Object> responseFromMoMo = moMoService.createPaymentForBooking(booking, returnUrl);
            if (responseFromMoMo != null && responseFromMoMo.containsKey("payUrl")) {
                Map<String, String> response = new HashMap<>();
                response.put("paymentUrl", (String) responseFromMoMo.get("payUrl"));
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("Failed to generate MoMo URL");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/momo/return")
    public ResponseEntity<?> handleMoMoReturn(@RequestParam Map<String, String> params) {
        try {
            System.out.println("MOMO Return Params: " + params);
            
            // For MoMo, resultCode == "0" means success
            String resultCode = params.get("resultCode");
            String orderIdStr = params.get("orderId"); // MOMO1238912389
            String transactionNo = params.get("transId");
            // To get real order ID from our DB we need to parse orderInfo which we set as "Thanh toan don hang X"
            String orderInfo = params.get("orderInfo");
            Long realOrderId = null;
            if (orderInfo != null && orderInfo.contains(" ")) {
                String[] parts = orderInfo.split(" ");
                if (orderInfo.contains("dat lich")) {
                    Integer bookingId = Integer.valueOf(parts[parts.length - 1]);
                    Booking booking = bookingRepository.findById(bookingId).orElse(null);
                    if (booking != null) {
                        if ("0".equals(resultCode)) {
                            booking.setStatus("PAID");
                            booking.setTransactionNo(transactionNo);
                            bookingRepository.save(booking);
                        } else {
                            // Thanh toán thất bại → xóa booking PENDING khỏi DB
                            bookingRepository.delete(booking);
                        }
                    }
                    return ResponseEntity.ok("0".equals(resultCode) ? "Payment Success" : "Payment Failed");
                } else {
                    realOrderId = Long.valueOf(parts[parts.length - 1]);
                }
            }

            if ("0".equals(resultCode) && realOrderId != null) {
                orderService.updatePaymentSuccess(realOrderId, transactionNo);
                return ResponseEntity.ok("Payment Success");
            } else {
                if (realOrderId != null) {
                    orderService.updatePaymentFailed(realOrderId);
                }
                return ResponseEntity.ok("Payment Failed or Cancelled");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/momo/ipn")
    public ResponseEntity<?> handleMoMoIpn(@RequestBody Map<String, String> body) {
        try {
            System.out.println("MOMO IPN Received: " + body);
            String resultCode = body.get("resultCode");
            String orderInfo = body.get("orderInfo");
            String transactionNo = body.get("transId");

            Long realOrderId = null;
            if (orderInfo != null && orderInfo.contains(" ")) {
                String[] parts = orderInfo.split(" ");
                if (orderInfo.contains("dat lich")) {
                    Integer bookingId = Integer.valueOf(parts[parts.length - 1]);
                    Booking booking = bookingRepository.findById(bookingId).orElse(null);
                    if (booking != null) {
                        if ("0".equals(resultCode)) {
                            booking.setStatus("PAID");
                            booking.setTransactionNo(transactionNo);
                            bookingRepository.save(booking);
                        } else {
                            // Thanh toán thất bại → xóa booking PENDING khỏi DB
                            bookingRepository.delete(booking);
                        }
                    }
                    return ResponseEntity.noContent().build();
                } else {
                    realOrderId = Long.valueOf(parts[parts.length - 1]);
                }
            }

            if ("0".equals(resultCode) && realOrderId != null) {
                orderService.updatePaymentSuccess(realOrderId, transactionNo);
            } else if (realOrderId != null) {
                orderService.updatePaymentFailed(realOrderId);
            }
            
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
