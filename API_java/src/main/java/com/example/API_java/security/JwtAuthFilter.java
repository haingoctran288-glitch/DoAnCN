package com.example.API_java.security;

import com.example.API_java.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter chạy trước mỗi request để kiểm tra JWT Token
 * Nếu token hợp lệ → set Authentication vào SecurityContext
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 1. Lấy header Authorization
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        try {
            // 2. Kiểm tra header có bắt đầu bằng "Bearer " không
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7); // Cắt bỏ "Bearer " lấy token thuần
                username = jwtUtil.extractUsername(token);
            }

            // 3. Nếu có username và chưa có authentication trong context
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // 4. Validate token
                if (jwtUtil.validateToken(token)) {
                    if (!userDetails.isAccountNonLocked()) {
                        String reason = "Vi phạm chính sách";
                        if (userDetails instanceof CustomUserDetails) {
                            String dbReason = ((CustomUserDetails) userDetails).getUser().getBlockedReason();
                            if (dbReason != null && !dbReason.trim().isEmpty()) {
                                reason = dbReason.replace("\"", "\\\"");
                            }
                        }
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType("application/json;charset=UTF-8");
                        response.getWriter().write("{\"message\": \"Tài khoản của bạn đã bị khóa.\", \"reason\": \"" + reason + "\"}");
                        return; // Ngừng xử lý request
                    }

                    // 5. Tạo authentication token và set vào context
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            System.err.println("JWT Filter Error: " + e.getMessage());
        }

        // 6. Cho request đi tiếp
        filterChain.doFilter(request, response);
    }
}
