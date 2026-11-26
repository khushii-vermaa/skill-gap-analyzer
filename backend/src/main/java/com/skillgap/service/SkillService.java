package com.skillgap.service;

import com.skillgap.dto.request.SkillRequest;
import com.skillgap.dto.response.SkillResponse;
import com.skillgap.entity.Skill;
import com.skillgap.entity.SkillCategory;
import com.skillgap.exception.ResourceNotFoundException;
import com.skillgap.repository.SkillCategoryRepository;
import com.skillgap.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SkillService {

    private final SkillRepository skillRepository;
    private final SkillCategoryRepository categoryRepository;

    public SkillService(SkillRepository skillRepository, SkillCategoryRepository categoryRepository) {
        this.skillRepository = skillRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<SkillResponse> getAll() {
        return skillRepository.findAll().stream().map(this::toResponse).toList();
    }

    public SkillResponse getById(Long id) {
        return toResponse(findById(id));
    }

    public SkillResponse create(SkillRequest req) {
        SkillCategory cat = categoryRepository.findById(req.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + req.categoryId()));
        Skill skill = new Skill();
        skill.setSkillName(req.skillName());
        skill.setCategory(cat);
        skill.setDescription(req.description());
        return toResponse(skillRepository.save(skill));
    }

    public SkillResponse update(Long id, SkillRequest req) {
        Skill skill = findById(id);
        SkillCategory cat = categoryRepository.findById(req.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + req.categoryId()));
        skill.setSkillName(req.skillName());
        skill.setCategory(cat);
        skill.setDescription(req.description());
        return toResponse(skillRepository.save(skill));
    }

    public void delete(Long id) {
        if (!skillRepository.existsById(id)) throw new ResourceNotFoundException("Skill not found: " + id);
        skillRepository.deleteById(id);
    }

    private Skill findById(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found: " + id));
    }

    public SkillResponse toResponse(Skill s) {
        return new SkillResponse(s.getId(), s.getSkillName(),
                s.getCategory().getId(), s.getCategory().getCategoryName(), s.getDescription());
    }
}
