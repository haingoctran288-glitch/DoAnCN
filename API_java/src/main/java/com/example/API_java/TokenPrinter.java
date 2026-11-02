package com.example.API_java;

import com.example.API_java.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class TokenPrinter implements CommandLineRunner {
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void run(String... args) throws Exception {
        System.out.println(">>> ADMINQL TOKEN: " + jwtUtil.generateToken("adminql"));
    }
}
