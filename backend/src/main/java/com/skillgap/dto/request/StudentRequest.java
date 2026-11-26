package com.skillgap.dto.request;

public record StudentRequest(
    String fullName,
    String phone,
    String college,
    String department,
    String academicYear,
    Integer graduationYear,
    Double cgpa,
    String resumeUrl,
    Long preferredJobRoleId
) {}
