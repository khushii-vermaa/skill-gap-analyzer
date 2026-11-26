package com.skillgap.dto.request;

import com.skillgap.enums.ProficiencyLevel;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record StudentSkillRequest(
    @NotNull(message = "Student ID is required") Long studentId,
    @NotNull(message = "Skill ID is required") Long skillId,
    @NotNull(message = "Proficiency level is required") ProficiencyLevel proficiencyLevel,
    Double experienceYears,
    LocalDate lastPracticed
) {}
