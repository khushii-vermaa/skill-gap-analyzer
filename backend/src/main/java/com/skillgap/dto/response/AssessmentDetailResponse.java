package com.skillgap.dto.response;

import com.skillgap.enums.GapStatus;
import com.skillgap.enums.ProficiencyLevel;

public record AssessmentDetailResponse(
    Long id,
    Long assessmentId,
    Long skillId,
    String skillName,
    String categoryName,
    ProficiencyLevel studentProficiency,
    ProficiencyLevel requiredProficiency,
    Double matchPercentage,
    Integer importanceWeight,
    GapStatus gapStatus
) {}
