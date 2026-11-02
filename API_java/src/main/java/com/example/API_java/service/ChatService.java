package com.example.API_java.service;

import com.example.API_java.entity.Product;
import com.example.API_java.entity.Staff;
import com.example.API_java.entity.Voucher;
import com.example.API_java.repository.ProductRepository;
import com.example.API_java.repository.ServiceRepository;
import com.example.API_java.repository.StaffRepository;
import com.example.API_java.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * ChatService chịu trách nhiệm:
 * 1. Lấy dữ liệu thật từ DB (services, products, vouchers, staff)
 * 2. Xây dựng System Prompt đầy đủ với kiến thức chuyên môn Barber/Salon
 * 3. Ghép lịch sử hội thoại và gọi GeminiService
 */
@Service
public class ChatService {

    @Autowired private GeminiService geminiService;
    @Autowired private ServiceRepository serviceRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private VoucherRepository voucherRepository;
    @Autowired private StaffRepository staffRepository;

    /**
     * Xử lý tin nhắn: xây dựng prompt từ DB thật rồi gọi Gemini
     */
    public String processChat(List<Map<String, String>> history) {
        String systemInstruction = buildSystemPrompt();
        List<Map<String, Object>> contents = new ArrayList<>();
        for (Map<String, String> msg : history) {
            Map<String, Object> content = new HashMap<>();
            String role = "user".equals(msg.get("role")) ? "user" : "model";
            content.put("role", role);
            content.put("parts", Collections.singletonList(Collections.singletonMap("text", msg.get("content"))));
            contents.add(content);
        }
        return geminiService.generateContent(contents, systemInstruction);
    }

    /**
     * Xây dựng System Prompt đầy đủ: kiến thức chuyên môn + dữ liệu thật DB
     */
    private String buildSystemPrompt() {
        StringBuilder p = new StringBuilder();

        // --- NHÂN THÂN ---
        p.append("Bạn là AI Assistant chính thức của HORNET ROYALE - hệ thống Barber Shop & Salon cao cấp.\n");
        p.append("Luon tra loi bang tieng Viet. Phong cach: chuyen nghiep, than thien, ngan gon, de hieu, khong lan man.\n");
        p.append("Khong bia thong tin. Neu khong chac thi noi ro. Khong tu nghi ra gia, voucher, khuyen mai.\n");
        p.append("Nhiem vu: Tu van dich vu, kieu toc, mau nhuom, uon toc, cham soc toc & da, san pham, dat lich, hoi vien, voucher.\n\n");

        // --- KIEU TOC NAM ---
        p.append("KIEU TOC NAM (co the tu van chi tiet theo khuon mat, chat toc, do kho cham soc, chu ky cat lai):\n");
        p.append("Side Part, Undercut, Two Block, Layer, Textured Crop, French Crop, Ivy League, Pompadour, Quiff, Slick Back, Crew Cut, Buzz Cut, Mullet, Mohican, Comma Hair, Wolf Cut, Curtain Hair, Middle Part, Short Quiff, Modern Pompadour, Fade (Low/Mid/High/Skin Fade), Taper Fade.\n\n");

        // --- KIEU TOC NU ---
        p.append("KIEU TOC NU (tu van theo mat tron/dai/vuong/trai xoan/trai tim):\n");
        p.append("Bob, Lob, Layer, Butterfly Cut, Hime Cut, Wolf Cut, Pixie, Long Layer, Curtain Bangs, Air Bangs, Hush Cut, Shag Hair, Jellyfish Hair.\n\n");

        // --- UON TOC ---
        p.append("UON TOC:\n");
        p.append("Nam: Uon Basic, Uon Con Sau, Uon Texture, Uon Layer, Uon Han Quoc, Uon Ruffled, Uon Song.\n");
        p.append("Nu: Uon Song Loi, Uon Layer, Uon Hippie, Uon Chu C, Uon Chu S, Uon Xoan Loi, Uon Setting, Uon Lanh.\n");
        p.append("Tu van: thoi gian giu nep, doi tuong phu hop, muc do hu ton, cach cham soc sau uon.\n\n");

        // --- NHUOM ---
        p.append("MAU NHUOM:\n");
        p.append("Nam: Den, Nau Tay, Nau Lanh, Nau Khoi, Xam Khoi, Bach Kim, Reu Khoi, Xanh Den, Xam Tro.\n");
        p.append("Nu: Nau Chocolate, Nau Tra Sua, Nau Tay, Nau Lanh, Beige, Ash Brown, Mocha Brown, Rose Brown, Pink Brown, Lavender Brown, Milk Tea Brown, Platinum Blonde.\n");
        p.append("Tu van: co can tay khong, phai mau the nao, cach giu mau lau. Khi khach muon nhuom -> hoi them: Tung tay chua? Muon mau sang hay toi? Di lam co gioi han mau khong?\n\n");

        // --- CHAM SOC TOC ---
        p.append("CHAM SOC TOC:\n");
        p.append("Tu van cho: toc kho, toc dau, toc hu ton, toc gay rung, toc yeu, toc nhuom, toc uon, toc tay, toc xo.\n");
        p.append("Giai thich: dau goi, dau xa, kem u, serum, tinh dau, xit duong, xit chong nhiet.\n");
        p.append("Phuc hoi toc: Keratin, Collagen, Botox Hair, Olaplex, Hap dau, Phuc hoi Nano.\n\n");

        // --- CHAM SOC DA ---
        p.append("CHAM SOC DA CO BAN:\n");
        p.append("Huong dan: Rua mat, Tay trang, Tay te bao chet, Duong am, Kem chong nang.\n");
        p.append("Loai da: Da dau, Da kho, Da hon hop, Da nhay cam.\n");
        p.append("QUAN TRONG: Khong chan doan benh, khong ke thuoc. Chi tu van cham soc co ban. Neu da co van de nghiem trong thi khuyen gap bac si da lieu.\n\n");

        // --- KIEN THUC BARBER ---
        p.append("KIEN THUC BARBER: Fade, Taper, Texture, Line Up, Beard Trim, Hot Towel Shave, Shaving - co the giai thich cho khach de hieu.\n\n");

        // --- SAN PHAM ---
        p.append("SAN PHAM (khong khang dinh san pham nao la tot nhat, chi giai thich uu/nhuoc/doi tuong):\n");
        p.append("Pomade: Reuzel, Uppercut Deluxe, Suavecito, Layrite.\n");
        p.append("Clay: Hanz De Fuko, Kevin Murphy, Volcanic Clay.\n");
        p.append("Wax: Gatsby, By Vilain, Blumaan.\n");
        p.append("Hairspray: Schwarzkopf, TIGI, L'Oreal Professionnel.\n");
        p.append("Dau goi: Davines, Olaplex, TRESSemme, L'Oreal Professionnel.\n\n");

        // --- XU HUONG ---
        p.append("XU HUONG: Co the gioi thieu kieu toc/mau nhuom dang thinh hanh. Neu khong chac xe xu huong moi nhat thi noi: 'Xu huong co the thay doi. HORNET ROYALE se cap nhat thuong xuyen.'\n\n");

        // --- NGUYEN TAC TU VAN ---
        p.append("NGUYEN TAC TU VAN:\n");
        p.append("- Khi khach hoi 'kieu toc nao hop voi toi?' -> phai hoi them: Nam hay nu? Mat tron/vuong/dai? Toc day/mong? Co nhuom/uon khong?\n");
        p.append("- Khi khach muon nhuom -> hoi truoc roi moi tu van.\n");
        p.append("- Khi khach hoi da bi mun -> chi tu van co ban, khong chan doan.\n\n");

        // ===== DU LIEU HE THONG =====
        p.append("=== DU LIEU THUC TU HE THONG HORNET ROYALE ===\n");
        p.append("(Su dung du lieu nay khi khach hoi gia, san pham, chi nhanh, barber, voucher)\n\n");

        // Dich vu
        p.append("[BANG GIA DICH VU]\n");
        try {
            List<com.example.API_java.entity.Service> services = serviceRepository.findAll();
            if (services.isEmpty()) {
                p.append("Chua co du lieu dich vu.\n");
            } else {
                Map<String, List<com.example.API_java.entity.Service>> grouped = new LinkedHashMap<>();
                for (com.example.API_java.entity.Service s : services) {
                    if (!"active".equalsIgnoreCase(s.getStatus())) continue;
                    String cat = s.getMainCategory() != null ? s.getMainCategory() : "Khac";
                    grouped.computeIfAbsent(cat, k -> new ArrayList<>()).add(s);
                }
                grouped.forEach((cat, list) -> {
                    p.append("[").append(cat).append("]\n");
                    list.forEach(s -> {
                        String price = s.getPrice() != null
                                ? String.format("%,.0f VND", s.getPrice().doubleValue()) : "Lien he";
                        String dur = s.getDuration() != null ? " (" + s.getDuration() + " phut)" : "";
                        p.append("  - ").append(s.getName()).append(": ").append(price).append(dur).append("\n");
                    });
                });
            }
        } catch (Exception e) {
            System.err.println("[ChatService] Loi load services: " + e.getMessage());
            p.append("Loi tai du lieu dich vu.\n");
        }

        // San pham
        p.append("\n[SAN PHAM CUA HANG]\n");
        try {
            List<Product> products = productRepository.findAllByOrderBySortOrderAsc();
            if (products.isEmpty()) {
                p.append("Chua co san pham.\n");
            } else {
                products.stream().filter(pr -> Boolean.TRUE.equals(pr.getIsBestSeller())).limit(5).forEach(pr -> {
                    String price = pr.getPrice() != null ? String.format("%,.0f VND", pr.getPrice()) : "Lien he";
                    p.append("  * [BAN CHAY] ").append(pr.getName()).append(" - ").append(price)
                     .append(pr.getStock() != null && pr.getStock() > 0 ? " - Con hang" : " - Het hang").append("\n");
                });
                products.stream().filter(pr -> !Boolean.TRUE.equals(pr.getIsBestSeller())).limit(15).forEach(pr -> {
                    String price = pr.getPrice() != null ? String.format("%,.0f VND", pr.getPrice()) : "Lien he";
                    p.append("  - ").append(pr.getName()).append(" (").append(pr.getCategory()).append(") - ").append(price)
                     .append(pr.getStock() != null && pr.getStock() > 0 ? " - Con hang" : " - Het hang").append("\n");
                });
            }
        } catch (Exception e) {
            System.err.println("[ChatService] Loi load products: " + e.getMessage());
            p.append("Loi tai du lieu san pham.\n");
        }

        // Voucher
        p.append("\n[VOUCHER DANG HOAT DONG]\n");
        try {
            List<Voucher> vouchers = voucherRepository.findAll();
            boolean hasActive = vouchers.stream().anyMatch(v -> "ACTIVE".equals(v.getStatus()));
            if (!hasActive) {
                p.append("Hien chua co voucher nao dang hoat dong.\n");
            } else {
                vouchers.stream().filter(v -> "ACTIVE".equals(v.getStatus())).forEach(v -> {
                    String discount = "PERCENTAGE".equals(v.getVoucherType())
                            ? v.getValue() + "%" : String.format("%,.0f VND", v.getValue());
                    String minOrder = v.getMinOrderValue() != null
                            ? String.format("%,.0f VND", v.getMinOrderValue()) : "0 VND";
                    p.append("  - Ma: ").append(v.getCode()).append(" | ").append(v.getName())
                     .append(" | Giam: ").append(discount).append(" | Don tu: ").append(minOrder).append("\n");
                });
            }
        } catch (Exception e) {
            System.err.println("[ChatService] Loi load vouchers: " + e.getMessage());
        }

        // Barber
        p.append("\n[DOI NGU BARBER & STYLIST]\n");
        try {
            List<Staff> staffList = staffRepository.findAll();
            staffList.stream().filter(s -> Boolean.TRUE.equals(s.getIsActive())).forEach(s -> {
                p.append("  - ").append(s.getName());
                if (s.getSpecialty() != null) p.append(" | Chuyen mon: ").append(s.getSpecialty());
                if (s.getBranch() != null) p.append(" | Chi nhanh: ").append(s.getBranch());
                if (s.getExperienceYears() != null && s.getExperienceYears() > 0)
                    p.append(" | KN: ").append(s.getExperienceYears()).append(" nam");
                if (s.getRating() != null && s.getRating() > 0)
                    p.append(" | ").append(String.format("%.1f", s.getRating())).append("/5 sao");
                p.append("\n");
            });
        } catch (Exception e) {
            System.err.println("[ChatService] Loi load staff: " + e.getMessage());
        }

        // Chi nhanh
        p.append("\n[CHI NHANH HORNET ROYALE - Gio mo cua: 8:30 - 20:30 hang ngay]\n");
        p.append("  - Quan 1: 100 Nguyen Hue, Quan 1, TP.HCM\n");
        p.append("  - Quan 2: 45 Thao Dien, Quan 2, TP.HCM\n");
        p.append("  - Quan 3: 78 Vo Van Tan, Quan 3, TP.HCM\n");
        p.append("  - Quan 7: 12 Nguyen Thi Thap, Quan 7, TP.HCM\n");
        p.append("  - Quan 9: 56 Do Xuan Hop, Quan 9, TP.HCM\n");
        p.append("  - Binh Thanh: 90 Xo Viet Nghe Tinh, Binh Thanh, TP.HCM\n");

        // Khac
        p.append("\n[THONG TIN KHAC]\n");
        p.append("Dat lich: vao muc DAT LICH tren website, chon ngay/gio/dich vu/tho.\n");
        p.append("Thanh toan: Tien mat hoac VNPAY online.\n");
        p.append("Hoi vien: Tich diem, uu dai sinh nhat, voucher dac biet.\n");
        p.append("Neu khach noi 'gap nhan vien'/'nguoi that'/'chat voi nhan vien' -> tra loi: 'Da, HORNET ROYALE dang ket noi quy khach voi nhan vien tu van, vui long doi trong giay lat...'\n");

        return p.toString();
    }
}
