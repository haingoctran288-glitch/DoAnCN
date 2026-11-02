package com.example.API_java.config;

import com.example.API_java.entity.Service;
import com.example.API_java.entity.User;
import com.example.API_java.entity.SalarySetting;
import com.example.API_java.entity.ExperienceSalary;
import com.example.API_java.repository.ServiceRepository;
import com.example.API_java.repository.UserRepository;
import com.example.API_java.repository.SalarySettingRepository;
import com.example.API_java.repository.ExperienceSalaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;

@Configuration
public class DataInitializer {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SalarySettingRepository salarySettingRepository;

    @Autowired
    private ExperienceSalaryRepository experienceSalaryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Bean
    public CommandLineRunner initServices() {
        return args -> {
            // Seed Admin Account
            if (userRepository.findByUsername("adminql").isEmpty()) {
                User admin = new User();
                admin.setUsername("adminql");
                admin.setPassword(passwordEncoder.encode("147852"));
                admin.setFullName("Admin Boss");
                admin.setRole("ADMIN"); // Admin Role
                userRepository.save(admin);
                System.out.println("✅ Seeded default admin account (adminql).");
            }

            if (salarySettingRepository.count() == 0) {
                SalarySetting setting = new SalarySetting();
                setting.setCommissionRate(15.0);
                setting.setPermittedLeaveDeductionRate(70.0);
                setting.setUnpermittedLeaveDeductionRate(100.0);
                setting.setUnpermittedLeavePenalty(100000.0);
                setting.setLatePenalty(50000.0);
                salarySettingRepository.save(setting);
            }

            if (experienceSalaryRepository.count() == 0) {
                double[] baseSalaries = {5000000, 5500000, 6000000, 6500000, 7000000, 8000000, 8500000, 9000000, 9500000, 10000000, 10500000};
                for (int i = 0; i < baseSalaries.length; i++) {
                    ExperienceSalary ex = new ExperienceSalary();
                    ex.setYearsOfExperience(i);
                    ex.setBaseSalary(baseSalaries[i]);
                    experienceSalaryRepository.save(ex);
                }
            }

            try {
                jdbcTemplate.execute("DROP TABLE IF EXISTS combo_service_items");
                System.out.println("✅ Dropped old combo_service_items table.");
            } catch (Exception e) {
                System.out.println("⚠️ Could not drop combo_service_items: " + e.getMessage());
            }

            try {
                jdbcTemplate.execute("ALTER TABLE vouchers MODIFY COLUMN start_date DATETIME NULL");
                jdbcTemplate.execute("ALTER TABLE vouchers MODIFY COLUMN end_date DATETIME NULL");
                jdbcTemplate.execute("ALTER TABLE vouchers MODIFY COLUMN campaign_start_date DATETIME NULL");
                jdbcTemplate.execute("ALTER TABLE vouchers MODIFY COLUMN campaign_end_date DATETIME NULL");
                System.out.println("✅ Altered vouchers table to allow null dates.");
            } catch (Exception e) {
                System.out.println("⚠️ Could not alter vouchers table: " + e.getMessage());
            }

            try {
                jdbcTemplate.execute("DELETE FROM services WHERE main_category IN ('TAI_DIA_DIEM', 'DAM_TIEC')");
                jdbcTemplate.execute("DELETE FROM service_categories WHERE code IN ('TAI_DIA_DIEM', 'DAM_TIEC')");
                System.out.println("✅ Cleaned up old TAI_DIA_DIEM and DAM_TIEC data.");
            } catch (Exception e) {
                System.out.println("⚠️ Could not clean up old data: " + e.getMessage());
            }

            // MIGRATION: Gán Service cũ vào mainCategory và subCategory mới
            List<Service> unassignedServices = serviceRepository.findAll().stream()
                    .filter(s -> s.getMainCategory() == null)
                    .toList();
            
            if (!unassignedServices.isEmpty()) {
                System.out.println("🔄 Migrating " + unassignedServices.size() + " old services to new category structure...");
                
                for (Service s : unassignedServices) {
                    // Tạo slug
                    s.setSlug("service-" + s.getId() + "-" + System.currentTimeMillis());
                    
                    // Set genderType mặc định
                    if (s.getCategoryType() != null) {
                        if ("nu".equals(s.getCategoryType())) s.setGenderType("female");
                    }
                    
                    // Xác định mainCategory dựa trên categoryType
                    String mainCat = "NAM";
                    if ("nu".equals(s.getCategoryType())) mainCat = "NU";

                    s.setMainCategory(mainCat);
                    
                    // Xác định subCategory dựa trên tên dịch vụ
                    String nameLower = s.getName().toLowerCase();
                    
                    if (mainCat.equals("NAM")) {
                        if (nameLower.contains("uốn") || nameLower.contains("nhuộm") || nameLower.contains("ép")) s.setSubCategory("UON_NHUOM_EP_TOC");
                        else s.setSubCategory("CAT_TOC_CHAM_SOC_DA_RAU");
                    } else if (mainCat.equals("NU")) {
                        if (nameLower.contains("uốn") || nameLower.contains("nhuộm") || nameLower.contains("ép")) s.setSubCategory("UON_NHUOM_EP_TOC");
                        else s.setSubCategory("CAT_TOC_CHAM_SOC_TOC");
                    }
                    
                    serviceRepository.save(s);
                }
                System.out.println("✅ Migration completed.");
            }
        };
    }
}
