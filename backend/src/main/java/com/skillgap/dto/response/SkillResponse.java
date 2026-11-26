package com.skillgap.dto.response;

public record SkillResponse(
    Long id,
    String skillName,
    Long categoryId,
    String categoryName,
    String description
) {}
