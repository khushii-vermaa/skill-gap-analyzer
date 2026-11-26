package com.skillgap.entity;

import com.skillgap.enums.ProficiencyLevel;
import jakarta.persistence.*;

@Entity
@Table(
    name = "job_role_skills",
    uniqueConstraints = @UniqueConstraint(columnNames = {"job_role_id", "skill_id"})
)
public class JobRoleSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_role_id", nullable = false)
    private JobRole jobRole;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(name = "required_proficiency", nullable = false, length = 20)
    private ProficiencyLevel requiredProficiency;

    @Column(name = "importance_weight", nullable = false)
    private Integer importanceWeight = 3;

    @Column(name = "is_mandatory", nullable = false)
    private boolean isMandatory = false;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public JobRole getJobRole() { return jobRole; }
    public void setJobRole(JobRole jobRole) { this.jobRole = jobRole; }
    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) { this.skill = skill; }
    public ProficiencyLevel getRequiredProficiency() { return requiredProficiency; }
    public void setRequiredProficiency(ProficiencyLevel requiredProficiency) { this.requiredProficiency = requiredProficiency; }
    public Integer getImportanceWeight() { return importanceWeight; }
    public void setImportanceWeight(Integer importanceWeight) { this.importanceWeight = importanceWeight; }
    public boolean isMandatory() { return isMandatory; }
    public void setMandatory(boolean mandatory) { isMandatory = mandatory; }
}
