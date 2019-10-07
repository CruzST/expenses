package com.example.crzst.expenses.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name="category")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Category {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    // Type of expense
    private String name;

    /*
    // Cascade changes
    @ManyToOne(cascade= CascadeType.PERSIST)
    private User user;
    */
}
