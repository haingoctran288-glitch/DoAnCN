package com.example.API_java.controller;

import com.example.API_java.entity.User;
import com.example.API_java.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class FileUploadController {

    @Autowired
    private UserRepository userRepository;

    // Thư mục lưu ảnh trên server (dành cho staff)
    private static final String STAFF_UPLOAD_DIR = "staff";
    
    // Thư mục lưu ảnh dịch vụ
    private static final String SERVICE_UPLOAD_DIR = "services";

    // Thư mục lưu avatar khách hàng
    private static final String USER_UPLOAD_DIR = "users";

    // Thư mục lưu ảnh sản phẩm
    private static final String PRODUCT_UPLOAD_DIR = "products";

    // Thư mục lưu ảnh chat
    private static final String CHAT_UPLOAD_DIR = "chats";

    // Thư mục lưu ảnh kiến thức
    private static final String KNOWLEDGE_UPLOAD_DIR = "knowledge";

    private static final String NEWS_UPLOAD_DIR = "news";

    private File getUploadDir(String subDir) {
        File currentUploads = new File("uploads");
        File parentUploads = new File("../uploads");
        File baseDir = (!currentUploads.exists() && parentUploads.exists()) ? parentUploads : currentUploads;
        File targetDir = new File(baseDir, subDir);
        if (!targetDir.exists()) {
            targetDir.mkdirs();
        }
        return targetDir;
    }

    @PostMapping("/chat-image")
    public ResponseEntity<?> uploadChatImage(@RequestParam("file") MultipartFile file) {
        try {
            File uploadDir = getUploadDir(CHAT_UPLOAD_DIR);

            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }
            String newFileName = UUID.randomUUID().toString() + extension;

            Path filePath = uploadDir.toPath().resolve(newFileName);
            Files.write(filePath, file.getBytes());

            String fileUrl = "/uploads/chats/" + newFileName;
            return ResponseEntity.ok(Map.of("url", fileUrl));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Lỗi khi lưu ảnh chat: " + e.getMessage()));
        }
    }

    @PostMapping("/knowledge-image")
    public ResponseEntity<?> uploadKnowledgeImage(@RequestParam("file") MultipartFile file) {
        try {
            File uploadDir = getUploadDir(KNOWLEDGE_UPLOAD_DIR);

            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }
            String newFileName = UUID.randomUUID().toString() + extension;

            Path filePath = uploadDir.toPath().resolve(newFileName);
            Files.write(filePath, file.getBytes());

            String fileUrl = "/uploads/knowledge/" + newFileName;
            // CKEditor expects { "url": "..." } which this returns
            return ResponseEntity.ok(Map.of("url", fileUrl));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", Map.of("message", "Lỗi khi lưu ảnh: " + e.getMessage())));
        }
    }

    @PostMapping("/product-image")
    public ResponseEntity<?> uploadProductImage(@RequestParam("file") MultipartFile file) {
        try {
            File uploadDir = getUploadDir(PRODUCT_UPLOAD_DIR);

            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }
            String newFileName = UUID.randomUUID().toString() + extension;

            Path filePath = uploadDir.toPath().resolve(newFileName);
            Files.write(filePath, file.getBytes());

            String fileUrl = "/uploads/products/" + newFileName;
            return ResponseEntity.ok(Map.of("url", fileUrl));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Lỗi khi lưu ảnh sản phẩm: " + e.getMessage()));
        }
    }

    @PostMapping("/news-image")
    public ResponseEntity<?> uploadNewsImage(@RequestParam("file") MultipartFile file) {
        try {
            File uploadDir = getUploadDir(NEWS_UPLOAD_DIR);

            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }
            String newFileName = UUID.randomUUID().toString() + extension;

            Path filePath = uploadDir.toPath().resolve(newFileName);
            Files.write(filePath, file.getBytes());

            String fileUrl = "/uploads/news/" + newFileName;
            return ResponseEntity.ok(Map.of("url", fileUrl));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Lỗi khi lưu ảnh tin tức: " + e.getMessage()));
        }
    }

    @PostMapping("/staff-avatar")
    public ResponseEntity<?> uploadStaffAvatar(@RequestParam("file") MultipartFile file) {
        try {
            // Tạo thư mục nếu chưa có
            File uploadDir = getUploadDir(STAFF_UPLOAD_DIR);

            // Tạo tên file unique để tránh trùng
            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }
            String newFileName = UUID.randomUUID().toString() + extension;

            // Lưu file
            Path filePath = uploadDir.toPath().resolve(newFileName);
            Files.write(filePath, file.getBytes());

            // Trả về URL để truy cập ảnh
            String fileUrl = "/uploads/staff/" + newFileName;
            return ResponseEntity.ok(Map.of("url", fileUrl));

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Lỗi khi lưu ảnh: " + e.getMessage()));
        }
    }

    @PostMapping("/service-image")
    public ResponseEntity<?> uploadServiceImage(
            @RequestParam("file") MultipartFile file) {
        try {
            // Tạo thư mục nếu chưa có
            File uploadDir = getUploadDir(SERVICE_UPLOAD_DIR);

            // Tạo tên file unique để tránh trùng
            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }
            String newFileName = UUID.randomUUID().toString() + extension;

            // Lưu file
            Path filePath = uploadDir.toPath().resolve(newFileName);
            Files.write(filePath, file.getBytes());

            // Trả về URL để truy cập ảnh
            String fileUrl = "/uploads/services/" + newFileName;
            return ResponseEntity.ok(Map.of("url", fileUrl));

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Lỗi khi lưu ảnh dịch vụ: " + e.getMessage()));
        }
    }

    /**
     * POST /api/upload/user-avatar
     * Upload avatar cho user đang đăng nhập, lưu file lên server + cập nhật cột avatar trong DB
     */
    @PostMapping("/user-avatar")
    public ResponseEntity<?> uploadUserAvatar(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));

            // Tạo thư mục nếu chưa có
            File uploadDir = getUploadDir(USER_UPLOAD_DIR);

            // Tạo tên file unique
            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }
            String newFileName = UUID.randomUUID().toString() + extension;

            // Lưu file vào disk
            Path filePath = uploadDir.toPath().resolve(newFileName);
            Files.write(filePath, file.getBytes());

            // Cập nhật avatar URL vào DB
            String fileUrl = "/uploads/users/" + newFileName;
            user.setAvatar(fileUrl);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("url", fileUrl));

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Lỗi khi lưu avatar: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/upload/user-avatar
     * Xóa avatar của user đang đăng nhập
     */
    @DeleteMapping("/user-avatar")
    public ResponseEntity<?> removeUserAvatar(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));

        user.setAvatar(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Đã xóa avatar"));
    }
}

