package com.example.crzst.expenses.repository;

import com.example.crzst.expenses.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}
