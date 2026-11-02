package com.example.API_java.service;

import com.example.API_java.config.GeminiConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class GeminiService {

    @Autowired
    private GeminiConfig geminiConfig;

    @Autowired
    private RestTemplate restTemplate;

    public String generateContent(List<Map<String, Object>> contents, String systemInstruction) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + geminiConfig.getModel() + ":generateContent?key=" + geminiConfig.getApiKey();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        
        if (systemInstruction != null && !systemInstruction.isEmpty()) {
            Map<String, Object> systemContent = new HashMap<>();
            systemContent.put("parts", Collections.singletonList(Collections.singletonMap("text", systemInstruction)));
            requestBody.put("systemInstruction", systemContent);
        }

        requestBody.put("contents", contents);

        // Security configuration
        Map<String, Object> safetySetting = new HashMap<>();
        safetySetting.put("category", "HARM_CATEGORY_DANGEROUS_CONTENT");
        safetySetting.put("threshold", "BLOCK_NONE");
        requestBody.put("safetySettings", Collections.singletonList(safetySetting));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
        }
        
        return "Xin lỗi, AI hiện đang bận.\nVui lòng thử lại sau.";
    }
}
