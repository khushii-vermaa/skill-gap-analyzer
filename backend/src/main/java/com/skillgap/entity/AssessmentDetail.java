package com.skillgap.entity;

import com.skillgap.enums.GapStatus;
import com.skillgap.enums.ProficiencyLevel;
import jakarta.persistence.*;

@Entity
@Table(name = "assessment_details")
public class AssessmentDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(name = "student_proficiency", length = 20)
    private ProficiencyLevel studentProficiency;

    @Enumerated(EnumType.STRING)
    @Column(name = "required_proficiency", nullable = false, length = 20)
    private ProficiencyLevel requiredProficiency;

    @Column(name = "match_percentage", nullable = false)
    private Double matchPercentage = 0.0;

    @Column(name = "importance_weight", nullable = false)
    private Integer importanceWeight = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "gap_status", nullable = false, length = 30)
    private GapStatus gapStatus;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Assessment getAssessment() { return assessment; }
    public void setAssessment(Assessment assessment) { this.assessment = assessment; }
    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) { this.skill = skill; }
    public ProficiencyLevel getStudentProficiency() { return studentProficiency; }
    public void setStudentProficiency(ProficiencyLevel studentProficiency) { this.studentProficiency = studentProficiency; }
    public ProficiencyLevel getRequiredProficiency() { return requiredProficiency; }
    public void setRequiredProficiency(ProficiencyLevel requiredProficiency) { this.requiredProficiency = requiredProficiency; }
    public Double getMatchPercentage() { return matchPercentage; }
    public void setMatchPercentage(Double matchPercentage) { this.matchPercentage = matchPercentage; }
    public Integer getImportanceWeight() { return importanceWeight; }
    public void setImportanceWeight(Integer importanceWeight) { this.importanceWeight = importanceWeight; }
    public GapStatus getGapStatus() { return gapStatus; }
    public void setGapStatus(GapStatus gapStatus) { this.gapStatus = gapStatus; }
}
