package com.skillgap.dto.response;

import java.time.LocalDateTime;

public record JobRoleResponse(
    Long id,
    String roleName,
    String description,
    int requiredSkillCount,
    LocalDateTime createdAt
) {}
