package com.example.crzst.expenses.repository;

import com.example.crzst.expenses.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    Expense findByName(String name);


    @Query(value="SELECT * FROM expense e WHERE e.USER_ID=?1", nativeQuery = true)
    List<Expense> getExpenseByPersonId(Long id);

}
