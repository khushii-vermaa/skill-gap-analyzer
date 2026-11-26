package com.skillgap.dto.response;

import com.skillgap.enums.Role;

public record AuthResponse(
    Long userId,
    String username,
    String email,
    String fullName,
    Role role,
    Long studentId
) {}
