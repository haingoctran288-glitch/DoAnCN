package com.example.API_java.config;

import com.example.API_java.security.CustomUserDetailsService;
import com.example.API_java.security.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Cấu hình Spring Security:
 * - Tắt CSRF (vì dùng JWT, không dùng session)
 * - Cho phép truy cập /api/auth/** không cần đăng nhập
 * - Các API khác yêu cầu xác thực
 * - Cấu hình CORS cho React (localhost:5173)
 */
@Configuration
@EnableWebSecurity
@org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    // Mã hoá password bằng BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Cấu hình AuthenticationProvider sử dụng DB
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    // Expose AuthenticationManager để sử dụng trong Service
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Cấu hình CORS - Cho phép React gọi API
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:5174", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // Cấu hình Security Filter Chain
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Bật CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Tắt CSRF (không cần vì dùng JWT)
            .csrf(csrf -> csrf.disable())
            // Cấu hình quyền truy cập
            .authorizeHttpRequests(auth -> auth
                // Cho phép truy cập tự do các endpoint auth
                .requestMatchers("/api/auth/**").permitAll()
                // Admin panel: cho phép truy cập API khách hàng không cần JWT  
                .requestMatchers("/api/customers/**").permitAll()
                // API Sản phẩm cho cửa hàng
                .requestMatchers("/api/products/**").permitAll()
                // API Đơn hàng
                .requestMatchers("/api/orders/**").permitAll()
                // API Thanh toán VNPAY
                .requestMatchers("/api/payment/**").permitAll()
                // API Sổ Địa Chỉ
                .requestMatchers("/api/addresses/**").permitAll()
                // API Dashboard
                .requestMatchers("/api/dashboard/**").permitAll()
                // API Danh Mục
                .requestMatchers("/api/categories/**").permitAll()
                // API Dịch vụ & Đặt lịch
                .requestMatchers("/api/services/**").permitAll()
                .requestMatchers("/api/service-groups/**").permitAll()
                .requestMatchers("/api/staff/**").permitAll()
                .requestMatchers("/api/upload/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/bookings/**").permitAll()
                .requestMatchers("/api/notifications/**").permitAll()
                .requestMatchers("/api/news/**").permitAll()
                .requestMatchers("/api/vouchers/**").permitAll()
                .requestMatchers("/api/reviews/**").permitAll()
                .requestMatchers("/api/chats/**").permitAll()
                .requestMatchers("/api/chat/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/knowledge/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN")
                // Tất cả các request khác phải đăng nhập
                .anyRequest().authenticated()
            )
            // Không dùng session (stateless vì dùng JWT)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            // Đăng ký AuthenticationProvider
            .authenticationProvider(authenticationProvider())
            // Thêm JWT Filter trước filter mặc định của Spring
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}


