package com.example.crzst.expenses.controller;


import com.example.crzst.expenses.model.Category;
import com.example.crzst.expenses.payload.CategoryRequest;
import com.example.crzst.expenses.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories") // prefix for this controller
public class CategoryController {

    private CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        super();
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/")
    Collection<Category> categories(){
        // findall = SELECT * FROM CATEGORY
        return categoryRepository.findAll();
    }

    @GetMapping("/{id}")
    ResponseEntity<?> getCategory(@PathVariable Long id){
        Optional<Category> category = categoryRepository.findById(id);
        return category.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/new")
    ResponseEntity<Category> createCategory(@RequestBody @Valid CategoryRequest categoryRequest) throws URISyntaxException {
        Optional<Category> target = Optional.ofNullable(categoryRepository.findByNameIgnoreCase(categoryRequest.getName()));
        if(target.isPresent()){
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        Category newCategory = new Category(null, categoryRequest.getName());
        // JPA .save is like insert into categry values category
        Category result = categoryRepository.save(newCategory);
        return ResponseEntity.created(new URI("/api/category/" + result.getId())).body(result);
    }

    /*
    // Update needs rework
    @PutMapping("/{id}")
    ResponseEntity<Category> updateCategory(@Valid @RequestBody Category category, @PathVariable Long id){
        Optional<Category> target = categoryRepository.findById(id);
        if (target.isPresent() && category.getId() == id){
            Category result = categoryRepository.save(category);
            return ResponseEntity.ok().body(result);
        }
        return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
    }
    */

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteCategory(@PathVariable Long id){
        categoryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
