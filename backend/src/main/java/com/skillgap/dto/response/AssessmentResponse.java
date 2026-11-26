package com.skillgap.dto.response;

import java.time.LocalDateTime;

public record AssessmentResponse(
    Long id,
    Long studentId,
    String studentName,
    Long jobRoleId,
    String jobRoleName,
    Double readinessScore,
    Integer totalRequiredSkills,
    Integer matchedSkills,
    Integer missingSkillsCount,
    Integer improvementSkillsCount,
    LocalDateTime assessmentDate
) {}
