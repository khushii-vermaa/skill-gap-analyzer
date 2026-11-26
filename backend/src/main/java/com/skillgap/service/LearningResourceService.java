package com.skillgap.service;

import com.skillgap.dto.request.ResourceRequest;
import com.skillgap.dto.response.LearningResourceResponse;
import com.skillgap.entity.LearningResource;
import com.skillgap.entity.Skill;
import com.skillgap.enums.ResourceType;
import com.skillgap.exception.ResourceNotFoundException;
import com.skillgap.repository.LearningResourceRepository;
import com.skillgap.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LearningResourceService {

    private final LearningResourceRepository resourceRepository;
    private final SkillRepository skillRepository;

    public LearningResourceService(LearningResourceRepository resourceRepository, SkillRepository skillRepository) {
        this.resourceRepository = resourceRepository;
        this.skillRepository = skillRepository;
    }

    public List<LearningResourceResponse> getAll() {
        return resourceRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<LearningResourceResponse> getBySkill(Long skillId) {
        return resourceRepository.findBySkillId(skillId).stream().map(this::toResponse).toList();
    }

    public LearningResourceResponse create(ResourceRequest req) {
        Skill skill = skillRepository.findById(req.skillId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found: " + req.skillId()));
        LearningResource r = new LearningResource();
        r.setSkill(skill);
        r.setResourceTitle(req.resourceTitle());
        r.setResourceUrl(req.resourceUrl());
        r.setResourceType(req.resourceType() != null ? req.resourceType() : ResourceType.COURSE);
        r.setDescription(req.description());
        return toResponse(resourceRepository.save(r));
    }

    public LearningResourceResponse update(Long id, ResourceRequest req) {
        LearningResource r = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + id));
        Skill skill = skillRepository.findById(req.skillId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found: " + req.skillId()));
        r.setSkill(skill);
        r.setResourceTitle(req.resourceTitle());
        r.setResourceUrl(req.resourceUrl());
        if (req.resourceType() != null) r.setResourceType(req.resourceType());
        r.setDescription(req.description());
        return toResponse(resourceRepository.save(r));
    }

    public void delete(Long id) {
        if (!resourceRepository.existsById(id))
            throw new ResourceNotFoundException("Resource not found: " + id);
        resourceRepository.deleteById(id);
    }

    private LearningResourceResponse toResponse(LearningResource r) {
        return new LearningResourceResponse(r.getId(), r.getSkill().getId(), r.getSkill().getSkillName(),
                r.getResourceTitle(), r.getResourceUrl(), r.getResourceType(), r.getDescription());
    }
}
