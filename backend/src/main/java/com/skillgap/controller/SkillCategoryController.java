package com.skillgap.controller;

import com.skillgap.dto.request.SkillCategoryRequest;
import com.skillgap.dto.response.SkillCategoryResponse;
import com.skillgap.service.SkillCategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class SkillCategoryController {

    private final SkillCategoryService categoryService;

    public SkillCategoryController(SkillCategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<SkillCategoryResponse>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    @PostMapping
    public ResponseEntity<SkillCategoryResponse> create(@Valid @RequestBody SkillCategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SkillCategoryResponse> update(@PathVariable Long id,
                                                         @Valid @RequestBody SkillCategoryRequest request) {
        return ResponseEntity.ok(categoryService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
