package com.example.crzst.expenses.payload;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@AllArgsConstructor
@Data
public class LoginRequest {

    @NotBlank
    private String email;

    @NotBlank
    private String password;
}
