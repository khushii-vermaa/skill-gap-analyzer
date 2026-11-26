package com.skillgap.dto.request;

import com.skillgap.enums.TaskStatus;

import java.time.LocalDate;

public record TaskUpdateRequest(
    TaskStatus taskStatus,
    String taskTitle,
    String taskDescription,
    LocalDate targetDate
) {}
