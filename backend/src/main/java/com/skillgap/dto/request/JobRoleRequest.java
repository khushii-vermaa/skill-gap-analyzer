package com.skillgap.dto.request;

import jakarta.validation.constraints.NotBlank;

public record JobRoleRequest(
    @NotBlank(message = "Role name is required") String roleName,
    String description
) {}
