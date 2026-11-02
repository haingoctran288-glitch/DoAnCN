package com.example.API_java.service;

import com.example.API_java.config.MoMoConfig;
import com.example.API_java.entity.Order;
import com.example.API_java.util.MoMoUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class MoMoService {

    @Autowired
    private MoMoConfig moMoConfig;

    public Map<String, Object> createPayment(Order order, String dynamicReturnUrl) {
        String partnerCode = moMoConfig.getPartnerCode();
        String accessKey = moMoConfig.getAccessKey();
        String secretKey = moMoConfig.getSecretKey();
        
        String orderInfo = "Thanh toan don hang " + order.getId();
        String redirectUrl = (dynamicReturnUrl != null && !dynamicReturnUrl.isEmpty()) ? dynamicReturnUrl : moMoConfig.getRedirectUrl();
        String ipnUrl = moMoConfig.getIpnUrl();
        long amount = Math.round(order.getTotalPrice());
        String amountStr = String.valueOf(amount);
        String orderId = "MOMO" + System.currentTimeMillis();
        String requestId = orderId;
        String extraData = "";
        String requestType = "payWithMethod";

        // Build raw signature (dùng String cho signature)
        String rawSignature = "accessKey=" + accessKey
                + "&amount=" + amountStr
                + "&extraData=" + extraData
                + "&ipnUrl=" + ipnUrl
                + "&orderId=" + orderId
                + "&orderInfo=" + orderInfo
                + "&partnerCode=" + partnerCode
                + "&redirectUrl=" + redirectUrl
                + "&requestId=" + requestId
                + "&requestType=" + requestType;

        String signature = MoMoUtility.buildHmacSHA256(rawSignature, secretKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("partnerCode", partnerCode);
        requestBody.put("partnerName", "Test");
        requestBody.put("storeId", "MomoTestStore");
        requestBody.put("requestId", requestId);
        requestBody.put("amount", amount);
        requestBody.put("orderId", orderId);
        requestBody.put("orderInfo", orderInfo);
        requestBody.put("redirectUrl", redirectUrl);
        requestBody.put("ipnUrl", ipnUrl);
        requestBody.put("lang", "vi");
        requestBody.put("requestType", requestType);
        requestBody.put("autoCapture", true);
        requestBody.put("extraData", extraData);
        requestBody.put("orderGroupId", "");
        requestBody.put("signature", signature);

        System.out.println("MoMo Request Body: " + requestBody);

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(moMoConfig.getApiUrl(), entity, Map.class);
            return response.getBody();
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            System.err.println("MoMo Error Response: " + e.getResponseBodyAsString());
            throw new RuntimeException("Lỗi từ MoMo: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi kết nối MoMo: " + e.getMessage());
        }
    }

    public Map<String, Object> createPaymentForBooking(com.example.API_java.entity.Booking booking, String dynamicReturnUrl) {
        String partnerCode = moMoConfig.getPartnerCode();
        String accessKey = moMoConfig.getAccessKey();
        String secretKey = moMoConfig.getSecretKey();
        
        String orderInfo = "Thanh toan dat lich " + booking.getId();
        String redirectUrl = (dynamicReturnUrl != null && !dynamicReturnUrl.isEmpty()) ? dynamicReturnUrl : moMoConfig.getRedirectUrl();
        String ipnUrl = moMoConfig.getIpnUrl();
        long amount = Math.round(booking.getTotalPrice().doubleValue());
        String amountStr = String.valueOf(amount);
        String orderId = "MOMO_B" + System.currentTimeMillis() + "_" + booking.getId();
        String requestId = orderId;
        String extraData = "";
        String requestType = "payWithMethod";

        // Build raw signature (dùng String cho signature)
        String rawSignature = "accessKey=" + accessKey
                + "&amount=" + amountStr
                + "&extraData=" + extraData
                + "&ipnUrl=" + ipnUrl
                + "&orderId=" + orderId
                + "&orderInfo=" + orderInfo
                + "&partnerCode=" + partnerCode
                + "&redirectUrl=" + redirectUrl
                + "&requestId=" + requestId
                + "&requestType=" + requestType;

        String signature = MoMoUtility.buildHmacSHA256(rawSignature, secretKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("partnerCode", partnerCode);
        requestBody.put("partnerName", "Test");
        requestBody.put("storeId", "MomoTestStore");
        requestBody.put("requestId", requestId);
        requestBody.put("amount", amount);
        requestBody.put("orderId", orderId);
        requestBody.put("orderInfo", orderInfo);
        requestBody.put("redirectUrl", redirectUrl);
        requestBody.put("ipnUrl", ipnUrl);
        requestBody.put("lang", "vi");
        requestBody.put("requestType", requestType);
        requestBody.put("autoCapture", true);
        requestBody.put("extraData", extraData);
        requestBody.put("orderGroupId", "");
        requestBody.put("signature", signature);

        System.out.println("MoMo Request Body (Booking): " + requestBody);

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(moMoConfig.getApiUrl(), entity, Map.class);
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean refundPayment(com.example.API_java.entity.Booking booking) {
        try {
            String partnerCode = moMoConfig.getPartnerCode();
            String accessKey = moMoConfig.getAccessKey();
            String secretKey = moMoConfig.getSecretKey();

            String orderId = "RF_" + booking.getId() + "_" + System.currentTimeMillis();
            String requestId = orderId;
            long amount = Math.round(booking.getTotalPrice().doubleValue());
            String transId = booking.getTransactionNo();
            String lang = "vi";
            String description = "Hoan tien dat lich #" + booking.getId();

            String rawSignature = "accessKey=" + accessKey
                    + "&amount=" + amount
                    + "&description=" + description
                    + "&orderId=" + orderId
                    + "&partnerCode=" + partnerCode
                    + "&requestId=" + requestId
                    + "&transId=" + transId;

            String signature = MoMoUtility.buildHmacSHA256(rawSignature, secretKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("partnerCode", partnerCode);
            requestBody.put("orderId", orderId);
            requestBody.put("requestId", requestId);
            requestBody.put("amount", amount);
            requestBody.put("transId", transId);
            requestBody.put("lang", lang);
            requestBody.put("description", description);
            requestBody.put("signature", signature);

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            String refundUrl = "https://test-payment.momo.vn/v2/gateway/api/refund";
            ResponseEntity<Map> response = restTemplate.postForEntity(refundUrl, entity, Map.class);
            
            Map<String, Object> body = response.getBody();
            if (body != null) {
                Integer resultCode = (Integer) body.get("resultCode");
                System.out.println("MoMo Refund Response: " + body);
                return resultCode != null && resultCode == 0;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    public boolean refundOrder(Order order) {
        try {
            String partnerCode = moMoConfig.getPartnerCode();
            String accessKey = moMoConfig.getAccessKey();
            String secretKey = moMoConfig.getSecretKey();

            String orderId = "RF_O_" + order.getId() + "_" + System.currentTimeMillis();
            String requestId = orderId;
            long amount = Math.round(order.getTotalPrice());
            String transId = order.getVnpTransactionNo(); // Assuming VNPTransactionNo stores MoMo transId as well, or you might need a dedicated field
            
            // If transId is empty/null, refund can't proceed. In a real system, you'd store the MoMo transId properly.
            if(transId == null || transId.isEmpty()) {
                System.out.println("MoMo Refund Error: Transaction ID is missing for Order #" + order.getId());
                return false;
            }

            String lang = "vi";
            String description = "Hoan tien don hang #" + order.getId();

            String rawSignature = "accessKey=" + accessKey
                    + "&amount=" + amount
                    + "&description=" + description
                    + "&orderId=" + orderId
                    + "&partnerCode=" + partnerCode
                    + "&requestId=" + requestId
                    + "&transId=" + transId;

            String signature = MoMoUtility.buildHmacSHA256(rawSignature, secretKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("partnerCode", partnerCode);
            requestBody.put("orderId", orderId);
            requestBody.put("requestId", requestId);
            requestBody.put("amount", amount);
            requestBody.put("transId", transId);
            requestBody.put("lang", lang);
            requestBody.put("description", description);
            requestBody.put("signature", signature);

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            String refundUrl = "https://test-payment.momo.vn/v2/gateway/api/refund";
            ResponseEntity<Map> response = restTemplate.postForEntity(refundUrl, entity, Map.class);
            
            Map<String, Object> body = response.getBody();
            if (body != null) {
                Integer resultCode = (Integer) body.get("resultCode");
                System.out.println("MoMo Order Refund Response: " + body);
                return resultCode != null && resultCode == 0;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
