package com.example.API_java;

import com.example.API_java.entity.Service;
import com.example.API_java.entity.Staff;
import com.example.API_java.repository.ServiceRepository;
import com.example.API_java.repository.StaffRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ApiJavaApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiJavaApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedStaff(StaffRepository staffRepository) {
		return args -> {
			if (staffRepository.count() == 0) {
				staffRepository.save(createStaff("Minh Tuấn", "Cắt tóc nam, Fade", "0901234567", "tuan@example.com", "Quận 1", 5, true, 142, 5.0));
				staffRepository.save(createStaff("Đức Anh", "Uốn, Nhuộm", "0901234568", "anh@example.com", "Quận 2", 3, true, 98, 4.5));
				staffRepository.save(createStaff("Hoàng Nam", "Cắt tóc, Cạo râu", "0901234569", "nam@example.com", "Quận 7", 7, true, 120, 4.0));
				staffRepository.save(createStaff("Quang Huy", "Tạo kiểu, Gội massage", "0901234570", "huy@example.com", "Bình Thạnh", 2, true, 85, 0.0));
				System.out.println(">>> ĐÃ SEED DỮ LIỆU THỢ MẪU <<<");
			}
		};
	}

	@Bean
	public CommandLineRunner seedServices(ServiceRepository serviceRepository) {
		return args -> {
			if (serviceRepository.count() == 0) {
				Service s1 = new Service();
				s1.setName("Combo Cắt Gội Premium");
				s1.setDescription("Cắt tạo kiểu, gội đầu thư giãn, massage mặt và vuốt sáp tạo kiểu chuẩn quý ông.");
				s1.setPrice(new java.math.BigDecimal("250000"));
				s1.setDuration(60);
				s1.setImage("images/services/combo-premium.jpg");
				s1.setStatus("active");
				serviceRepository.save(s1);

				Service s2 = new Service();
				s2.setName("Uốn Tóc Hàn Quốc");
				s2.setDescription("Uốn phồng, uốn xoăn nhẹ nhàng giữ nếp lâu dài, sử dụng thuốc uốn cao cấp bảo vệ tóc.");
				s2.setPrice(new java.math.BigDecimal("450000"));
				s2.setDuration(120);
				s2.setImage("images/services/uon-han-quoc.jpg");
				s2.setStatus("active");
				serviceRepository.save(s2);

				Service s3 = new Service();
				s3.setName("Nhuộm Màu Thời Trang");
				s3.setDescription("Đa dạng bảng màu từ trầm đến sáng, thuốc nhuộm chính hãng giúp màu bền và tóc bóng mượt.");
				s3.setPrice(new java.math.BigDecimal("350000"));
				s3.setDuration(90);
				s3.setImage("images/services/nhuom-thoi-trang.jpg");
				s3.setStatus("active");
				serviceRepository.save(s3);

				System.out.println(">>> ĐÃ SEED DỮ LIỆU DỊCH VỤ MẪU <<<");
			}
		};
	}

	private Staff createStaff(String name, String specialty, String phone, String email, String branch, Integer experienceYears, Boolean isActive, Integer orderCount, Double rating) {
		Staff staff = new Staff();
		staff.setName(name);
		staff.setSpecialty(specialty);
		staff.setPhone(phone);
		staff.setEmail(email);
		staff.setBranch(branch);
		staff.setExperienceYears(experienceYears);
		staff.setIsActive(isActive);
		staff.setOrderCount(orderCount);
		staff.setRating(rating);
		return staff;
	}
}
