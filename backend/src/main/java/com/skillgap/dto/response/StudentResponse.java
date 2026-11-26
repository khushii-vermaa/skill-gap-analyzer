package com.skillgap.dto.response;

import java.time.LocalDateTime;

public record StudentResponse(
    Long id,
    Long userId,
    String fullName,
    String email,
    String phone,
    String college,
    String department,
    String academicYear,
    Integer graduationYear,
    Double cgpa,
    String resumeUrl,
    Long preferredJobRoleId,
    String preferredJobRoleName,
    Boolean active,
    LocalDateTime createdAt
) {}
