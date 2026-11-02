package com.example.API_java.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VnPayConfig {

    @Value("${vnpay.tmnCode:X1GTI745}")
    private String tmnCode;

    @Value("${vnpay.hashSecret:HWGYRNZWGOQZDQKRMWGGVEWYWGIHSEZR}")
    private String hashSecret;

    @Value("${vnpay.url:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    private String vnpUrl;

    @Value("${vnpay.returnUrl:http://localhost:5173/payment-return}")
    private String returnUrl;

    public String getTmnCode() {
        return tmnCode != null ? tmnCode.trim() : "X1GTI745";
    }

    public String getHashSecret() {
        return hashSecret != null ? hashSecret.trim() : "HWGYRNZWGOQZDQKRMWGGVEWYWGIHSEZR";
    }

    public String getVnpUrl() {
        return vnpUrl != null ? vnpUrl.trim() : "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    }

    public String getReturnUrl() {
        return returnUrl != null ? returnUrl.trim() : "http://localhost:5173/payment-return";
    }
}
