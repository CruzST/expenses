package com.example.crzst.expenses.repository;

import com.example.crzst.expenses.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CategoryRepository extends JpaRepository<Category, Long> {
  // declaring this interface maps the category class to a db via jpa with a PK of long
    Category findByNameIgnoreCase(String name);
}
