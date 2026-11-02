package com.example.API_java.controller;

import com.example.API_java.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*") // Allows calls from frontend
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, Object> payload) {
        try {
            List<Map<String, String>> history = (List<Map<String, String>>) payload.get("history");
            String message = (String) payload.get("message");
            
            if (history == null || history.isEmpty()) {
                history = new java.util.ArrayList<>();
                Map<String, String> msg = new HashMap<>();
                msg.put("role", "user");
                msg.put("content", message);
                history.add(msg);
            }
            
            String response = chatService.processChat(history);
            
            Map<String, String> res = new HashMap<>();
            res.put("reply", response);
            
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("reply", "Xin lỗi, AI hiện đang bận.\nVui lòng thử lại sau.");
            return ResponseEntity.status(500).body(error);
        }
    }
}
