package com.example.crzst.expenses.controller;


import com.example.crzst.expenses.Security.JwtTokenProvider;
import com.example.crzst.expenses.model.Role;
import com.example.crzst.expenses.model.User;
import com.example.crzst.expenses.payload.ApiResponse;
import com.example.crzst.expenses.payload.JwtAuthenticationResponse;
import com.example.crzst.expenses.payload.LoginRequest;
import com.example.crzst.expenses.payload.SignUpRequest;
import com.example.crzst.expenses.repository.RoleRepository;
import com.example.crzst.expenses.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) throws UnsupportedEncodingException {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )

        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // REQUIRES THE THROW, SEE jwtTokenProvider
        String jwt = jwtTokenProvider.generateToken(authentication);
        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
    }



    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest)throws URISyntaxException {

        // Check if the user is already in the repo
        if (userRepository.existsByEmail(signUpRequest.getEmail())){
            return new ResponseEntity(new ApiResponse(false, "Email is alredy taken."), HttpStatus.CONFLICT);
        }

        // get the role (it will always be 2: USER
        Optional<Role> roleOptional = roleRepository.findById(2L);
        Set<Role> roles = new HashSet<>();
        roles.add(roleOptional.get());

        // continue and create acccount, for somereason. Instancing the roles led to an error
        User user = new User(null, signUpRequest.getName(), signUpRequest.getEmail(), signUpRequest.getPassword(), null);
        user.setRoles(roles);

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
        String encodedPassword = encoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        User result = userRepository.save(user);
        return ResponseEntity.created(new URI("/api/user/" + result.getId())).body(new ApiResponse(true, "User registered successfully"));

    }



}
