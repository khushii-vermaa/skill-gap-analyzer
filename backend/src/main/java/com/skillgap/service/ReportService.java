package com.skillgap.service;

import com.skillgap.entity.Assessment;
import com.skillgap.entity.AssessmentDetail;
import com.skillgap.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final StudentRepository studentRepository;
    private final AssessmentRepository assessmentRepository;
    private final AssessmentDetailRepository assessmentDetailRepository;
    private final JobRoleRepository jobRoleRepository;

    public ReportService(StudentRepository studentRepository,
                          AssessmentRepository assessmentRepository,
                          AssessmentDetailRepository assessmentDetailRepository,
                          JobRoleRepository jobRoleRepository) {
        this.studentRepository = studentRepository;
        this.assessmentRepository = assessmentRepository;
        this.assessmentDetailRepository = assessmentDetailRepository;
        this.jobRoleRepository = jobRoleRepository;
    }

    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new LinkedHashMap<>();
        long totalStudents = studentRepository.count();
        List<Assessment> all = assessmentRepository.findAllByOrderByAssessmentDateDesc();
        double avgScore = all.stream().mapToDouble(Assessment::getReadinessScore).average().orElse(0.0);
        long totalAssessments = all.size();

        // Most popular role
        String mostPopularRole = all.stream()
                .collect(Collectors.groupingBy(a -> a.getJobRole().getRoleName(), Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        summary.put("totalStudents", totalStudents);
        summary.put("avgScore", Math.round(avgScore * 10) / 10.0);
        summary.put("totalAssessments", totalAssessments);
        summary.put("mostPopularRole", mostPopularRole);
        return summary;
    }

    public List<Map<String, Object>> getJobRolesReport() {
        List<Assessment> all = assessmentRepository.findAllByOrderByAssessmentDateDesc();
        Map<Long, List<Assessment>> byRole = all.stream()
                .collect(Collectors.groupingBy(a -> a.getJobRole().getId()));

        return byRole.entrySet().stream().map(e -> {
            Map<String, Object> m = new LinkedHashMap<>();
            Assessment first = e.getValue().get(0);
            m.put("roleId", e.getKey());
            m.put("roleName", first.getJobRole().getRoleName());
            m.put("studentCount", e.getValue().size());
            double avg = e.getValue().stream().mapToDouble(Assessment::getReadinessScore).average().orElse(0);
            m.put("avgScore", Math.round(avg * 10) / 10.0);
            return m;
        }).sorted((a, b) -> Double.compare((Double) b.get("avgScore"), (Double) a.get("avgScore")))
          .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getSkillsReport() {
        // Top 10 most missing skills across all assessment details
        List<AssessmentDetail> allDetails = new ArrayList<>();
        assessmentRepository.findAllByOrderByAssessmentDateDesc().forEach(a ->
                allDetails.addAll(assessmentDetailRepository.findByAssessmentId(a.getId()))
        );

        Map<String, Long> missingCounts = allDetails.stream()
                .filter(d -> d.getGapStatus() == com.skillgap.enums.GapStatus.MISSING)
                .collect(Collectors.groupingBy(d -> d.getSkill().getSkillName(), Collectors.counting()));

        return missingCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .map(e -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("skillName", e.getKey());
                    m.put("missingCount", e.getValue());
                    return m;
                }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getReadinessDistribution() {
        List<Assessment> all = assessmentRepository.findAllByOrderByAssessmentDateDesc();
        long r0_25 = all.stream().filter(a -> a.getReadinessScore() < 25).count();
        long r25_50 = all.stream().filter(a -> a.getReadinessScore() >= 25 && a.getReadinessScore() < 50).count();
        long r50_75 = all.stream().filter(a -> a.getReadinessScore() >= 50 && a.getReadinessScore() < 75).count();
        long r75_100 = all.stream().filter(a -> a.getReadinessScore() >= 75).count();

        List<Map<String, Object>> dist = new ArrayList<>();
        dist.add(Map.of("range", "0-25%", "count", r0_25));
        dist.add(Map.of("range", "25-50%", "count", r25_50));
        dist.add(Map.of("range", "50-75%", "count", r50_75));
        dist.add(Map.of("range", "75-100%", "count", r75_100));
        return dist;
    }
}
