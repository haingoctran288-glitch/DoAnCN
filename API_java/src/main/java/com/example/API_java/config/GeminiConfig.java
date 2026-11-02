package com.example.API_java.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@Configuration
public class GeminiConfig {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model:gemini-2.5-flash}")
    private String model;

    public String getApiKey() {
        return apiKey;
    }

    public String getModel() {
        return model;
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
