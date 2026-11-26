package com.skillgap.service;

import com.skillgap.dto.response.AssessmentDetailResponse;
import com.skillgap.dto.response.AssessmentResponse;
import com.skillgap.entity.Assessment;
import com.skillgap.entity.AssessmentDetail;
import com.skillgap.entity.JobRole;
import com.skillgap.entity.Student;
import com.skillgap.exception.ResourceNotFoundException;
import com.skillgap.repository.*;
import com.skillgap.service.SkillGapCalculationService.AssessmentResult;
import com.skillgap.service.SkillGapCalculationService.SkillGapDetail;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentDetailRepository detailRepository;
    private final StudentRepository studentRepository;
    private final JobRoleRepository jobRoleRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final JobRoleSkillRepository jobRoleSkillRepository;
    private final SkillGapCalculationService calculationService;

    public AssessmentService(AssessmentRepository assessmentRepository,
                             AssessmentDetailRepository detailRepository,
                             StudentRepository studentRepository,
                             JobRoleRepository jobRoleRepository,
                             StudentSkillRepository studentSkillRepository,
                             JobRoleSkillRepository jobRoleSkillRepository,
                             SkillGapCalculationService calculationService) {
        this.assessmentRepository = assessmentRepository;
        this.detailRepository = detailRepository;
        this.studentRepository = studentRepository;
        this.jobRoleRepository = jobRoleRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.jobRoleSkillRepository = jobRoleSkillRepository;
        this.calculationService = calculationService;
    }

    public AssessmentResponse runAnalysis(Long studentId, Long jobRoleId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));
        JobRole jobRole = jobRoleRepository.findById(jobRoleId)
                .orElseThrow(() -> new ResourceNotFoundException("Job role not found: " + jobRoleId));

        var studentSkills = studentSkillRepository.findByStudentId(studentId);
        var jobRoleSkills = jobRoleSkillRepository.findByJobRoleId(jobRoleId);

        if (jobRoleSkills.isEmpty())
            throw new ResourceNotFoundException("No skill requirements defined for this job role.");

        AssessmentResult result = calculationService.calculate(studentSkills, jobRoleSkills);

        Assessment assessment = new Assessment();
        assessment.setStudent(student);
        assessment.setJobRole(jobRole);
        assessment.setReadinessScore(result.readinessScore());
        assessment.setTotalRequiredSkills(result.total());
        assessment.setMatchedSkills(result.matched());
        assessment.setMissingSkillsCount(result.missing());
        assessment.setImprovementSkillsCount(result.improvement());
        assessment = assessmentRepository.save(assessment);

        for (SkillGapDetail d : result.details()) {
            AssessmentDetail detail = new AssessmentDetail();
            detail.setAssessment(assessment);
            detail.setSkill(d.skill());
            detail.setStudentProficiency(d.studentProficiency());
            detail.setRequiredProficiency(d.requiredProficiency());
            detail.setMatchPercentage(Math.round(d.matchPercentage() * 100.0) / 100.0);
            detail.setImportanceWeight(d.importanceWeight());
            detail.setGapStatus(d.gapStatus());
            detailRepository.save(detail);
        }

        return toResponse(assessment);
    }

    public AssessmentResponse getById(Long id) {
        return toResponse(findById(id));
    }

    public List<AssessmentResponse> getByStudent(Long studentId) {
        return assessmentRepository.findByStudentIdOrderByAssessmentDateDesc(studentId)
                .stream().map(this::toResponse).toList();
    }

    public AssessmentResponse getLatest(Long studentId) {
        return assessmentRepository.findFirstByStudentIdOrderByAssessmentDateDesc(studentId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("No assessments found for student: " + studentId));
    }

    public List<AssessmentDetailResponse> getDetails(Long assessmentId) {
        findById(assessmentId);
        return detailRepository.findByAssessmentId(assessmentId).stream()
                .map(d -> new AssessmentDetailResponse(
                        d.getId(), d.getAssessment().getId(),
                        d.getSkill().getId(), d.getSkill().getSkillName(),
                        d.getSkill().getCategory().getCategoryName(),
                        d.getStudentProficiency(), d.getRequiredProficiency(),
                        d.getMatchPercentage(), d.getImportanceWeight(), d.getGapStatus()
                )).toList();
    }

    public List<AssessmentResponse> getAll() {
        return assessmentRepository.findAllByOrderByAssessmentDateDesc().stream().map(this::toResponse).toList();
    }

    private Assessment findById(Long id) {
        return assessmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found: " + id));
    }

    private AssessmentResponse toResponse(Assessment a) {
        return new AssessmentResponse(
                a.getId(), a.getStudent().getId(), a.getStudent().getFullName(),
                a.getJobRole().getId(), a.getJobRole().getRoleName(),
                a.getReadinessScore(), a.getTotalRequiredSkills(), a.getMatchedSkills(),
                a.getMissingSkillsCount(), a.getImprovementSkillsCount(), a.getAssessmentDate()
        );
    }
}
