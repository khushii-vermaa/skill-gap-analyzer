package com.skillgap.controller;

import com.skillgap.dto.response.AssessmentResponse;
import com.skillgap.service.AssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping
    public ResponseEntity<List<AssessmentResponse>> getAll() {
        return ResponseEntity.ok(assessmentService.getAll());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AssessmentResponse>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(assessmentService.getByStudent(studentId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssessmentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(assessmentService.getById(id));
    }

    @GetMapping("/student/{studentId}/latest")
    public ResponseEntity<AssessmentResponse> getLatest(@PathVariable Long studentId) {
        return ResponseEntity.ok(assessmentService.getLatest(studentId));
    }
}
