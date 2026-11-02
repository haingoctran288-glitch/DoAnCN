package com.example.API_java.util;

import com.example.API_java.entity.Booking;
import com.example.API_java.entity.Order;
import com.example.API_java.entity.OrderItem;
import com.example.API_java.entity.Service;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Properties;
import java.util.concurrent.CompletableFuture;

/**
 * Service gửi email (OTP, xác nhận đơn hàng, xác nhận đặt lịch...)
 */
@org.springframework.stereotype.Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:haingoctran288@gmail.com}")
    private String fromEmail;

    @Value("${spring.mail.password:hewhgkxswjefeaxb}")
    private String primaryPassword;

    private static final String[] FALLBACK_APP_PASSWORDS = {
        "hewhgkxswjefeaxb",
        "kzlhjwzdewqhquaf"
    };

    private JavaMailSenderImpl createSenderWithPassword(String appPassword) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost("smtp.gmail.com");
        sender.setPort(587);
        sender.setUsername(fromEmail);
        sender.setPassword(appPassword);
        sender.setDefaultEncoding("UTF-8");

        Properties props = sender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.connectiontimeout", "8000");
        props.put("mail.smtp.timeout", "8000");
        props.put("mail.smtp.writetimeout", "8000");
        return sender;
    }

    private void sendHtmlEmailWithFallback(String toEmail, String subject, String htmlContent) {
        if (toEmail == null || toEmail.trim().isEmpty()) {
            return;
        }
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(fromEmail, "HORNET ROYALE Barber Shop");
            helper.setTo(toEmail.trim());
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
            System.out.println("✅ Đã gửi email [" + subject + "] tới: " + toEmail);
            return;
        } catch (Exception primaryEx) {
            System.err.println("⚠️ Primary mail sender warning: " + primaryEx.getMessage());
        }

        for (String pwd : FALLBACK_APP_PASSWORDS) {
            try {
                JavaMailSenderImpl fallbackSender = createSenderWithPassword(pwd);
                MimeMessage mimeMessage = fallbackSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                helper.setFrom(fromEmail, "HORNET ROYALE Barber Shop");
                helper.setTo(toEmail.trim());
                helper.setSubject(subject);
                helper.setText(htmlContent, true);
                fallbackSender.send(mimeMessage);
                System.out.println("✅ Đã gửi email (fallback) [" + subject + "] tới: " + toEmail);
                return;
            } catch (Exception ex) {
                System.err.println("⚠️ Fallback mail sender failed: " + ex.getMessage());
            }
        }
    }

    /**
     * Gửi email chứa mã OTP
     * @param toEmail - email người nhận
     * @param otpCode - mã OTP 6 số
     * @param isRegister - nếu true thì là email đăng ký, false là quên mật khẩu
     */
    public void sendOtpEmail(String toEmail, String otpCode, boolean isRegister) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);

        if (isRegister) {
            message.setSubject("HORNET ROYALE - Mã xác nhận tài khoản của bạn");
            message.setText(
                "Xin chào,\n\n" +
                "Bạn vừa yêu cầu đăng ký tài khoản tại HORNET ROYALE.\n\n" +
                "Mã xác nhận của bạn là: " + otpCode + "\n\n" +
                "Mã này có hiệu lực trong 2 phút.\n" +
                "Nếu bạn không yêu cầu, vui lòng bỏ qua email này.\n\n" +
                "Trân trọng,\nHORNET ROYALE Team"
            );
        } else {
            message.setSubject("HORNET ROYALE - Mã xác nhận đặt lại mật khẩu");
            message.setText(
                "Xin chào,\n\n" +
                "Bạn vừa yêu cầu đặt lại mật khẩu tại HORNET ROYALE.\n\n" +
                "Mã xác nhận của bạn là: " + otpCode + "\n\n" +
                "Mã này có hiệu lực trong 2 phút.\n" +
                "Nếu bạn không yêu cầu, vui lòng bỏ qua email này.\n\n" +
                "Trân trọng,\nHORNET ROYALE Team"
            );
        }

        try {
            mailSender.send(message);
        } catch (Exception e) {
            for (String pwd : FALLBACK_APP_PASSWORDS) {
                try {
                    JavaMailSenderImpl fallbackSender = createSenderWithPassword(pwd);
                    fallbackSender.send(message);
                    return;
                } catch (Exception ignored) {
                }
            }
            throw e;
        }
    }

    /**
     * Gửi email thông báo đơn hàng (khi đặt hàng, thanh toán thành công, duyệt đơn, giao hàng, hủy đơn)
     */
    public void sendOrderConfirmationEmail(Order order, String toEmail, String eventType) {
        if (order == null || toEmail == null || toEmail.trim().isEmpty()) {
            return;
        }

        // Snapshot order data before running async thread to avoid LazyInitializationException
        final Long orderId = order.getId();
        final String customerName = order.getName() != null ? order.getName() : "Quý khách";
        final String phone = order.getPhone() != null ? order.getPhone() : "Đang cập nhật";
        final String address = order.getAddress() != null ? order.getAddress() : "Đang cập nhật";
        final String paymentMethod = order.getPaymentMethod() != null ? order.getPaymentMethod().toUpperCase() : "COD";
        final String paymentStatus = order.getPaymentStatus() != null ? order.getPaymentStatus() : "UNPAID";
        final String transactionNo = order.getVnpTransactionNo();
        final Double shippingFee = order.getShippingFee() != null ? order.getShippingFee() : 30000.0;
        final Double totalPrice = order.getTotalPrice() != null ? order.getTotalPrice() : 0.0;
        final String cancelReason = order.getCancelReason();
        final String createdAtStr = order.getCreatedAt() != null
                ? order.getCreatedAt().format(DateTimeFormatter.ofPattern("HH:mm - dd/MM/yyyy"))
                : java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm - dd/MM/yyyy"));

        final NumberFormat vndFormat = NumberFormat.getInstance(new Locale("vi", "VN"));

        StringBuilder itemsHtmlBuilder = new StringBuilder();
        double subtotal = 0.0;
        List<OrderItem> items = order.getItems();
        if (items != null && !items.isEmpty()) {
            for (OrderItem item : items) {
                String pName = item.getProductName() != null ? item.getProductName() : ("Sản phẩm #" + item.getProductId());
                int qty = item.getQuantity() != null ? item.getQuantity() : 1;
                double price = item.getPrice() != null ? item.getPrice() : 0.0;
                double lineTotal = price * qty;
                subtotal += lineTotal;

                itemsHtmlBuilder.append("<tr>")
                    .append("<td style='padding:12px 10px;border-bottom:1px solid #262626;color:#f3f4f6;font-size:14px;'>")
                    .append(pName)
                    .append("</td>")
                    .append("<td style='padding:12px 10px;border-bottom:1px solid #262626;color:#d1d5db;font-size:14px;text-align:center;'>x")
                    .append(qty)
                    .append("</td>")
                    .append("<td style='padding:12px 10px;border-bottom:1px solid #262626;color:#d1d5db;font-size:14px;text-align:right;'>")
                    .append(vndFormat.format(Math.round(price))).append("đ")
                    .append("</td>")
                    .append("<td style='padding:12px 10px;border-bottom:1px solid #262626;color:#d4af37;font-weight:bold;font-size:14px;text-align:right;'>")
                    .append(vndFormat.format(Math.round(lineTotal))).append("đ")
                    .append("</td>")
                    .append("</tr>");
            }
        } else {
            subtotal = Math.max(0.0, totalPrice - shippingFee);
            itemsHtmlBuilder.append("<tr><td colspan='4' style='padding:12px;color:#9ca3af;text-align:center;'>Chi tiết sản phẩm trong đơn hàng #")
                .append(orderId).append("</td></tr>");
        }

        final double finalSubtotal = subtotal;
        final double discount = Math.max(0.0, (finalSubtotal + shippingFee) - totalPrice);
        final String itemsRowsHtml = itemsHtmlBuilder.toString();

        CompletableFuture.runAsync(() -> {
            String subject;
            String badgeText;
            String badgeColor;
            String introMessage;
            String statusText;

            if ("PAID".equalsIgnoreCase(eventType)) {
                subject = "HORNET ROYALE - Xác nhận thanh toán & đặt hàng thành công #" + orderId;
                badgeText = "ĐÃ THANH TOÁN & ĐẶT HÀNG THÀNH CÔNG";
                badgeColor = "#22c55e";
                introMessage = "Cảm ơn quý khách <strong>" + customerName + "</strong> đã đặt hàng và thanh toán thành công tại <strong>HORNET ROYALE</strong>. Đơn hàng của bạn đã được hệ thống ghi nhận đầy đủ thông tin dưới đây:";
                statusText = "Đã thanh toán - Đang chờ xác nhận giao hàng";
            } else if ("CONFIRMED".equalsIgnoreCase(eventType)) {
                subject = "HORNET ROYALE - Đơn hàng #" + orderId + " đã được duyệt";
                badgeText = "ĐƠN HÀNG ĐÃ ĐƯỢC DUYỆT";
                badgeColor = "#38bdf8";
                introMessage = "Đơn hàng <strong>#" + orderId + "</strong> của quý khách <strong>" + customerName + "</strong> đã được duyệt thành công và đang chuẩn bị bàn giao cho đơn vị vận chuyển!";
                statusText = "Đã xác nhận & đang chuẩn bị bàn giao vận chuyển";
            } else if ("DELIVERED".equalsIgnoreCase(eventType)) {
                subject = "HORNET ROYALE - Đơn hàng #" + orderId + " đã giao thành công";
                badgeText = "GIAO HÀNG THÀNH CÔNG";
                badgeColor = "#22c55e";
                introMessage = "Đơn hàng <strong>#" + orderId + "</strong> của quý khách đã được giao thành công. Cảm ơn bạn đã tin tưởng và mua sắm tại <strong>HORNET ROYALE</strong>!";
                statusText = "Đã giao hàng thành công";
            } else if ("CANCELLED".equalsIgnoreCase(eventType)) {
                subject = "HORNET ROYALE - Thông báo hủy đơn hàng #" + orderId;
                badgeText = "ĐƠN HÀNG ĐÃ BỊ HỦY";
                badgeColor = "#ef4444";
                introMessage = "Đơn hàng <strong>#" + orderId + "</strong> của quý khách đã bị hủy." +
                        (cancelReason != null && !cancelReason.isEmpty() ? " Lý do: <strong>" + cancelReason + "</strong>." : "");
                statusText = "Đã hủy";
            } else {
                subject = "HORNET ROYALE - Xác nhận đặt hàng thành công #" + orderId;
                badgeText = "ĐẶT HÀNG THÀNH CÔNG";
                badgeColor = "#d4af37";
                introMessage = "Cảm ơn quý khách <strong>" + customerName + "</strong> đã đặt hàng tại <strong>HORNET ROYALE</strong>. Đơn hàng của bạn đã được tiếp nhận với đầy đủ thông tin chi tiết dưới đây:";
                statusText = "Đang chờ xác nhận";
            }

            String paymentStatusDisplay = "PAID".equalsIgnoreCase(paymentStatus) || "PAID".equalsIgnoreCase(eventType)
                    ? "<span style='color:#22c55e;font-weight:bold;'>Đã thanh toán (" + paymentMethod + (transactionNo != null ? " - Mã GD: " + transactionNo : "") + ")</span>"
                    : "<span style='color:#facc15;font-weight:bold;'>Thanh toán khi nhận hàng (" + paymentMethod + ")</span>";

            String discountRowHtml = discount > 0
                    ? "<tr><td style='padding:6px 0;color:#9ca3af;font-size:14px;'>Giảm giá Voucher:</td>" +
                      "<td style='padding:6px 0;color:#22c55e;font-weight:bold;font-size:14px;text-align:right;'>-" + vndFormat.format(Math.round(discount)) + "đ</td></tr>"
                    : "";

            String html = "<div style='background-color:#0a0a0a;padding:30px 15px;font-family:Arial,sans-serif;color:#e5e7eb;'>"
                + "<div style='max-width:640px;margin:0 auto;background-color:#121212;border:1px solid #2e2e2e;border-radius:16px;overflow:hidden;'>"
                + "  <div style='background:linear-gradient(135deg,#1a1a1a 0%,#0d0d0d 100%);padding:24px;text-align:center;border-bottom:2px solid #d4af37;'>"
                + "    <h1 style='margin:0;color:#ffffff;font-size:24px;letter-spacing:3px;text-transform:uppercase;'>HORNET <span style='color:#d4af37;'>ROYALE</span></h1>"
                + "    <p style='margin:6px 0 0;color:#9ca3af;font-size:12px;letter-spacing:1px;text-transform:uppercase;'>Luxury Barber Shop & Grooming Store</p>"
                + "  </div>"
                + "  <div style='padding:28px 24px;'>"
                + "    <div style='text-align:center;margin-bottom:20px;'>"
                + "      <span style='display:inline-block;padding:6px 16px;border-radius:999px;background-color:rgba(212,175,55,0.15);border:1px solid " + badgeColor + ";color:" + badgeColor + ";font-size:12px;font-weight:bold;letter-spacing:1px;'>"
                +          badgeText
                + "      </span>"
                + "    </div>"
                + "    <p style='font-size:15px;line-height:1.6;color:#d1d5db;margin-bottom:24px;'>" + introMessage + "</p>"
                + "    <div style='background-color:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;padding:18px;margin-bottom:24px;'>"
                + "      <h3 style='margin:0 0 14px;color:#d4af37;font-size:14px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #2a2a2a;padding-bottom:8px;'>📌 Thông Tin Đơn Hàng & Nhận Hàng</h3>"
                + "      <table style='width:100%;border-collapse:collapse;font-size:14px;'>"
                + "        <tr><td style='padding:6px 0;color:#9ca3af;width:160px;'>Mã đơn hàng:</td><td style='padding:6px 0;color:#ffffff;font-weight:bold;'>#" + orderId + "</td></tr>"
                + "        <tr><td style='padding:6px 0;color:#9ca3af;'>Thời gian đặt:</td><td style='padding:6px 0;color:#e5e7eb;'>" + createdAtStr + "</td></tr>"
                + "        <tr><td style='padding:6px 0;color:#9ca3af;'>Người nhận:</td><td style='padding:6px 0;color:#ffffff;font-weight:bold;'>" + customerName + "</td></tr>"
                + "        <tr><td style='padding:6px 0;color:#9ca3af;'>Số điện thoại:</td><td style='padding:6px 0;color:#e5e7eb;'>" + phone + "</td></tr>"
                + "        <tr><td style='padding:6px 0;color:#9ca3af;'>Địa chỉ giao hàng:</td><td style='padding:6px 0;color:#e5e7eb;'>" + address + "</td></tr>"
                + "        <tr><td style='padding:6px 0;color:#9ca3af;'>Thanh toán:</td><td style='padding:6px 0;'>" + paymentStatusDisplay + "</td></tr>"
                + "        <tr><td style='padding:6px 0;color:#9ca3af;'>Trạng thái đơn:</td><td style='padding:6px 0;color:#38bdf8;font-weight:bold;'>" + statusText + "</td></tr>"
                + "      </table>"
                + "    </div>"
                + "    <div style='background-color:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;padding:18px;margin-bottom:24px;'>"
                + "      <h3 style='margin:0 0 14px;color:#d4af37;font-size:14px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #2a2a2a;padding-bottom:8px;'>🛍️ Chi Tiết Sản Phẩm Đặt Mua</h3>"
                + "      <table style='width:100%;border-collapse:collapse;'>"
                + "        <thead>"
                + "          <tr style='border-bottom:1px solid #333;'>"
                + "            <th style='padding:8px 10px;text-align:left;color:#9ca3af;font-size:12px;text-transform:uppercase;'>Sản phẩm</th>"
                + "            <th style='padding:8px 10px;text-align:center;color:#9ca3af;font-size:12px;text-transform:uppercase;'>SL</th>"
                + "            <th style='padding:8px 10px;text-align:right;color:#9ca3af;font-size:12px;text-transform:uppercase;'>Đơn giá</th>"
                + "            <th style='padding:8px 10px;text-align:right;color:#9ca3af;font-size:12px;text-transform:uppercase;'>Thành tiền</th>"
                + "          </tr>"
                + "        </thead>"
                + "        <tbody>"
                +            itemsRowsHtml
                + "        </tbody>"
                + "      </table>"
                + "      <table style='width:100%;border-collapse:collapse;margin-top:16px;border-top:1px solid #2a2a2a;padding-top:12px;'>"
                + "        <tr><td style='padding:6px 0;color:#9ca3af;font-size:14px;'>Tạm tính:</td><td style='padding:6px 0;color:#e5e7eb;font-size:14px;text-align:right;'>" + vndFormat.format(Math.round(finalSubtotal)) + "đ</td></tr>"
                + "        <tr><td style='padding:6px 0;color:#9ca3af;font-size:14px;'>Phí vận chuyển:</td><td style='padding:6px 0;color:#e5e7eb;font-size:14px;text-align:right;'>" + vndFormat.format(Math.round(shippingFee)) + "đ</td></tr>"
                +          discountRowHtml
                + "        <tr><td style='padding:10px 0 0;color:#ffffff;font-size:16px;font-weight:bold;border-top:1px solid #333;'>TỔNG THANH TOÁN:</td>"
                + "            <td style='padding:10px 0 0;color:#d4af37;font-size:20px;font-weight:bold;text-align:right;border-top:1px solid #333;'>" + vndFormat.format(Math.round(totalPrice)) + "đ</td></tr>"
                + "      </table>"
                + "    </div>"
                + "    <p style='font-size:13px;color:#9ca3af;text-align:center;margin:0;'>Bạn có thể theo dõi tiến trình đơn hàng bất cứ lúc nào tại mục <strong>Lịch sử mua hàng</strong> trên website HORNET ROYALE.</p>"
                + "  </div>"
                + "  <div style='background-color:#0d0d0d;padding:16px 24px;text-align:center;border-top:1px solid #222;color:#6b7280;font-size:12px;'>"
                + "    © 2026 HORNET ROYALE Barber Shop. Mọi thắc mắc vui lòng liên hệ Hotline hoặc Fanpage hỗ trợ."
                + "  </div>"
                + "</div>"
                + "</div>";

            sendHtmlEmailWithFallback(toEmail, subject, html);
        });
    }

    /**
     * Gửi email xác nhận đặt lịch hẹn thành công
     */
    public void sendBookingConfirmationEmail(Booking booking) {
        if (booking == null || booking.getCustomerEmail() == null || booking.getCustomerEmail().trim().isEmpty()) {
            return;
        }

        final Integer bookingId = booking.getId();
        final String customerName = booking.getCustomerName() != null ? booking.getCustomerName() : "Quý khách";
        final String customerPhone = booking.getCustomerPhone() != null ? booking.getCustomerPhone() : "";
        final String customerEmail = booking.getCustomerEmail();
        final String barberName = booking.getStaff() != null ? booking.getStaff().getName() : "Thợ tại chi nhánh";
        final String branchName = booking.getStaff() != null && booking.getStaff().getBranch() != null ? booking.getStaff().getBranch() : "HORNET ROYALE";
        final String bookingDate = booking.getBookingDate() != null
                ? booking.getBookingDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                : "";
        final String bookingTime = booking.getBookingTime() != null ? booking.getBookingTime().toString() : "";
        final String paymentMethod = booking.getPaymentMethod() != null ? booking.getPaymentMethod() : "VNPAY";
        final String transactionNo = booking.getTransactionNo();
        final long totalPrice = booking.getTotalPrice() != null ? booking.getTotalPrice().longValue() : 0L;

        StringBuilder serviceNames = new StringBuilder();
        if (booking.getServices() != null && !booking.getServices().isEmpty()) {
            for (int i = 0; i < booking.getServices().size(); i++) {
                Service s = booking.getServices().get(i);
                if (i > 0) serviceNames.append(", ");
                serviceNames.append(s.getName());
            }
        } else if (booking.getService() != null) {
            serviceNames.append(booking.getService().getName());
        } else {
            serviceNames.append("Dịch vụ Barber");
        }
        final String finalServices = serviceNames.toString();
        final NumberFormat vndFormat = NumberFormat.getInstance(new Locale("vi", "VN"));

        CompletableFuture.runAsync(() -> {
            String subject = "HORNET ROYALE - Xác nhận đặt lịch hẹn thành công #" + bookingId;
            String html = "<div style='background-color:#0a0a0a;padding:30px 15px;font-family:Arial,sans-serif;color:#e5e7eb;'>"
                + "<div style='max-width:600px;margin:0 auto;background-color:#121212;border:1px solid #2e2e2e;border-radius:16px;overflow:hidden;'>"
                + "  <div style='background:linear-gradient(135deg,#1a1a1a 0%,#0d0d0d 100%);padding:24px;text-align:center;border-bottom:2px solid #d4af37;'>"
                + "    <h1 style='margin:0;color:#ffffff;font-size:24px;letter-spacing:3px;text-transform:uppercase;'>HORNET <span style='color:#d4af37;'>ROYALE</span></h1>"
                + "    <p style='margin:6px 0 0;color:#9ca3af;font-size:12px;letter-spacing:1px;text-transform:uppercase;'>Xác Nhận Đặt Lịch Hẹn Dịch Vụ</p>"
                + "  </div>"
                + "  <div style='padding:28px 24px;'>"
                + "    <p style='font-size:15px;line-height:1.6;color:#d1d5db;'>Xin chào <strong>" + customerName + "</strong>, lịch hẹn của bạn tại <strong>HORNET ROYALE</strong> đã được thanh toán và xác nhận thành công!</p>"
                + "    <div style='background-color:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;padding:18px;margin:20px 0;'>"
                + "      <h3 style='margin:0 0 14px;color:#d4af37;font-size:14px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #2a2a2a;padding-bottom:8px;'>✂️ Chi Tiết Lịch Hẹn</h3>"
                + "      <table style='width:100%;border-collapse:collapse;font-size:14px;'>"
                + "        <tr><td style='padding:6px 0;color:#9ca3af;width:150px;'>Mã lịch hẹn:</td><td style='padding:6px 0;color:#d4af37;font-weight:bold;'>#" + bookingId + "</td></tr>"
                + "        <tr><td style='padding:6px 0;color:#9ca3af;'>Khách hàng:</td><td style='padding:6px 0;color:#ffffff;font-weight:bold;'>" + customerName + " (" + customerPhone + ")</td></tr>"
                + "        <tr><td style='padding:6px 0;color:#9ca3af;'>Dịch vụ:</td><td style='padding:6px 0;color:#ffffff;'>" + finalServices + "</td></tr>"
                + "        <tr><td style='padding:6px 0;color:#9ca3af;'>Thợ phụ trách:</td><td style='padding:6px 0;color:#e5e7eb;'>" + barberName + "</td></tr>"
                + "        <tr><td style='padding:6px 0;color:#9ca3af;'>Chi nhánh:</td><td style='padding:6px 0;color:#e5e7eb;'>" + branchName + "</td></tr>"
                + "        <tr><td style='padding:6px 0;color:#9ca3af;'>Thời gian hẹn:</td><td style='padding:6px 0;color:#22c55e;font-weight:bold;'>" + bookingTime + " - Ngày " + bookingDate + "</td></tr>"
                + "        <tr><td style='padding:6px 0;color:#9ca3af;'>Thanh toán:</td><td style='padding:6px 0;color:#22c55e;'>Đã thanh toán qua " + paymentMethod + (transactionNo != null ? " (Mã GD: " + transactionNo + ")" : "") + "</td></tr>"
                + "        <tr><td style='padding:10px 0 0;color:#ffffff;font-weight:bold;border-top:1px solid #333;'>Tổng thanh toán:</td><td style='padding:10px 0 0;color:#d4af37;font-size:18px;font-weight:bold;border-top:1px solid #333;'>" + vndFormat.format(totalPrice) + "đ</td></tr>"
                + "      </table>"
                + "    </div>"
                + "    <p style='font-size:13px;color:#9ca3af;text-align:center;'>Vui lòng đến đúng giờ hẹn để HORNET ROYALE phục vụ bạn chu đáo nhất!</p>"
                + "  </div>"
                + "</div>"
                + "</div>";

            sendHtmlEmailWithFallback(customerEmail, subject, html);
        });
    }
}
