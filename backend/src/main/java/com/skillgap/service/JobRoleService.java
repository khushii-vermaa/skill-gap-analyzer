package com.skillgap.service;

import com.skillgap.dto.request.JobRoleRequest;
import com.skillgap.dto.request.JobRoleSkillRequest;
import com.skillgap.dto.response.JobRoleResponse;
import com.skillgap.dto.response.JobRoleSkillResponse;
import com.skillgap.entity.JobRole;
import com.skillgap.entity.JobRoleSkill;
import com.skillgap.entity.Skill;
import com.skillgap.exception.BadRequestException;
import com.skillgap.exception.ResourceNotFoundException;
import com.skillgap.repository.JobRoleRepository;
import com.skillgap.repository.JobRoleSkillRepository;
import com.skillgap.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class JobRoleService {

    private final JobRoleRepository jobRoleRepository;
    private final JobRoleSkillRepository jobRoleSkillRepository;
    private final SkillRepository skillRepository;

    public JobRoleService(JobRoleRepository jobRoleRepository,
                          JobRoleSkillRepository jobRoleSkillRepository,
                          SkillRepository skillRepository) {
        this.jobRoleRepository = jobRoleRepository;
        this.jobRoleSkillRepository = jobRoleSkillRepository;
        this.skillRepository = skillRepository;
    }

    public List<JobRoleResponse> getAll() {
        return jobRoleRepository.findAll().stream().map(this::toResponse).toList();
    }

    public JobRoleResponse getById(Long id) {
        return toResponse(findById(id));
    }

    public JobRoleResponse create(JobRoleRequest req) {
        if (jobRoleRepository.findByRoleNameIgnoreCase(req.roleName()).isPresent())
            throw new BadRequestException("Job role already exists: " + req.roleName());
        JobRole role = new JobRole();
        role.setRoleName(req.roleName());
        role.setDescription(req.description());
        return toResponse(jobRoleRepository.save(role));
    }

    public JobRoleResponse update(Long id, JobRoleRequest req) {
        JobRole role = findById(id);
        role.setRoleName(req.roleName());
        role.setDescription(req.description());
        return toResponse(jobRoleRepository.save(role));
    }

    public void delete(Long id) {
        if (!jobRoleRepository.existsById(id)) throw new ResourceNotFoundException("Job role not found: " + id);
        jobRoleRepository.deleteById(id);
    }

    public List<JobRoleSkillResponse> getRequirements(Long jobRoleId) {
        findById(jobRoleId);
        return jobRoleSkillRepository.findByJobRoleId(jobRoleId).stream().map(this::toSkillResponse).toList();
    }

    public JobRoleSkillResponse addRequirement(Long jobRoleId, JobRoleSkillRequest req) {
        JobRole jobRole = findById(jobRoleId);
        Skill skill = skillRepository.findById(req.skillId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found: " + req.skillId()));
        if (jobRoleSkillRepository.findByJobRoleIdAndSkillId(jobRoleId, req.skillId()).isPresent())
            throw new BadRequestException("Skill already required for this role.");
        JobRoleSkill jrs = new JobRoleSkill();
        jrs.setJobRole(jobRole);
        jrs.setSkill(skill);
        jrs.setRequiredProficiency(req.requiredProficiency());
        jrs.setImportanceWeight(req.importanceWeight());
        jrs.setMandatory(req.isMandatory() != null && req.isMandatory());
        return toSkillResponse(jobRoleSkillRepository.save(jrs));
    }

    public JobRoleSkillResponse updateRequirement(Long id, JobRoleSkillRequest req) {
        JobRoleSkill jrs = jobRoleSkillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job role skill not found: " + id));
        jrs.setRequiredProficiency(req.requiredProficiency());
        jrs.setImportanceWeight(req.importanceWeight());
        jrs.setMandatory(req.isMandatory() != null && req.isMandatory());
        return toSkillResponse(jobRoleSkillRepository.save(jrs));
    }

    public void deleteRequirement(Long id) {
        if (!jobRoleSkillRepository.existsById(id))
            throw new ResourceNotFoundException("Job role skill not found: " + id);
        jobRoleSkillRepository.deleteById(id);
    }

    private JobRole findById(Long id) {
        return jobRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job role not found: " + id));
    }

    private JobRoleResponse toResponse(JobRole r) {
        return new JobRoleResponse(r.getId(), r.getRoleName(), r.getDescription(),
                jobRoleSkillRepository.countByJobRoleId(r.getId()), r.getCreatedAt());
    }

    private JobRoleSkillResponse toSkillResponse(JobRoleSkill jrs) {
        return new JobRoleSkillResponse(
                jrs.getId(), jrs.getJobRole().getId(), jrs.getJobRole().getRoleName(),
                jrs.getSkill().getId(), jrs.getSkill().getSkillName(),
                jrs.getSkill().getCategory().getCategoryName(),
                jrs.getRequiredProficiency(), jrs.getImportanceWeight(), jrs.isMandatory()
        );
    }
}
