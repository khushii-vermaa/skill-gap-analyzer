package com.skillgap.dto.response;

import com.skillgap.enums.ResourceType;

public record LearningResourceResponse(
    Long id,
    Long skillId,
    String skillName,
    String resourceTitle,
    String resourceUrl,
    ResourceType resourceType,
    String description
) {}
