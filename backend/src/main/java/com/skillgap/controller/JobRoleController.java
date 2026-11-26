package com.skillgap.controller;

import com.skillgap.dto.request.JobRoleRequest;
import com.skillgap.dto.request.JobRoleSkillRequest;
import com.skillgap.dto.response.JobRoleResponse;
import com.skillgap.dto.response.JobRoleSkillResponse;
import com.skillgap.service.JobRoleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-roles")
public class JobRoleController {

    private final JobRoleService jobRoleService;

    public JobRoleController(JobRoleService jobRoleService) {
        this.jobRoleService = jobRoleService;
    }

    @GetMapping
    public ResponseEntity<List<JobRoleResponse>> getAll() {
        return ResponseEntity.ok(jobRoleService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobRoleResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(jobRoleService.getById(id));
    }

    @PostMapping
    public ResponseEntity<JobRoleResponse> create(@Valid @RequestBody JobRoleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobRoleService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobRoleResponse> update(@PathVariable Long id,
                                                   @Valid @RequestBody JobRoleRequest request) {
        return ResponseEntity.ok(jobRoleService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        jobRoleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Job Role Skill Requirements
    @GetMapping("/{id}/skills")
    public ResponseEntity<List<JobRoleSkillResponse>> getRequirements(@PathVariable Long id) {
        return ResponseEntity.ok(jobRoleService.getRequirements(id));
    }

    @PostMapping("/{id}/skills")
    public ResponseEntity<JobRoleSkillResponse> addRequirement(@PathVariable Long id,
                                                                @Valid @RequestBody JobRoleSkillRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobRoleService.addRequirement(id, request));
    }

    @PutMapping("/requirements/{requirementId}")
    public ResponseEntity<JobRoleSkillResponse> updateRequirement(@PathVariable Long requirementId,
                                                                    @Valid @RequestBody JobRoleSkillRequest request) {
        return ResponseEntity.ok(jobRoleService.updateRequirement(requirementId, request));
    }

    @DeleteMapping("/requirements/{requirementId}")
    public ResponseEntity<Void> deleteRequirement(@PathVariable Long requirementId) {
        jobRoleService.deleteRequirement(requirementId);
        return ResponseEntity.noContent().build();
    }
}
