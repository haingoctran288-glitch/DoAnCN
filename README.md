# 💈 HORNET ROYALE - Hệ Thống Quản Lý Barbershop & Store Toàn Diện

![Hornet Royale Banner](https://placehold.co/1200x400/111111/d4af37?text=HORNET+ROYALE+-+BARBERSHOP+%26+STORE)

<div align="center">
  <img src="https://img.shields.io/badge/Backend-Spring_Boot-6DB33F?style=for-the-badge&logo=springboot" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/ORM-Hibernate-59666C?style=for-the-badge&logo=hibernate" alt="Hibernate" />
</div>
<br>

**Đồ án Chuyên Ngành (ĐACN)**
- **Sinh viên thực hiện:** Trần Ngọc Hải
- **MSSV:** 2123110179
- **Công nghệ:** Spring Boot (Java), ReactJS, Tailwind CSS, Ant Design, MySQL.

---

## 🎯 Lý do chọn đề tài & Mục tiêu dự án
Trong bối cảnh ngành dịch vụ làm đẹp và chăm sóc cá nhân (đặc biệt là nam giới) đang phát triển mạnh mẽ, các mô hình Barbershop truyền thống gặp nhiều khó khăn trong việc tối ưu hóa quy trình quản lý lịch hẹn, chấm công nhân sự, và mở rộng bán lẻ sản phẩm. 

Dự án **Hornet Royale** được phát triển nhằm mục tiêu:
1. **Số hóa quy trình:** Thay thế sổ sách thủ công bằng một hệ thống đặt lịch tự động, chống trùng lịch và nhắc lịch thông minh.
2. **Quản trị tập trung:** Tích hợp cả dịch vụ (cắt tóc, làm đẹp) và bán lẻ (Store) vào cùng một hệ thống duy nhất.
3. **Tự động hóa nhân sự:** Áp dụng hệ thống Payroll tính toán tự động lương cứng, hoa hồng dịch vụ, và phụ cấp cho từng Barber.
4. **Trải nghiệm khách hàng:** Cung cấp giao diện đặt lịch sang trọng, trực quan, cùng trợ lý ảo AI hỗ trợ giải đáp thắc mắc 24/7.

---

## 📖 Giới thiệu phân hệ
Hệ thống được chia làm 3 module chính liên kết chặt chẽ với nhau:
1. **Frontend (Website Khách hàng):** Nơi khách hàng đặt lịch cắt tóc, mua sắm sản phẩm chăm sóc tóc, xem tin tức/kiến thức, đánh giá sản phẩm/dịch vụ, và chat với AI.
2. **Admin Panel (Trang Quản trị):** Dành cho Quản lý và Chủ cửa hàng để theo dõi lịch đặt, duyệt đơn hàng, quản lý nhân sự, tính lương (payroll), tạo mã giảm giá (voucher), và theo dõi thống kê doanh thu.
3. **Backend (API Server):** Trái tim của hệ thống, xử lý toàn bộ logic nghiệp vụ bằng Spring Boot, cung cấp RESTful APIs và bảo vệ dữ liệu bằng JWT.

---

## 🛠 Cấu trúc cây thư mục (Project Directory Tree)
```text
📦 DACN
 ┣ 📂 API_java/                 # [BACKEND] Chứa mã nguồn Spring Boot
 ┃ ┣ 📂 src/main/java/          # Code Logic (Controller, Service, Repository, Entity,...)
 ┃ ┣ 📂 src/main/resources/     # Cấu hình Database, Mail, VNPAY, MOMO (application.properties)
 ┃ ┗ 📜 pom.xml                 # Cấu hình thư viện Maven
 ┃
 ┣ 📂 admin QL/                 # [ADMIN CMS] Giao diện quản trị cho Admin/Staff
 ┃ ┣ 📂 src/components/         # Các Component dùng chung (Navbar, Sidebar, Recharts...)
 ┃ ┣ 📂 src/pages/              # Các trang giao diện (Dashboard, Payroll, Đơn hàng, Lịch đặt...)
 ┃ ┗ 📜 package.json            # Cấu hình thư viện Node.js (Vite, Ant Design)
 ┃
 ┣ 📂 frontend/                 # [STORE FRONTEND] Website dành cho Khách hàng
 ┃ ┣ 📂 src/pages/              # Trang chủ, Chi tiết sản phẩm, Đặt lịch, Giỏ hàng...
 ┃ ┣ 📂 src/context/            # State Management (Cart, Auth, Toast...)
 ┃ ┗ 📜 tailwind.config.js      # Cấu hình CSS Tailwind, Dark mode
 ┃
 ┣ 📂 uploads/                  # [STORAGE] Thư mục chứa file hình ảnh được upload từ website
 ┣ 📜 .gitignore                # File chặn đẩy các thư mục rác lên Git
 ┗ 📜 README.md                 # Tài liệu hướng dẫn (File bạn đang đọc)
```

---

## ⚙️ Yêu cầu môi trường (Prerequisites)
Để chạy dự án trên môi trường Local, bạn cần cài đặt:
- **Java:** JDK 17
- **Node.js:** Phiên bản 16.x hoặc 18.x (khuyến nghị 18 LTS)
- **Database:** MySQL Server (8.x)
- **IDE:** IntelliJ IDEA (cho Backend) và VS Code (cho Frontend/Admin)

---

## 🚀 Hướng dẫn cài đặt và chạy dự án (How to run)

### Bước 1: Khởi tạo Database
1. Mở MySQL/phpMyAdmin, tạo một database mới tên là `barber_shop`.
2. Hệ thống Spring Boot đã được cấu hình `spring.jpa.hibernate.ddl-auto=update` nên sẽ tự động tạo bảng khi khởi chạy lần đầu.

### Bước 2: Cấu hình API Key cho Chatbot AI (🚨 Quan Trọng)
Tính năng **Trợ lý ảo AI Chatbot** của dự án yêu cầu phải có API Key của Google Gemini. Do lý do bảo mật, API Key gốc không được đưa lên Github. 
> 💡 **Dành cho Thầy/Cô chấm bài:** 
> Vui lòng mở file `API_java/src/main/resources/application.properties`, tìm dòng số 67 (`gemini.api.key=...`) và thay thế bằng API Key thật do sinh viên cung cấp để chức năng Chatbot hoạt động.

### Bước 3: Chạy Backend (Spring Boot)
1. Mở Terminal / Command Prompt và di chuyển vào thư mục `API_java`.
2. Mở dự án bằng IntelliJ IDEA hoặc chạy trực tiếp bằng Maven:
   ```bash
   cd API_java
   mvn spring-boot:run
   ```
3. Backend sẽ khởi chạy tại cổng **8080** (`http://localhost:8080`).

### Bước 4: Chạy Frontend (Website Khách Hàng)
1. Mở một Terminal mới, di chuyển vào thư mục `frontend`.
2. Cài đặt các thư viện (chỉ làm lần đầu):
   ```bash
   cd frontend
   npm install
   ```
3. Khởi chạy ứng dụng:
   ```bash
   npm run dev
   ```
4. Frontend sẽ chạy tại cổng **5173** (hoặc 5174).

### Bước 5: Chạy Admin Panel (Trang Quản Trị)
1. Mở một Terminal mới, di chuyển vào thư mục `admin QL`.
2. Cài đặt các thư viện (chỉ làm lần đầu):
   ```bash
   cd "admin QL"
   npm install
   ```
3. Khởi chạy ứng dụng:
   ```bash
   npm run dev
   ```
4. Admin Panel sẽ chạy tại cổng khác (vd: **5174** hoặc 5175).

---

## 🌟 Chức năng nổi bật (Key Features)
- **Booking thông minh:** Khách hàng tự do chọn thợ, dịch vụ, khung giờ trống. Tích hợp thanh toán trả trước.
- **Giỏ hàng & Thanh toán:** Tích hợp quy trình checkout xịn xò (Hỗ trợ VNPAY, MOMO).
- **Dashboard trực quan:** Thống kê doanh thu bằng biểu đồ Recharts siêu đẹp, đồng bộ thời gian thực.
- **Tính lương nhân viên (Payroll):** Hệ thống tính toán tự động lương cứng, hoa hồng dịch vụ/sản phẩm cho từng Barber.
- **Quản lý nội dung (CMS):** Tích hợp trình soạn thảo chuẩn SEO để viết bài Tin tức/Kiến thức.
- **Chatbot AI & Phản hồi:** Tích hợp AI thông minh để tư vấn khách hàng, và hệ thống Đánh giá/Rating sản phẩm hai chiều.

---

*Đây là đồ án phục vụ cho môn Đồ án Chuyên ngành (ĐACN). Bản quyền thuộc về sinh viên Trần Ngọc Hải.*
