package com.example.crzst.expenses.controller;


import com.example.crzst.expenses.model.User;
import com.example.crzst.expenses.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/")
    Collection<User> users(){
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    ResponseEntity<?> getUser(@PathVariable Long id){
        Optional<User> user = userRepository.findById(id);
        return user.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /*
    // Not using update for user.. If implemented, move to authController
    @PutMapping("/{id}")
    ResponseEntity<User> updateUser(@Valid @RequestBody User user, @PathVariable Long id){
        Optional<User> target = userRepository.findById(user.getId());
        if(target.isPresent() && user.getId() == id){
            User result = userRepository.save(user);
            return ResponseEntity.ok().body(result);
        }
        return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
    }
    */

    @DeleteMapping("/user/{id}")
    ResponseEntity<?> deleteUser(@PathVariable Long id){
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
