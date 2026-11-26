package com.skillgap.controller;

import com.skillgap.dto.request.ResourceRequest;
import com.skillgap.dto.response.LearningResourceResponse;
import com.skillgap.service.LearningResourceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class LearningResourceController {

    private final LearningResourceService resourceService;

    public LearningResourceController(LearningResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public ResponseEntity<List<LearningResourceResponse>> getAll() {
        return ResponseEntity.ok(resourceService.getAll());
    }

    @GetMapping("/skill/{skillId}")
    public ResponseEntity<List<LearningResourceResponse>> getBySkill(@PathVariable Long skillId) {
        return ResponseEntity.ok(resourceService.getBySkill(skillId));
    }

    @PostMapping
    public ResponseEntity<LearningResourceResponse> create(@Valid @RequestBody ResourceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resourceService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningResourceResponse> update(@PathVariable Long id,
                                                            @Valid @RequestBody ResourceRequest request) {
        return ResponseEntity.ok(resourceService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        resourceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
