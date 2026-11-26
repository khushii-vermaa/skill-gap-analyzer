package com.skillgap.dto.request;

import jakarta.validation.constraints.NotBlank;

public record SkillCategoryRequest(
    @NotBlank(message = "Category name is required") String categoryName,
    String description
) {}
