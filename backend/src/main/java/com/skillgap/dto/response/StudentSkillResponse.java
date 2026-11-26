package com.skillgap.dto.response;

import com.skillgap.enums.ProficiencyLevel;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record StudentSkillResponse(
    Long id,
    Long studentId,
    Long skillId,
    String skillName,
    String categoryName,
    ProficiencyLevel proficiencyLevel,
    Double experienceYears,
    LocalDate lastPracticed,
    LocalDateTime updatedAt
) {}
