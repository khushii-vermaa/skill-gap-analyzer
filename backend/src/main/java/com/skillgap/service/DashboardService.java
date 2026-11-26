package com.skillgap.service;

import com.skillgap.dto.response.AssessmentResponse;
import com.skillgap.entity.Assessment;
import com.skillgap.entity.Student;
import com.skillgap.exception.ResourceNotFoundException;
import com.skillgap.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final StudentRepository studentRepository;
    private final SkillRepository skillRepository;
    private final JobRoleRepository jobRoleRepository;
    private final AssessmentRepository assessmentRepository;
    private final AssessmentDetailRepository assessmentDetailRepository;
    private final RoadmapRepository roadmapRepository;
    private final RoadmapTaskRepository roadmapTaskRepository;
    private final StudentSkillRepository studentSkillRepository;

    public DashboardService(StudentRepository studentRepository,
                             SkillRepository skillRepository,
                             JobRoleRepository jobRoleRepository,
                             AssessmentRepository assessmentRepository,
                             AssessmentDetailRepository assessmentDetailRepository,
                             RoadmapRepository roadmapRepository,
                             RoadmapTaskRepository roadmapTaskRepository,
                             StudentSkillRepository studentSkillRepository) {
        this.studentRepository = studentRepository;
        this.skillRepository = skillRepository;
        this.jobRoleRepository = jobRoleRepository;
        this.assessmentRepository = assessmentRepository;
        this.assessmentDetailRepository = assessmentDetailRepository;
        this.roadmapRepository = roadmapRepository;
        this.roadmapTaskRepository = roadmapTaskRepository;
        this.studentSkillRepository = studentSkillRepository;
    }

    public Map<String, Object> getAdminDashboard() {
        Map<String, Object> dashboard = new LinkedHashMap<>();

        long totalStudents = studentRepository.count();
        long totalSkills = skillRepository.count();
        long totalJobRoles = jobRoleRepository.count();
        long totalAssessments = assessmentRepository.count();

        List<Assessment> allAssessments = assessmentRepository.findAllByOrderByAssessmentDateDesc();
        double avgReadiness = allAssessments.stream()
                .mapToDouble(Assessment::getReadinessScore)
                .average().orElse(0.0);

        long highReadiness = allAssessments.stream()
                .filter(a -> a.getReadinessScore() >= 75).count();
        long needsImprovement = allAssessments.stream()
                .filter(a -> a.getReadinessScore() < 50).count();

        // Role-wise readiness: group latest assessments per student by role
        Map<String, List<Double>> roleScores = new LinkedHashMap<>();
        allAssessments.forEach(a -> {
            String role = a.getJobRole().getRoleName();
            roleScores.computeIfAbsent(role, k -> new ArrayList<>()).add(a.getReadinessScore());
        });
        List<Map<String, Object>> roleWiseReadiness = roleScores.entrySet().stream().map(e -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("roleName", e.getKey());
            m.put("avgScore", Math.round(e.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(0) * 10) / 10.0);
            m.put("count", e.getValue().size());
            return m;
        }).collect(Collectors.toList());

        // Recent 10 assessments
        List<Map<String, Object>> recentAssessments = allAssessments.stream().limit(10).map(a -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", a.getId());
            m.put("studentName", a.getStudent().getFullName());
            m.put("jobRoleName", a.getJobRole().getRoleName());
            m.put("readinessScore", a.getReadinessScore());
            m.put("assessmentDate", a.getAssessmentDate());
            return m;
        }).collect(Collectors.toList());

        dashboard.put("totalStudents", totalStudents);
        dashboard.put("totalSkills", totalSkills);
        dashboard.put("totalJobRoles", totalJobRoles);
        dashboard.put("totalAssessments", totalAssessments);
        dashboard.put("avgReadiness", Math.round(avgReadiness * 10) / 10.0);
        dashboard.put("highReadinessStudents", highReadiness);
        dashboard.put("needsImprovementStudents", needsImprovement);
        dashboard.put("roleWiseReadiness", roleWiseReadiness);
        dashboard.put("recentAssessments", recentAssessments);

        return dashboard;
    }

    public Map<String, Object> getStudentDashboard(Long studentId) {
        var student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));

        Map<String, Object> dashboard = new LinkedHashMap<>();

        // Assessments
        List<Assessment> assessments = assessmentRepository.findByStudentIdOrderByAssessmentDateDesc(studentId);
        double currentScore = 0.0;
        double previousScore = 0.0;
        int matchedSkills = 0, missingSkills = 0, improvementSkills = 0;
        String preferredJobRoleName = null;

        if (!assessments.isEmpty()) {
            Assessment latest = assessments.get(0);
            currentScore = latest.getReadinessScore();
            matchedSkills = latest.getMatchedSkills();
            missingSkills = latest.getMissingSkillsCount();
            improvementSkills = latest.getImprovementSkillsCount();
            preferredJobRoleName = latest.getJobRole().getRoleName();

            if (assessments.size() > 1) {
                previousScore = assessments.get(1).getReadinessScore();
            }
        }

        // If no assessment yet, still try preferred job role from student profile
        if (preferredJobRoleName == null && student.getPreferredJobRole() != null) {
            preferredJobRoleName = student.getPreferredJobRole().getRoleName();
        }

        long totalSkillsAdded = studentSkillRepository.countByStudentId(studentId);

        // Roadmap completion
        double roadmapCompletion = 0.0;
        var latestRoadmap = roadmapRepository.findFirstByStudentIdOrderByCreatedAtDesc(studentId);
        List<Map<String, Object>> upcomingTasks = new ArrayList<>();
        if (latestRoadmap.isPresent()) {
            Long roadmapId = latestRoadmap.get().getId();
            long total = roadmapTaskRepository.countByRoadmapId(roadmapId);
            long completed = roadmapTaskRepository.countByRoadmapIdAndTaskStatus(roadmapId, com.skillgap.enums.TaskStatus.COMPLETED);
            roadmapCompletion = total > 0 ? Math.round((double) completed / total * 1000) / 10.0 : 0.0;

            // Upcoming pending tasks (top 5)
            upcomingTasks = roadmapTaskRepository.findByRoadmapIdOrderByPriorityAscCreatedAtAsc(roadmapId)
                    .stream()
                    .filter(t -> t.getTaskStatus() == com.skillgap.enums.TaskStatus.PENDING)
                    .limit(5)
                    .map(t -> {
                        Map<String, Object> m = new LinkedHashMap<>();
                        m.put("id", t.getId());
                        m.put("taskTitle", t.getTaskTitle());
                        m.put("skillName", t.getSkill() != null ? t.getSkill().getSkillName() : "General");
                        m.put("priority", t.getPriority());
                        m.put("targetDate", t.getTargetDate());
                        return m;
                    }).collect(Collectors.toList());
        }

        // Readiness trend: last 5 assessments (oldest first for chart)
        List<Map<String, Object>> readinessTrend = new ArrayList<>();
        int start = Math.max(0, assessments.size() - 5);
        List<Assessment> trendList = new ArrayList<>(assessments.subList(start, assessments.size()));
        Collections.reverse(trendList);
        for (int i = 0; i < trendList.size(); i++) {
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("label", "Assessment " + (i + 1));
            point.put("score", trendList.get(i).getReadinessScore());
            readinessTrend.add(point);
        }

        dashboard.put("currentReadinessScore", currentScore);
        dashboard.put("previousReadinessScore", previousScore);
        dashboard.put("scoreImprovement", Math.round((currentScore - previousScore) * 10) / 10.0);
        dashboard.put("preferredJobRoleName", preferredJobRoleName);
        dashboard.put("totalSkillsAdded", totalSkillsAdded);
        dashboard.put("matchedSkills", matchedSkills);
        dashboard.put("missingSkills", missingSkills);
        dashboard.put("improvementSkills", improvementSkills);
        dashboard.put("roadmapCompletionPercentage", roadmapCompletion);
        dashboard.put("readinessTrend", readinessTrend);
        dashboard.put("upcomingTasks", upcomingTasks);

        return dashboard;
    }
}
