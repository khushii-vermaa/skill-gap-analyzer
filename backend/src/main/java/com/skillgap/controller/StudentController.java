package com.skillgap.controller;

import com.skillgap.dto.request.StudentRequest;
import com.skillgap.dto.request.StudentStatusRequest;
import com.skillgap.dto.response.StudentResponse;
import com.skillgap.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<List<StudentResponse>> getAll() {
        return ResponseEntity.ok(studentService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponse> update(@PathVariable Long id,
                                                   @Valid @RequestBody StudentRequest request) {
        return ResponseEntity.ok(studentService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<StudentResponse> updateStatus(@PathVariable Long id,
                                                         @Valid @RequestBody StudentStatusRequest request) {
        return ResponseEntity.ok(studentService.updateStatus(id, request.active()));
    }
}
