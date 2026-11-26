package com.skillgap.service;

import com.skillgap.entity.JobRoleSkill;
import com.skillgap.entity.Skill;
import com.skillgap.entity.StudentSkill;
import com.skillgap.enums.GapStatus;
import com.skillgap.enums.ProficiencyLevel;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Core Skill-Gap Calculation Engine.
 *
 * ALGORITHM:
 * 1. Map proficiency levels to numeric scores: BEGINNER=1, INTERMEDIATE=2, ADVANCED=3, EXPERT=4
 * 2. For each required skill:
 *    - MISSING (student lacks it):       matchPct = 0%,  gapStatus = MISSING
 *    - Below required:                   matchPct = (studentScore/requiredScore)*100, gapStatus = NEEDS_IMPROVEMENT
 *    - Meets or exceeds requirement:     matchPct = 100% (capped), gapStatus = MATCHED
 * 3. Weighted Readiness Score = SUM(matchPct_i * weight_i) / SUM(weight_i)
 */
@Service
public class SkillGapCalculationService {

    private int score(ProficiencyLevel level) {
        return level == null ? 0 : level.getValue();
    }

    private double matchPct(int studentScore, int requiredScore) {
        if (requiredScore == 0) return 100.0;
        if (studentScore == 0) return 0.0;
        return Math.min(100.0, (double) studentScore / requiredScore * 100.0);
    }

    private GapStatus gapStatus(ProficiencyLevel studentLevel, ProficiencyLevel requiredLevel) {
        if (studentLevel == null) return GapStatus.MISSING;
        return score(studentLevel) >= score(requiredLevel) ? GapStatus.MATCHED : GapStatus.NEEDS_IMPROVEMENT;
    }

    public AssessmentResult calculate(List<StudentSkill> studentSkills, List<JobRoleSkill> jobRoleSkills) {
        Map<Long, StudentSkill> skillMap = studentSkills.stream()
                .collect(Collectors.toMap(ss -> ss.getSkill().getId(), ss -> ss));

        List<SkillGapDetail> details = new ArrayList<>();
        double weightedSum = 0.0;
        double totalWeight = 0.0;
        int matched = 0, missing = 0, improvement = 0;

        for (JobRoleSkill jrs : jobRoleSkills) {
            Long skillId = jrs.getSkill().getId();
            StudentSkill ss = skillMap.get(skillId);
            ProficiencyLevel studentLevel = ss != null ? ss.getProficiencyLevel() : null;
            ProficiencyLevel requiredLevel = jrs.getRequiredProficiency();

            int studentScore = score(studentLevel);
            int requiredScore = score(requiredLevel);
            double pct = matchPct(studentScore, requiredScore);
            GapStatus status = gapStatus(studentLevel, requiredLevel);
            int weight = jrs.getImportanceWeight();

            weightedSum += pct * weight;
            totalWeight += weight;

            if (status == GapStatus.MATCHED) matched++;
            else if (status == GapStatus.MISSING) missing++;
            else improvement++;

            details.add(new SkillGapDetail(jrs.getSkill(), studentLevel, requiredLevel, pct, weight, status));
        }

        double readinessScore = totalWeight > 0
                ? Math.round((weightedSum / totalWeight) * 100.0) / 100.0
                : 0.0;

        return new AssessmentResult(readinessScore, jobRoleSkills.size(), matched, missing, improvement, details);
    }

    public record AssessmentResult(
            double readinessScore,
            int total,
            int matched,
            int missing,
            int improvement,
            List<SkillGapDetail> details
    ) {}

    public record SkillGapDetail(
            Skill skill,
            ProficiencyLevel studentProficiency,
            ProficiencyLevel requiredProficiency,
            double matchPercentage,
            int importanceWeight,
            GapStatus gapStatus
    ) {}
}
