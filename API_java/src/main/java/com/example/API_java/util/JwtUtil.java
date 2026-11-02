package com.example.API_java.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/**
 * Utility class để tạo và xác thực JWT Token
 */
@Component
public class JwtUtil {

    // Đọc secret key từ application.properties
    @Value("${jwt.secret}")
    private String secretKey;

    // Đọc thời gian hết hạn từ application.properties (mặc định 24h = 86400000ms)
    @Value("${jwt.expiration}")
    private long expiration;

    // Tạo signing key từ secret string
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    /**
     * Tạo JWT Token từ username
     */
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)                                   // Đặt username làm subject
                .setIssuedAt(new Date())                                // Thời gian phát hành
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // Thời gian hết hạn
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)    // Ký bằng HMAC SHA-256
                .compact();
    }

    /**
     * Trích xuất username từ token
     */
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Kiểm tra token có hợp lệ không
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // Token không hợp lệ hoặc đã hết hạn
            return false;
        }
    }
}
