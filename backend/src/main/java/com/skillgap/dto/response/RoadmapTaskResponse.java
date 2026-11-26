package com.skillgap.dto.response;

import com.skillgap.enums.Priority;
import com.skillgap.enums.TaskStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record RoadmapTaskResponse(
    Long id,
    Long roadmapId,
    Long skillId,
    String skillName,
    String taskTitle,
    String taskDescription,
    Priority priority,
    Integer estimatedHours,
    LocalDate targetDate,
    TaskStatus taskStatus,
    Long resourceId,
    String resourceTitle,
    String resourceUrl,
    LocalDateTime updatedAt
) {}
