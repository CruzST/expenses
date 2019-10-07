package com.example.crzst.expenses.controller;


import com.example.crzst.expenses.model.Category;
import com.example.crzst.expenses.model.Expense;
import com.example.crzst.expenses.model.User;
import com.example.crzst.expenses.payload.ExpenseRequest;
import com.example.crzst.expenses.repository.CategoryRepository;
import com.example.crzst.expenses.repository.ExpenseRepository;
import com.example.crzst.expenses.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses") // prefix for this controller
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    /*
        // Autowired is the equivlent to having a constructor and doing the following:

        private ExpenseRepository expenseRepository;
        public ExpenseController(ExpenseRepository expenseRepository) {
            super();
            this.expenseRepository = expenseRepository;
        }

     */

    @GetMapping("/")
    Collection<Expense> expenses(){
        return expenseRepository.findAll();
    }

    @GetMapping("/user/{id}")
    List<Expense> getExpenseByUser(@PathVariable Long id){
        return expenseRepository.getExpenseByPersonId(id);
    }

    @GetMapping("/{id}")
    ResponseEntity<?> getExpense(@PathVariable Long id){
        Optional<Expense> expense = expenseRepository.findById(id);
        return expense.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }


    @PostMapping("/new")
    ResponseEntity<Expense> createExpense(@RequestBody @Valid ExpenseRequest expenseRequest) throws URISyntaxException {
        // get category
        Category category = categoryRepository.findByNameIgnoreCase(expenseRequest.getCategory());

        // get user https://stackoverflow.com/questions/50185164/spring-boot-how-to-pass-optional-to-an-entity-class
        // targetuser SHOULD exist, but Java8 has some issuse with optional. to use the found target user, set an variable to it
        Optional<User> targetUser = userRepository.findById(expenseRequest.getUserID());
        User user = targetUser.get();

        Expense newExpense = new Expense(null, expenseRequest.getName(),
                expenseRequest.getPrice(), expenseRequest.getDescription(),
                expenseRequest.getLocation(), expenseRequest.getExpenseDate(), category, user);

        Expense result = expenseRepository.save(newExpense);
        return ResponseEntity.created(new URI("/api/expense" + result.getId())).body(result);
    }


    // Update needs rework

    @PutMapping("/{id}")
    ResponseEntity<Expense> updateExpense(@Valid @RequestBody ExpenseRequest expenseRequest, @PathVariable Long id){
        Optional<Expense> target = expenseRepository.findById(id);
        if(target.isPresent()){

            // get category
            Category category = categoryRepository.findByNameIgnoreCase(expenseRequest.getCategory());

            // get user
            Optional<User> targetUser = userRepository.findById(expenseRequest.getUserID());
            User user = targetUser.get();

            //create new expense with the id instead of null
            Expense newExpense = new Expense(id, expenseRequest.getName(),
                    expenseRequest.getPrice(), expenseRequest.getDescription(),
                    expenseRequest.getLocation(), expenseRequest.getExpenseDate(), category, user);

            Expense result = expenseRepository.save(newExpense);
            return ResponseEntity.ok().body(result);
        }
        return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
    }


    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteExpense(@PathVariable Long id){
        expenseRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
