package com.skillgap.controller;

import com.skillgap.dto.request.TaskUpdateRequest;
import com.skillgap.dto.response.RoadmapResponse;
import com.skillgap.dto.response.RoadmapTaskResponse;
import com.skillgap.service.RoadmapService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roadmaps")
public class RoadmapController {

    private final RoadmapService roadmapService;

    public RoadmapController(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    @PostMapping("/generate/{assessmentId}")
    public ResponseEntity<RoadmapResponse> generate(@PathVariable Long assessmentId) {
        return ResponseEntity.ok(roadmapService.generate(assessmentId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<RoadmapResponse>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(roadmapService.getByStudent(studentId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoadmapResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(roadmapService.getById(id));
    }

    @GetMapping("/{roadmapId}/tasks")
    public ResponseEntity<List<RoadmapTaskResponse>> getTasks(@PathVariable Long roadmapId) {
        return ResponseEntity.ok(roadmapService.getTasks(roadmapId));
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<RoadmapTaskResponse> updateTask(@PathVariable Long taskId,
                                                           @Valid @RequestBody TaskUpdateRequest request) {
        return ResponseEntity.ok(roadmapService.updateTask(taskId, request));
    }
}

