package com.skillgap.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SkillRequest(
    @NotBlank(message = "Skill name is required") String skillName,
    @NotNull(message = "Category ID is required") Long categoryId,
    String description
) {}
