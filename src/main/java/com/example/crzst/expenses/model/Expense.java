package com.example.crzst.expenses.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.Instant;


@Entity
@Table(name="expense")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Expense {
    // Table columns will be the variable all caps.
    // Except the many2one, that will be USER_ID
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private float price;

    private String description;

    private String location;

    private Instant expenseDate;

    @ManyToOne
    private Category category;

    @ManyToOne
    private User user;

}
