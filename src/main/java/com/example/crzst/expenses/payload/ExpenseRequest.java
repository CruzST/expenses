package com.example.crzst.expenses.payload;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class ExpenseRequest {
    private String name;

    private float price;

    private String description;

    private String location;

    private Instant expenseDate;

    private String category;

    private Long userID;
}
