package com.skillgap.dto.request;

import com.skillgap.enums.ResourceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ResourceRequest(
    @NotBlank(message = "Resource title is required") String resourceTitle,
    String resourceUrl,
    @NotNull(message = "Skill ID is required") Long skillId,
    ResourceType resourceType,
    String description
) {}
