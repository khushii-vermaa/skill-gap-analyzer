package com.skillgap.controller;

import com.skillgap.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(reportService.getSummary());
    }

    @GetMapping("/job-roles")
    public ResponseEntity<List<Map<String, Object>>> getJobRolesReport() {
        return ResponseEntity.ok(reportService.getJobRolesReport());
    }

    @GetMapping("/skills")
    public ResponseEntity<List<Map<String, Object>>> getSkillsReport() {
        return ResponseEntity.ok(reportService.getSkillsReport());
    }

    @GetMapping("/readiness")
    public ResponseEntity<List<Map<String, Object>>> getReadinessDistribution() {
        return ResponseEntity.ok(reportService.getReadinessDistribution());
    }
}
