package com.skillgap.dto.response;

import com.skillgap.enums.ProficiencyLevel;

public record JobRoleSkillResponse(
    Long id,
    Long jobRoleId,
    String jobRoleName,
    Long skillId,
    String skillName,
    String categoryName,
    ProficiencyLevel requiredProficiency,
    Integer importanceWeight,
    Boolean isMandatory
) {}
