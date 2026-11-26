package com.skillgap.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "assessments")
public class Assessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_role_id", nullable = false)
    private JobRole jobRole;

    @Column(name = "readiness_score", nullable = false)
    private Double readinessScore = 0.0;

    @Column(name = "total_required_skills", nullable = false)
    private Integer totalRequiredSkills = 0;

    @Column(name = "matched_skills", nullable = false)
    private Integer matchedSkills = 0;

    @Column(name = "missing_skills_count", nullable = false)
    private Integer missingSkillsCount = 0;

    @Column(name = "improvement_skills_count", nullable = false)
    private Integer improvementSkillsCount = 0;

    @CreationTimestamp
    @Column(name = "assessment_date", nullable = false, updatable = false)
    private LocalDateTime assessmentDate;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public JobRole getJobRole() { return jobRole; }
    public void setJobRole(JobRole jobRole) { this.jobRole = jobRole; }
    public Double getReadinessScore() { return readinessScore; }
    public void setReadinessScore(Double readinessScore) { this.readinessScore = readinessScore; }
    public Integer getTotalRequiredSkills() { return totalRequiredSkills; }
    public void setTotalRequiredSkills(Integer totalRequiredSkills) { this.totalRequiredSkills = totalRequiredSkills; }
    public Integer getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(Integer matchedSkills) { this.matchedSkills = matchedSkills; }
    public Integer getMissingSkillsCount() { return missingSkillsCount; }
    public void setMissingSkillsCount(Integer missingSkillsCount) { this.missingSkillsCount = missingSkillsCount; }
    public Integer getImprovementSkillsCount() { return improvementSkillsCount; }
    public void setImprovementSkillsCount(Integer improvementSkillsCount) { this.improvementSkillsCount = improvementSkillsCount; }
    public LocalDateTime getAssessmentDate() { return assessmentDate; }
    public void setAssessmentDate(LocalDateTime assessmentDate) { this.assessmentDate = assessmentDate; }
}
