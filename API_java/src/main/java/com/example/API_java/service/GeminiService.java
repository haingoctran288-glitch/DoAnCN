package com.example.API_java.service;

import com.example.API_java.config.GeminiConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class GeminiService {

    @Autowired
    private GeminiConfig geminiConfig;

    @Autowired
    private RestTemplate restTemplate;

    private Properties loadLiveProperties() {
        Properties props = new Properties();
        String[] paths = {
            "src/main/resources/application.properties",
            "API_java/src/main/resources/application.properties"
        };
        for (String p : paths) {
            File f = new File(p);
            if (f.exists()) {
                try (InputStreamReader reader = new InputStreamReader(new FileInputStream(f), StandardCharsets.UTF_8)) {
                    props.load(reader);
                    break;
                } catch (Exception ignored) {
                }
            }
        }
        return props;
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    public String generateContent(List<Map<String, Object>> contents, String systemInstruction) {
        Properties liveProps = loadLiveProperties();
        String apiKey = liveProps.getProperty("gemini.api.key", geminiConfig.getApiKey());
        if (apiKey == null || apiKey.trim().isEmpty()) {
            apiKey = geminiConfig.getApiKey();
        }
        if (apiKey == null || apiKey.trim().isEmpty()) {
            String[] keyFiles = {".env.gemini", "API_java/.env.gemini"};
            for (String kf : keyFiles) {
                File f = new File(kf);
                if (f.exists()) {
                    try {
                        apiKey = java.nio.file.Files.readString(f.toPath(), StandardCharsets.UTF_8).trim();
                        if (!apiKey.isEmpty()) break;
                    } catch (Exception ignored) {
                    }
                }
            }
        }
        apiKey = apiKey != null ? apiKey.trim() : "";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();

        if (systemInstruction != null && !systemInstruction.isEmpty()) {
            Map<String, Object> systemContent = new HashMap<>();
            systemContent.put("parts", Collections.singletonList(Collections.singletonMap("text", systemInstruction)));
            requestBody.put("systemInstruction", systemContent);
        }

        requestBody.put("contents", contents);

        Map<String, Object> safetySetting = new HashMap<>();
        safetySetting.put("category", "HARM_CATEGORY_DANGEROUS_CONTENT");
        safetySetting.put("threshold", "BLOCK_NONE");
        requestBody.put("safetySettings", Collections.singletonList(safetySetting));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        // Danh sách các model ưu tiên và dự phòng tự động nếu Google quá tải (503) hoặc ngừng hỗ trợ model cũ (404)
        String[] fallbackModels = {
            "gemini-3.5-flash",
            "gemini-3.1-flash-lite",
            "gemini-3-flash-preview",
            "gemini-3.8-flash"
        };

        for (String model : fallbackModels) {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey;
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
                System.err.println("Gemini API Warning [" + model + "]: " + e.getMessage());
            }
        }

        return "Xin lỗi, AI hiện đang bận.\nVui lòng thử lại sau.";
    }
}
