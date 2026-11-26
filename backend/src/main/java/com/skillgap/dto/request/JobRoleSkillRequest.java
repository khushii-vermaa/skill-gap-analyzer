package com.skillgap.dto.request;

import com.skillgap.enums.ProficiencyLevel;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record JobRoleSkillRequest(
    @NotNull(message = "Skill ID is required") Long skillId,
    @NotNull(message = "Required proficiency is required") ProficiencyLevel requiredProficiency,
    @NotNull @Min(1) @Max(5) Integer importanceWeight,
    Boolean isMandatory
) {}
