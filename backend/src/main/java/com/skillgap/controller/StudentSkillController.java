package com.skillgap.controller;

import com.skillgap.dto.request.StudentSkillRequest;
import com.skillgap.dto.response.StudentSkillResponse;
import com.skillgap.service.StudentSkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-skills")
public class StudentSkillController {

    private final StudentSkillService studentSkillService;

    public StudentSkillController(StudentSkillService studentSkillService) {
        this.studentSkillService = studentSkillService;
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<List<StudentSkillResponse>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(studentSkillService.getByStudentId(studentId));
    }

    @PostMapping
    public ResponseEntity<StudentSkillResponse> add(@Valid @RequestBody StudentSkillRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentSkillService.add(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentSkillResponse> update(@PathVariable Long id,
                                                        @Valid @RequestBody StudentSkillRequest request) {
        return ResponseEntity.ok(studentSkillService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        studentSkillService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
