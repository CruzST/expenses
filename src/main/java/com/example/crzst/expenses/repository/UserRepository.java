package com.example.crzst.expenses.repository;

import com.example.crzst.expenses.model.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Long> {
    User findByName(String name);
    User findByEmail(String email);
    Boolean existsByEmail(String email);
}
