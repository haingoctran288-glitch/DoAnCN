package com.example.API_java.service;

import com.example.API_java.entity.*;
import com.example.API_java.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private VoucherCampaignRepository campaignRepository;

    @Autowired
    private CustomerVoucherRepository customerVoucherRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private CustomerService customerService;

    // ==========================================
    // VOUCHER CRUD
    // ==========================================

    public List<Voucher> getAllVouchers() {
        return voucherRepository.findByStatusNotOrderByCreatedAtDesc("DELETED");
    }

    public Voucher getVoucherById(Integer id) {
        return voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Voucher!"));
    }

    public Voucher createVoucher(Voucher voucher) {
        if (voucherRepository.findByCode(voucher.getCode()).isPresent()) {
            throw new RuntimeException("Mã Voucher này đã tồn tại!");
        }
        if ("ACTIVE".equalsIgnoreCase(voucher.getStatus())) {
            if (voucher.getEndDate() != null && voucher.getEndDate().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Voucher đã hết thời hạn sử dụng. Vui lòng sửa lại thời gian kết thúc trước khi kích hoạt!");
            }
        }
        Voucher saved = voucherRepository.save(voucher);
        distributeIfAllCustomersActive(saved);
        distributeIfMembershipActive(saved);
        return saved;
    }

    public Voucher updateVoucher(Integer id, Voucher details) {
        Voucher voucher = getVoucherById(id);
        
        // If code changes, verify uniqueness
        if (!voucher.getCode().equalsIgnoreCase(details.getCode())) {
            if (voucherRepository.findByCode(details.getCode()).isPresent()) {
                throw new RuntimeException("Mã Voucher mới đã tồn tại!");
            }
            voucher.setCode(details.getCode());
        }
        
        if ("ACTIVE".equalsIgnoreCase(details.getStatus())) {
            if (details.getEndDate() != null && details.getEndDate().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Voucher đã hết thời hạn sử dụng. Vui lòng sửa lại thời gian kết thúc trước khi kích hoạt!");
            }
        }
        
        voucher.setName(details.getName());
        voucher.setVoucherType(details.getVoucherType());
        voucher.setValue(details.getValue());
        voucher.setMaxDiscount(details.getMaxDiscount());
        voucher.setMinOrderValue(details.getMinOrderValue());
        voucher.setApplyTo(details.getApplyTo());
        voucher.setStartDate(details.getStartDate());
        voucher.setEndDate(details.getEndDate());
        voucher.setTotalQuantity(details.getTotalQuantity());
        voucher.setStatus(details.getStatus());
        
        voucher.setIssueType(details.getIssueType());
        voucher.setUserLimit(details.getUserLimit() != null ? details.getUserLimit() : 1);
        voucher.setMembershipLevel(details.getMembershipLevel());
        voucher.setBirthMonth(details.getBirthMonth());
        voucher.setCampaignStartDate(details.getCampaignStartDate());
        voucher.setCampaignEndDate(details.getCampaignEndDate());
        voucher.setNotificationTitle(details.getNotificationTitle());
        voucher.setNotificationMessage(details.getNotificationMessage());
        
        Voucher saved = voucherRepository.save(voucher);
        distributeIfAllCustomersActive(saved);
        distributeIfMembershipActive(saved);
        return saved;
    }

    @Transactional
    public void deleteVoucher(Integer id) {
        Voucher voucher = getVoucherById(id);
        voucher.setStatus("DELETED");
        voucherRepository.save(voucher);
    }

    public Voucher toggleVoucherStatus(Integer id) {
        Voucher voucher = getVoucherById(id);
        if ("ACTIVE".equalsIgnoreCase(voucher.getStatus())) {
            voucher.setStatus("PAUSED");
        } else {
            if (voucher.getEndDate() != null && voucher.getEndDate().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Voucher đã hết thời hạn sử dụng. Vui lòng sửa lại thời gian kết thúc trước khi kích hoạt!");
            }
            voucher.setStatus("ACTIVE");
        }
        Voucher saved = voucherRepository.save(voucher);
        distributeIfAllCustomersActive(saved);
        distributeIfMembershipActive(saved);
        return saved;
    }

    private void distributeIfAllCustomersActive(Voucher voucher) {
        if ("ACTIVE".equalsIgnoreCase(voucher.getStatus()) && "ALL_CUSTOMERS".equalsIgnoreCase(voucher.getIssueType())) {
            distributeVoucherToAllCustomers(voucher);
        }
    }

    private void distributeIfMembershipActive(Voucher voucher) {
        if ("ACTIVE".equalsIgnoreCase(voucher.getStatus()) && "MEMBERSHIP".equalsIgnoreCase(voucher.getIssueType()) && voucher.getMembershipLevel() != null) {
            String targetTierName = "";
            switch (voucher.getMembershipLevel()) {
                case "NGOI_SAO_MOI": targetTierName = "Ngôi Sao Mới"; break;
                case "NGUOI_CUA_CONG_CHUNG": targetTierName = "Người Của Công Chúng"; break;
                case "SAT_THU_LICH_LAM": targetTierName = "Sát Thủ Lịch Lãm"; break;
                case "BIEU_TUONG_THOI_DAI": targetTierName = "Biểu Tượng Thời Đại"; break;
                case "VU_TRU_NHAN_SAC": targetTierName = "Vũ Trụ Nhan Sắc"; break;
                default: targetTierName = voucher.getMembershipLevel();
            }

            List<User> users = userRepository.findAll();
            for (User user : users) {
                if (!"USER".equalsIgnoreCase(user.getRole())) continue;

                long completedBookings = bookingRepository.getCompletedBookingCount(user.getId());
                String currentTier = customerService.getCustomerTier(completedBookings);

                if (currentTier.equalsIgnoreCase(targetTierName)) {
                    if (!customerVoucherRepository.existsByUserIdAndVoucherId(user.getId(), voucher.getId())) {
                        CustomerVoucher cv = new CustomerVoucher();
                        cv.setUser(user);
                        cv.setVoucher(voucher);
                        cv.setCode(voucher.getCode());
                        cv.setStatus("UNUSED");
                        cv.setNote("Chúc mừng thành viên hạng " + currentTier + " nhận được ưu đãi riêng!");
                        cv.setClaimedAt(LocalDateTime.now());
                        cv.setStartDate(voucher.getStartDate());
                        cv.setEndDate(voucher.getEndDate());
                        customerVoucherRepository.save(cv);

                        voucher.setUsedQuantity(voucher.getUsedQuantity() + 1);
                        voucherRepository.save(voucher);

                        String title = "⭐ Chúc mừng bạn đã đạt cấp: " + currentTier;
                        String prefix = "Bạn vừa nhận được voucher đặc quyền hội viên: " + voucher.getCode();
                        sendVoucherNotification(user, voucher, "MEMBERSHIP", title, prefix, "Chúc mừng thành viên hạng " + currentTier + " nhận được ưu đãi riêng!");
                    }
                }
            }
        }
    }

    @Transactional
    public void distributeVoucherToAllCustomers(Voucher voucher) {
        List<User> customers = new ArrayList<>();
        for (User u : userRepository.findAll()) {
            if ("USER".equalsIgnoreCase(u.getRole())) {
                customers.add(u);
            }
        }

        LocalDateTime now = LocalDateTime.now();
        int count = 0;
        for (User user : customers) {
            if (customerVoucherRepository.existsByUserIdAndVoucherId(user.getId(), voucher.getId())) {
                continue;
            }

            CustomerVoucher cv = new CustomerVoucher();
            cv.setUser(user);
            cv.setVoucher(voucher);
            cv.setCode(voucher.getCode());
            cv.setStatus("UNUSED");
            cv.setNote("Phát hành toàn bộ khách hàng");
            cv.setClaimedAt(now);
            cv.setStartDate(voucher.getStartDate());
            cv.setEndDate(voucher.getEndDate());
            customerVoucherRepository.save(cv);
            count++;

            String title = "🔥 Chương trình ưu đãi mới dành cho toàn bộ khách hàng HORNET ROYALE.";
            String prefix = "Chào bạn, Hornet Royale gửi tặng tất cả hội viên mã giảm giá " + voucher.getCode() + ".";
            sendVoucherNotification(user, voucher, "ALL_CUSTOMERS", title, prefix, "Chương trình tri ân toàn bộ khách hàng.");
        }

        if (count > 0) {
            voucher.setUsedQuantity(voucher.getUsedQuantity() + count);
            voucherRepository.save(voucher);
        }
    }



    // ==========================================
    // MANUAL GIFTING
    // ==========================================

    @Transactional
    public List<CustomerVoucher> giftVoucherManually(Integer userId, Integer voucherId, int quantity, String note, LocalDateTime startDate, LocalDateTime endDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng!"));
        Voucher voucher = getVoucherById(voucherId);

        if (!"ACTIVE".equalsIgnoreCase(voucher.getStatus())) {
            throw new RuntimeException("Voucher này đang không hoạt động.");
        }

        if (voucher.getEndDate() != null && voucher.getEndDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Voucher đã hết thời hạn sử dụng. Vui lòng sửa lại thời gian kết thúc trước khi phát hành!");
        }
        
        if (voucher.getTotalQuantity() > 0 && (voucher.getUsedQuantity() + quantity > voucher.getTotalQuantity())) {
            throw new RuntimeException("Số lượng Voucher còn lại trong kho không đủ để tặng!");
        }

        List<CustomerVoucher> gifted = new ArrayList<>();
        for (int i = 0; i < quantity; i++) {
            CustomerVoucher cv = new CustomerVoucher();
            cv.setUser(user);
            cv.setVoucher(voucher);
            cv.setCode(voucher.getCode());
            cv.setStatus("UNUSED");
            cv.setNote(note != null ? note : "Tặng từ hệ thống");
            cv.setClaimedAt(LocalDateTime.now());
            cv.setStartDate(startDate != null ? startDate : voucher.getStartDate());
            cv.setEndDate(endDate != null ? endDate : voucher.getEndDate());
            gifted.add(customerVoucherRepository.save(cv));
        }

        // Update voucher quantity
        voucher.setUsedQuantity(voucher.getUsedQuantity() + quantity);
        voucherRepository.save(voucher);

        // Send notification to customer
        String title = "🎁 Bạn vừa nhận được voucher đặc biệt từ HORNET ROYALE.";
        String prefix = "Cửa hàng đã gửi tặng riêng cho bạn " + quantity + " voucher: " + voucher.getCode();
        sendVoucherNotification(user, voucher, "MANUAL", title, prefix, note != null ? note : "Quà tặng đặc biệt từ hệ thống.");

        return gifted;
    }

    @Transactional
    public CustomerVoucher claimVoucher(Integer userId, String code) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng!"));

        Voucher voucher = voucherRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Mã voucher không tồn tại!"));

        if (!"ACTIVE".equalsIgnoreCase(voucher.getStatus())) {
            throw new RuntimeException("Mã voucher này đã ngừng hoạt động hoặc bị xóa.");
        }

        if (voucher.getStartDate() != null && voucher.getStartDate().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Mã voucher này chưa đến thời gian bắt đầu sử dụng.");
        }

        if (voucher.getEndDate() != null && voucher.getEndDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã voucher này đã hết hạn.");
        }

        if (voucher.getTotalQuantity() > 0 && (voucher.getUsedQuantity() >= voucher.getTotalQuantity())) {
            throw new RuntimeException("Mã voucher này đã hết số lượng.");
        }

        if (customerVoucherRepository.existsByUserIdAndVoucherId(userId, voucher.getId())) {
            throw new RuntimeException("Bạn đã lưu mã voucher này rồi!");
        }

        CustomerVoucher cv = new CustomerVoucher();
        cv.setUser(user);
        cv.setVoucher(voucher);
        cv.setCode(voucher.getCode());
        cv.setStatus("UNUSED");
        cv.setNote("Khách hàng tự lưu mã");
        cv.setClaimedAt(LocalDateTime.now());
        cv.setStartDate(voucher.getStartDate());
        cv.setEndDate(voucher.getEndDate());
        
        CustomerVoucher saved = customerVoucherRepository.save(cv);

        voucher.setUsedQuantity(voucher.getUsedQuantity() + 1);
        voucherRepository.save(voucher);

        return saved;
    }

    // ==========================================
    // CUSTOMER VOUCHER WALLET
    // ==========================================

    public List<CustomerVoucher> getCustomerVouchers(Integer userId, String status) {
        // First update expired vouchers
        updateExpiredCustomerVouchers(userId);

        if (status == null || "all".equalsIgnoreCase(status) || status.trim().isEmpty()) {
            return customerVoucherRepository.findByUserIdOrderByClaimedAtDesc(userId);
        }
        return customerVoucherRepository.findByUserIdAndStatusOrderByClaimedAtDesc(userId, status.toUpperCase());
    }

    private void updateExpiredCustomerVouchers(Integer userId) {
        List<CustomerVoucher> list = customerVoucherRepository.findByUserIdAndStatusOrderByClaimedAtDesc(userId, "UNUSED");
        LocalDateTime now = LocalDateTime.now();
        for (CustomerVoucher cv : list) {
            if (cv.getEndDate() != null && cv.getEndDate().isBefore(now)) {
                cv.setStatus("EXPIRED");
                customerVoucherRepository.save(cv);
            }
        }
    }

    // ==========================================
    // CAMPAIGN TRIGGER SYSTEM (Dynamic)
    // ==========================================

    @Transactional
    public void evaluateCampaigns(Integer userId, String triggerType, Object contextValue) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || !"USER".equalsIgnoreCase(user.getRole())) {
            return;
        }

        String issueType = null;
        if ("NEW_REGISTER".equalsIgnoreCase(triggerType)) {
            issueType = "NEW_CUSTOMER";
        } else if ("BIRTHDAY".equalsIgnoreCase(triggerType)) {
            issueType = "BIRTHDAY";
        } else if ("MEMBERSHIP_TIER".equalsIgnoreCase(triggerType)) {
            issueType = "MEMBERSHIP";
        }

        if (issueType == null) {
            return;
        }

        List<Voucher> activeVouchers = voucherRepository.findByIssueTypeAndStatus(issueType, "ACTIVE");
        LocalDateTime now = LocalDateTime.now();

        for (Voucher voucher : activeVouchers) {
            if ((voucher.getStartDate() != null && voucher.getStartDate().isAfter(now)) || 
                (voucher.getEndDate() != null && voucher.getEndDate().isBefore(now)) ||
                (voucher.getTotalQuantity() > 0 && voucher.getUsedQuantity() >= voucher.getTotalQuantity())) {
                continue;
            }

            if ("BIRTHDAY".equals(issueType)) {
                if (user.getBirthday() == null || (voucher.getBirthMonth() != null && user.getBirthday().getMonthValue() != voucher.getBirthMonth())) {
                    continue;
                }
                int currentYear = java.time.LocalDate.now().getYear();
                if (customerVoucherRepository.existsByUserIdAndVoucherIdAndYear(userId, voucher.getId(), currentYear)) {
                    continue;
                }
            } else {
                if (customerVoucherRepository.existsByUserIdAndVoucherId(userId, voucher.getId())) {
                    continue;
                }
            }

            boolean isEligible = false;
            String note = "Quà tặng tự động từ hệ thống";

            if ("NEW_CUSTOMER".equals(issueType)) {
                isEligible = true;
                note = "Cảm ơn bạn đã đăng ký tài khoản thành viên Hornet Royale!";
            } else if ("BIRTHDAY".equals(issueType)) {
                isEligible = true;
                note = "Chúc mừng sinh nhật quý khách! Hornet Royale kính chúc bạn tuổi mới ngập tràn niềm vui!";
            } else if ("MEMBERSHIP".equals(issueType)) {
                if (voucher.getMembershipLevel() != null) {
                    long completedBookings = bookingRepository.getCompletedBookingCount(userId);
                    String currentTier = customerService.getCustomerTier(completedBookings);
                    
                    String targetTierName = "";
                    switch (voucher.getMembershipLevel()) {
                        case "NGOI_SAO_MOI": targetTierName = "Ngôi Sao Mới"; break;
                        case "NGUOI_CUA_CONG_CHUNG": targetTierName = "Người Của Công Chúng"; break;
                        case "SAT_THU_LICH_LAM": targetTierName = "Sát Thủ Lịch Lãm"; break;
                        case "BIEU_TUONG_THOI_DAI": targetTierName = "Biểu Tượng Thời Đại"; break;
                        case "VU_TRU_NHAN_SAC": targetTierName = "Vũ Trụ Nhan Sắc"; break;
                        default: targetTierName = voucher.getMembershipLevel();
                    }

                    if (currentTier.equalsIgnoreCase(targetTierName)) {
                        isEligible = true;
                        note = "Chúc mừng thành viên hạng " + currentTier + " nhận được ưu đãi riêng!";
                    }
                }
            }

            if (isEligible) {
                CustomerVoucher cv = new CustomerVoucher();
                cv.setUser(user);
                cv.setVoucher(voucher);
                cv.setCode(voucher.getCode());
                cv.setStatus("UNUSED");
                cv.setNote(note);
                cv.setClaimedAt(LocalDateTime.now());
                cv.setStartDate(voucher.getStartDate());
                cv.setEndDate(voucher.getEndDate());
                customerVoucherRepository.save(cv);

                voucher.setUsedQuantity(voucher.getUsedQuantity() + 1);
                voucherRepository.save(voucher);

                String title = "🎁 Bạn Nhận Được Voucher Mới!";
                String prefix = "Hệ thống tự động tặng bạn voucher mới.";
                if ("NEW_CUSTOMER".equals(issueType)) {
                    title = "🎉 Chào mừng bạn đến với HORNET ROYALE!";
                    prefix = "Cảm ơn bạn đã đăng ký tài khoản thành viên Hornet Royale! Bạn vừa nhận được voucher chào mừng: " + voucher.getCode();
                } else if ("BIRTHDAY".equals(issueType)) {
                    title = "🎂 HORNET ROYALE chúc bạn sinh nhật vui vẻ!";
                    prefix = "Nhân dịp sinh nhật, chúng tôi gửi tặng bạn voucher đặc biệt: " + voucher.getCode();
                } else if ("MEMBERSHIP".equals(issueType)) {
                    long completedBookings = bookingRepository.getCompletedBookingCount(userId);
                    String currentTier = customerService.getCustomerTier(completedBookings);
                    title = "⭐ Chúc mừng bạn đã đạt cấp: " + currentTier;
                    prefix = "Bạn vừa nhận được voucher đặc quyền hội viên: " + voucher.getCode();
                }
                sendVoucherNotification(user, voucher, issueType, title, prefix, note);
            }
        }
    }

    // Cron or Trigger-based birthday evaluations
    @Transactional
    public void evaluateBirthdayVouchers() {
        LocalDate today = LocalDate.now();
        List<User> users = userRepository.findAll();
        for (User u : users) {
            if ("USER".equalsIgnoreCase(u.getRole()) && u.getBirthday() != null) {
                LocalDate bday = u.getBirthday();
                if (bday.getMonth() == today.getMonth() && bday.getDayOfMonth() == today.getDayOfMonth()) {
                    evaluateCampaigns(u.getId(), "BIRTHDAY", null);
                }
            }
        }
    }

    // ==========================================
    // VOUCHER APPLICATION & CALCULATION
    // ==========================================

    public Map<String, Object> validateAndCalculateDiscount(Integer userId, Integer customerVoucherId, String applyTo, Double amount) {
        CustomerVoucher cv = customerVoucherRepository.findByIdAndUserId(customerVoucherId, userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher trong ví của bạn!"));

        if (!"UNUSED".equalsIgnoreCase(cv.getStatus())) {
            throw new RuntimeException("Voucher này đã được sử dụng hoặc đã hết hạn!");
        }

        Voucher voucher = cv.getVoucher();
        LocalDateTime now = LocalDateTime.now();

        if (cv.getStartDate() != null && cv.getStartDate().isAfter(now)) {
            throw new RuntimeException("Voucher chưa đến thời gian bắt đầu áp dụng!");
        }

        if (cv.getEndDate() != null && cv.getEndDate().isBefore(now)) {
            cv.setStatus("EXPIRED");
            customerVoucherRepository.save(cv);
            throw new RuntimeException("Voucher này đã hết hạn sử dụng!");
        }

        // Check target constraint: applyTo can be SERVICE, PRODUCT, ALL
        if (!"ALL".equalsIgnoreCase(voucher.getApplyTo()) && !voucher.getApplyTo().equalsIgnoreCase(applyTo)) {
            String targetDisplay = "SERVICE".equalsIgnoreCase(voucher.getApplyTo()) ? "Dịch Vụ" : "Sản Phẩm";
            throw new RuntimeException("Voucher này chỉ có hiệu lực áp dụng cho đơn hàng " + targetDisplay + "!");
        }

        // Check min order value
        if (voucher.getMinOrderValue() != null && amount < voucher.getMinOrderValue()) {
            throw new RuntimeException("Đơn hàng chưa đạt giá trị tối thiểu " + String.format("%,.0f", voucher.getMinOrderValue()) + "đ để áp dụng voucher này!");
        }

        // Calculate discount
        double discount = 0;
        if ("FIXED".equalsIgnoreCase(voucher.getVoucherType())) {
            discount = voucher.getValue();
        } else if ("PERCENTAGE".equalsIgnoreCase(voucher.getVoucherType())) {
            discount = amount * (voucher.getValue() / 100.0);
            if (voucher.getMaxDiscount() != null && voucher.getMaxDiscount() > 0 && discount > voucher.getMaxDiscount()) {
                discount = voucher.getMaxDiscount();
            }
        } else if ("FREE_SERVICE".equalsIgnoreCase(voucher.getVoucherType())) {
            // Treat FREE_SERVICE as flat discount equal to the amount or service value limit
            discount = voucher.getValue();
        }

        // Discount cannot exceed amount
        if (discount > amount) {
            discount = amount;
        }

        double finalAmount = amount - discount;

        return Map.of(
            "valid", true,
            "voucherId", voucher.getId(),
            "customerVoucherId", cv.getId(),
            "code", voucher.getCode(),
            "name", voucher.getName(),
            "discountAmount", discount,
            "finalAmount", finalAmount
        );
    }

    @Transactional
    public void useVoucher(Integer userId, Integer customerVoucherId, Long orderId, Long bookingId) {
        CustomerVoucher cv = customerVoucherRepository.findByIdAndUserId(customerVoucherId, userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher trong ví của bạn!"));

        if ("EXPIRED".equalsIgnoreCase(cv.getStatus())) {
            throw new RuntimeException("Voucher này đã hết hạn!");
        }

        if ("USED".equalsIgnoreCase(cv.getStatus())) {
            throw new RuntimeException("Voucher này đã hết lượt sử dụng!");
        }
        
        Integer limit = cv.getVoucher().getUserLimit();
        if (limit == null) limit = 1;

        if (cv.getUsedCount() >= limit) {
            throw new RuntimeException("Voucher này đã hết lượt sử dụng!");
        }

        cv.setUsedCount(cv.getUsedCount() + 1);
        
        if (cv.getUsedCount() >= limit) {
            cv.setStatus("USED");
        }
        
        cv.setUsedAt(LocalDateTime.now());
        if (orderId != null) {
            cv.setOrderId(orderId);
        }
        if (bookingId != null) {
            cv.setBookingId(bookingId);
        }
        customerVoucherRepository.save(cv);
    }

    @Transactional
    public void releaseVoucher(Integer userId, Integer customerVoucherId) {
        CustomerVoucher cv = customerVoucherRepository.findByIdAndUserId(customerVoucherId, userId).orElse(null);
        if (cv != null && cv.getUsedCount() > 0) {
            cv.setUsedCount(cv.getUsedCount() - 1);
            
            Integer limit = cv.getVoucher().getUserLimit();
            if (limit == null) limit = 1;
            
            if (cv.getUsedCount() < limit) {
                cv.setStatus("UNUSED");
            }
            
            // Note: We might clear orderId/bookingId here if we only track the last one,
            // but since they could have used it multiple times, clearing it might erase history.
            // For simplicity, we just leave usedAt/orderId/bookingId as the last usage record.
            
            customerVoucherRepository.save(cv);
        }
    }

    @Transactional
    public CustomerVoucher claimVoucher(Integer userId, Integer voucherId) {
        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher!"));

        if (!"ACTIVE".equalsIgnoreCase(voucher.getStatus())) {
            throw new RuntimeException("Voucher này hiện không khả dụng!");
        }
        
        if (voucher.getEndDate() != null && voucher.getEndDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Voucher này đã hết hạn!");
        }

        // Kiểm tra xem user đã nhận chưa
        boolean alreadyClaimed = customerVoucherRepository.existsByUserIdAndVoucherId(userId, voucherId);
        if (alreadyClaimed) {
            throw new RuntimeException("Bạn đã nhận voucher này rồi!");
        }

        // Kiểm tra số lượng
        if (voucher.getTotalQuantity() > 0 && voucher.getUsedQuantity() >= voucher.getTotalQuantity()) {
            throw new RuntimeException("Voucher này đã hết số lượng phát hành!");
        }

        User user = new User();
        user.setId(userId);

        CustomerVoucher cv = new CustomerVoucher();
        cv.setUser(user);
        cv.setVoucher(voucher);
        cv.setCode(voucher.getCode());
        cv.setStatus("UNUSED");
        cv.setStartDate(voucher.getStartDate());
        cv.setEndDate(voucher.getEndDate());
        cv.setUsedCount(0);
        
        customerVoucherRepository.save(cv);
        
        voucher.setUsedQuantity(voucher.getUsedQuantity() + 1);
        voucherRepository.save(voucher);
        
        return cv;
    }

    @Transactional
    public void pauseExpiredVouchers() {
        LocalDateTime now = LocalDateTime.now();
        List<Voucher> activeVouchers = voucherRepository.findAll();
        for (Voucher v : activeVouchers) {
            if ("ACTIVE".equalsIgnoreCase(v.getStatus()) && v.getEndDate() != null && v.getEndDate().isBefore(now)) {
                v.setStatus("PAUSED");
                voucherRepository.save(v);
                System.out.println("[Scheduler] Automatically paused expired voucher: " + v.getCode());
            }
        }
    }

    @Transactional
    public List<CustomerVoucher> giftBirthdayVouchers(Integer voucherId, Integer month) {
        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher!"));

        LocalDateTime now = LocalDateTime.now();
        if (voucher.getEndDate() != null && voucher.getEndDate().isBefore(now)) {
            throw new RuntimeException("Voucher đã hết thời hạn sử dụng. Vui lòng sửa lại thời gian kết thúc trước khi phát hành!");
        }

        // Set voucher status to ACTIVE and issueType to BIRTHDAY, and save
        voucher.setStatus("ACTIVE");
        voucher.setIssueType("BIRTHDAY");
        voucher.setBirthMonth(month);
        voucherRepository.save(voucher);

        List<User> users = userRepository.findAll();
        List<CustomerVoucher> issuedList = new java.util.ArrayList<>();

        for (User u : users) {
            if ("USER".equalsIgnoreCase(u.getRole()) && u.getBirthday() != null) {
                if (u.getBirthday().getMonthValue() == month) {
                    // Check if already has this voucher this year
                    int currentYear = LocalDate.now().getYear();
                    if (customerVoucherRepository.existsByUserIdAndVoucherIdAndYear(u.getId(), voucher.getId(), currentYear)) {
                        continue;
                    }

                    CustomerVoucher cv = new CustomerVoucher();
                    cv.setUser(u);
                    cv.setVoucher(voucher);
                    cv.setCode(voucher.getCode());
                    cv.setStatus("UNUSED");
                    cv.setNote("Chúc mừng sinh nhật tháng " + month + "! Hornet Royale kính chúc bạn tuổi mới ngập tràn niềm vui!");
                    cv.setClaimedAt(now);
                    cv.setStartDate(voucher.getStartDate());
                    cv.setEndDate(voucher.getEndDate());
                    customerVoucherRepository.save(cv);
                    issuedList.add(cv);

                    voucher.setUsedQuantity(voucher.getUsedQuantity() + 1);

                    String title = "🎂 HORNET ROYALE chúc bạn sinh nhật vui vẻ!";
                    String prefix = "Nhân dịp tháng sinh nhật (Tháng " + month + "), chúng tôi gửi tặng bạn voucher đặc biệt: " + voucher.getCode();
                    sendVoucherNotification(u, voucher, "BIRTHDAY", title, prefix, "Quà tặng sinh nhật tháng " + month);
                }
            }
        }

        voucherRepository.save(voucher);
        return issuedList;
    }

    private void sendVoucherNotification(User user, Voucher voucher, String issueType, String customTitle, String customPrefix, String details) {
        Notification notification = new Notification();
        notification.setUser(user);

        // Determine title
        String finalTitle = voucher.getNotificationTitle() != null && !voucher.getNotificationTitle().trim().isEmpty() 
            ? voucher.getNotificationTitle() 
            : (customTitle != null ? customTitle : "🎁 Bạn Nhận Được Voucher Mới!");
        notification.setTitle(finalTitle);

        // Format discount value
        String discountStr = "";
        if ("FREE_SERVICE".equalsIgnoreCase(voucher.getVoucherType())) {
            discountStr = "Miễn phí dịch vụ";
        } else if ("PERCENTAGE".equalsIgnoreCase(voucher.getVoucherType())) {
            discountStr = voucher.getValue() + "%";
            if (voucher.getMaxDiscount() != null && voucher.getMaxDiscount() > 0) {
                discountStr += " (Giảm tối đa " + String.format("%,.0f", voucher.getMaxDiscount()) + "đ)";
            }
        } else {
            discountStr = String.format("%,.0f", voucher.getValue()) + "đ";
        }

        // Format applyTo
        String applyToStr = "Dịch Vụ + Sản Phẩm";
        if ("SERVICE".equalsIgnoreCase(voucher.getApplyTo())) {
            applyToStr = "Dịch Vụ";
        } else if ("PRODUCT".equalsIgnoreCase(voucher.getApplyTo())) {
            applyToStr = "Sản Phẩm";
        }

        // Format expiry date
        String expiryStr = "Vô thời hạn";
        if (voucher.getEndDate() != null) {
            expiryStr = voucher.getEndDate().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
        }

        // Format event/issue type
        String eventStr = "Ưu đãi đặc biệt";
        if ("NEW_CUSTOMER".equalsIgnoreCase(issueType)) {
            eventStr = "Khách Hàng Mới";
        } else if ("BIRTHDAY".equalsIgnoreCase(issueType)) {
            eventStr = "Sinh Nhật";
        } else if ("MEMBERSHIP".equalsIgnoreCase(issueType)) {
            eventStr = "Hội Viên";
        } else if ("MANUAL".equalsIgnoreCase(issueType)) {
            eventStr = "Tặng Riêng";
        } else if ("ALL_CUSTOMERS".equalsIgnoreCase(issueType)) {
            eventStr = "Toàn Bộ Khách Hàng";
        }

        // Build structured message
        StringBuilder sb = new StringBuilder();
        
        // 1. Custom message from admin (if any)
        if (voucher.getNotificationMessage() != null && !voucher.getNotificationMessage().trim().isEmpty()) {
            sb.append(voucher.getNotificationMessage()).append("\n\n");
        } 
        // 2. Or default prefix (if any)
        else if (customPrefix != null && !customPrefix.isEmpty()) {
            sb.append(customPrefix).append("\n\n");
        }

        sb.append("--- THÔNG TIN VOUCHER ---\n");
        sb.append("🎫 Tên voucher: ").append(voucher.getName()).append("\n");
        sb.append("🎟️ Mã voucher: ").append(voucher.getCode()).append("\n");
        sb.append("📅 Sự kiện: ").append(eventStr).append("\n");
        sb.append("🎯 Áp dụng: ").append(applyToStr).append("\n");
        sb.append("💰 Giảm giá: ").append(discountStr).append("\n");
        if (voucher.getMinOrderValue() != null && voucher.getMinOrderValue() > 0) {
            sb.append("⚡ Đơn tối thiểu: ").append(String.format("%,.0f", voucher.getMinOrderValue())).append("đ\n");
        }
        sb.append("⏰ Hạn dùng: ").append(expiryStr).append("\n");
        if (details != null && !details.isEmpty()) {
            sb.append("\nℹ️ Chi tiết: ").append(details);
        }
        String finalMessage = sb.toString();

        notification.setMessage(finalMessage);
        notification.setType("system");
        notificationRepository.save(notification);
    }
}
