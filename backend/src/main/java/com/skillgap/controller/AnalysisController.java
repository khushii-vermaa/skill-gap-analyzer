package com.skillgap.controller;

import com.skillgap.dto.response.AssessmentDetailResponse;
import com.skillgap.dto.response.AssessmentResponse;
import com.skillgap.service.AssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {

    private final AssessmentService assessmentService;

    public AnalysisController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @PostMapping("/{studentId}/{jobRoleId}")
    public ResponseEntity<AssessmentResponse> runAnalysis(@PathVariable Long studentId,
                                                           @PathVariable Long jobRoleId) {
        return ResponseEntity.ok(assessmentService.runAnalysis(studentId, jobRoleId));
    }

    @GetMapping("/{assessmentId}")
    public ResponseEntity<AssessmentResponse> getResult(@PathVariable Long assessmentId) {
        return ResponseEntity.ok(assessmentService.getById(assessmentId));
    }

    @GetMapping("/{assessmentId}/details")
    public ResponseEntity<List<AssessmentDetailResponse>> getDetails(@PathVariable Long assessmentId) {
        return ResponseEntity.ok(assessmentService.getDetails(assessmentId));
    }
}
