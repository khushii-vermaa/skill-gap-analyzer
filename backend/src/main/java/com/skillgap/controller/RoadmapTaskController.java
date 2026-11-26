package com.skillgap.controller;

import com.skillgap.dto.request.TaskUpdateRequest;
import com.skillgap.dto.response.RoadmapTaskResponse;
import com.skillgap.service.RoadmapService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roadmap-tasks")
public class RoadmapTaskController {

    private final RoadmapService roadmapService;

    public RoadmapTaskController(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<RoadmapTaskResponse> updateTask(@PathVariable Long taskId,
                                                           @Valid @RequestBody TaskUpdateRequest request) {
        return ResponseEntity.ok(roadmapService.updateTask(taskId, request));
    }
}
