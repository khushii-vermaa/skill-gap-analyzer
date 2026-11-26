package com.skillgap.dto.response;

import java.time.LocalDateTime;

public record RoadmapResponse(
    Long id,
    Long studentId,
    Long assessmentId,
    String roadmapTitle,
    Double completionPercentage,
    int totalTasks,
    int completedTasks,
    LocalDateTime createdAt
) {}
