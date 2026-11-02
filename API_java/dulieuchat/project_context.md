# PROJECT CONTEXT - Hornet Royale (Đồ Án Chuyên Ngành - DACN)

## 1. Tên Dự Án và Mục Tiêu
- **Tên dự án:** HORNET ROYALE - Hệ Thống Quản Lý Barbershop & Store Toàn Diện (Đồ án Chuyên Ngành - ĐACN).
- **Mục tiêu:** Xây dựng một nền tảng toàn diện tích hợp cả đặt lịch hẹn dịch vụ (Booking) và mua sắm sản phẩm (E-commerce). Hệ thống cung cấp trải nghiệm cao cấp cho khách hàng với giao diện "Dark Luxury" và một trang quản trị (Admin Dashboard) mạnh mẽ để quản lý lịch hẹn, đơn hàng, khách hàng, nhân sự/tính lương (Payroll), Chatbot AI và hệ thống khuyến mãi (Voucher) tự động.

## 2. Công Nghệ, Ngôn Ngữ và Thư Viện Sử Dụng

### 2.1 Backend (Java Spring Boot)
- **Ngôn ngữ & Framework:** Java 17, Spring Boot 3.5.x
- **Database:** MySQL (`barber_shop`), Spring Data JPA, Hibernate.
- **Security:** Spring Security, JWT (JSON Web Tokens) cho phân quyền và bảo mật API.
- **Tiện ích/Thư viện khác:** 
  - `Lombok` (giảm boilerplate code).
  - `JavaMailSender` (gửi OTP/Email tự động).
  - Tích hợp thanh toán cổng thứ 3: **VNPAY** và **MoMo**.
  - Tích hợp **Google Gemini AI** cho trợ lý ảo tư vấn khách hàng.

### 2.2 Frontend (Customer & Admin)
- **Ngôn ngữ & Framework:** JavaScript/JSX, React 19 (build bằng Vite 8).
- **Quản lý state & API:** Context API (CartContext, ToastContext), Axios.
- **Routing:** React Router DOM v7.
- **UI & Styling:** 
  - **Trang Khách hàng (`DACN\frontend`):** TailwindCSS, Lucide-React (icons), Framer Motion, AOS, phong cách thiết kế cao cấp, tối màu (Dark Theme, Gold/Accent `#d4af37` highlights).
  - **Trang Quản trị (`DACN\admin QL`):** Ant Design v6, Recharts (biểu đồ thống kê), CKEditor 5, Lucide-React, xuất báo cáo PDF/Word (`jspdf`, `docx`).

---

## 3. Cấu Trúc Thư Mục Chính (`DACN`)

Hệ thống được gom trong thư mục gốc `DACN` gồm 3 module chính và thư mục lưu trữ:

### 3.1 Backend (`DACN\API_java`)
- `src/main/java/com/example/API_java/`
  - `controller/`: Chứa các REST API endpoint (`AuthController`, `VoucherController`, `BookingController`, `OrderController`, `FileUploadController`,...).
  - `service/` & `service/impl/`: Chứa business logic (`AuthServiceImpl`, `VoucherService`,...).
  - `repository/`: Các Interface thao tác với cơ sở dữ liệu qua JPA.
  - `entity/`: Các Class ánh xạ với các bảng trong MySQL (`User`, `Voucher`, `CustomerVoucher`, `Order`,...).
  - `dto/`: Các Data Transfer Object để nhận/trả payload (`LoginRequest`, `ResetPasswordRequest`,...).
  - `config/`: Cấu hình hệ thống (`SecurityConfig`, `WebConfig` ánh xạ tĩnh cho `uploads/`).
  - `scheduler/`: Các tác vụ chạy ngầm (`VoucherScheduler`).
  - `security/` & `util/`: Bảo mật JWT (`JwtAuthFilter`, `CustomUserDetailsService`, `EmailService`).

### 3.2 Frontend Khách Hàng (`DACN\frontend`)
- `src/`
  - `pages/`: Màn hình giao diện (`Home`, `Login`, `Register`, `Checkout`, `BookingPage`, `Profile`, `Orders`,...).
  - `components/`: Các component tái sử dụng (`AddressBookModal`, `VoucherWalletModal`, `ChangePassModal`,...).
  - `context/`: Quản lý state toàn cục.
  - `api/`: Các hàm gọi API config qua Axios (`http://localhost:8080`).

### 3.3 Frontend Quản Trị (`DACN\admin QL`)
- `src/`
  - `pages/`: Màn hình quản lý (`Dashboard`, `Vouchers`, `Orders`, `Customers`, `Payroll`,...).
  - `components/`: Component dành riêng cho trang admin.
  - `api/`: Mapping REST endpoints tới Backend.

### 3.4 Lưu Trữ & CSDL (`DACN\uploads` & `barber_shop.sql`)
- `uploads/`: Chứa hình ảnh tĩnh (`staff/`, `services/`, `users/`, `products/`, `chats/`, `news/`, `knowledge/`).
- `barber_shop.sql`: File kịch bản cơ sở dữ liệu MySQL.

---

## 4. Các Tính Năng & Logic Hoạt Động Quan Trọng Đã Hoàn Thiện

1. **Hệ thống Xác thực (Authentication) & Bảo mật:**
   - **Login/Register:** Đăng ký bằng email, đăng nhập bằng Username. Password được mã hóa bằng BCrypt.
   - **OTP Email:** Tích hợp quy trình Quên mật khẩu và Đổi mật khẩu. Mã OTP 6 số được tạo và gửi qua email. Có cơ chế chống Spam.
   - **Bảo vệ quyền truy cập:** Backend kiểm tra JWT token hợp lệ thông qua `Bearer Token` trong headers.

2. **Hệ thống Quản lý Khuyến mãi & Voucher Động:**
   - **Core Logic:** Voucher được chia làm nhiều loại (`PERCENTAGE`, `FIXED`, `FREE_SERVICE`) và có phạm vi áp dụng (`SERVICE`, `PRODUCT`, `ALL`).
   - **Phát hành Tự động (Campaigns):** Hỗ trợ phân phát voucher khi có Khách hàng mới đăng ký (`NEW_REGISTER`), hạng thẻ (`MEMBERSHIP`), và phát hành **Voucher Sinh nhật** theo tháng sinh.
   - **Ví Voucher (Customer Wallet):** Lọc voucher theo trạng thái "Khả dụng", "Đã dùng", "Hết hạn". Tự động tính toán số tiền giảm tối đa và hiển thị rõ ràng thông tin quy đổi.

3. **Booking, E-commerce & Thanh Toán:**
   - Đặt lịch chọn Barber, dịch vụ, khung giờ trống; tính lương và hoa hồng (Payroll) tự động cho nhân viên.
   - Giỏ hàng sản phẩm và tính năng `Buy Now`, kết nối cổng thanh toán **VNPAY** và **MoMo** Sandbox.

---

## 5. Quy Tắc Viết Code (Coding Style / Conventions)

1. **API Design (Backend):**
   - Tuân thủ RESTful API: Sử dụng đúng HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).
   - Sử dụng `ResponseEntity<?>` trả về JSON với cấu trúc rõ ràng.
2. **React Components (Frontend):**
   - Viết functional components, sử dụng hooks (`useState`, `useEffect`, `useContext`).
   - Xử lý dữ liệu an toàn trước khi render (fallback `|| 0`, kiểm tra `null/undefined`).
3. **UI/UX Aesthetics:**
   - Giao diện người dùng hướng tới tông tối/sang trọng (vàng kim `#d4af37` kết hợp nền đen/xám đậm).

---

## 6. Quy Trình Cập Nhật Lên GitHub (Git Workflow)

1. **Repository Info:**
   - **GitHub Repository (Đồ án Chuyên ngành - DoAnCN):** `https://github.com/haingoctran288-glitch/DoAnCN.git`
2. **Kiểm tra trạng thái thay đổi:** `git status`
3. **Đưa tệp tin vào Staging:** `git add .`
4. **Tạo commit với thông điệp rõ ràng:** `git commit -m "feat/fix: nội dung thay đổi"`
5. **Đẩy thay đổi lên GitHub:** `git push -u origin main`
