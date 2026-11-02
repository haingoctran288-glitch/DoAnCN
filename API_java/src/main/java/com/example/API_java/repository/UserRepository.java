package com.example.API_java.repository;

import com.example.API_java.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository truy vấn bảng users
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // Tìm user theo username
    Optional<User> findByUsername(String username);

    // Tìm user theo email
    Optional<User> findByEmail(String email);

    // Kiểm tra username đã tồn tại chưa
    Boolean existsByUsername(String username);

    // Kiểm tra email đã tồn tại chưa
    Boolean existsByEmail(String email);

    // Tìm kiếm phân quyền
    java.util.List<User> findByRole(String role);
    java.util.List<User> findByRoleAndBranch(String role, String branch);
    Optional<User> findByEmployeeId(Integer employeeId);
}
