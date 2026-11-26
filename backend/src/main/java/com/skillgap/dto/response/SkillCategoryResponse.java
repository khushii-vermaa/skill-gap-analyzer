package com.skillgap.dto.response;

public record SkillCategoryResponse(
    Long id,
    String categoryName,
    String description,
    long skillCount
) {}
