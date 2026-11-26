package com.skillgap.service;

import com.skillgap.dto.request.SkillCategoryRequest;
import com.skillgap.dto.response.SkillCategoryResponse;
import com.skillgap.entity.SkillCategory;
import com.skillgap.exception.BadRequestException;
import com.skillgap.exception.ResourceNotFoundException;
import com.skillgap.repository.SkillCategoryRepository;
import com.skillgap.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SkillCategoryService {

    private final SkillCategoryRepository categoryRepository;
    private final SkillRepository skillRepository;

    public SkillCategoryService(SkillCategoryRepository categoryRepository, SkillRepository skillRepository) {
        this.categoryRepository = categoryRepository;
        this.skillRepository = skillRepository;
    }

    public List<SkillCategoryResponse> getAll() {
        return categoryRepository.findAll().stream()
                .map(c -> new SkillCategoryResponse(c.getId(), c.getCategoryName(), c.getDescription(),
                        skillRepository.countByCategoryId(c.getId())))
                .toList();
    }

    public SkillCategoryResponse create(SkillCategoryRequest req) {
        if (categoryRepository.existsByCategoryNameIgnoreCase(req.categoryName()))
            throw new BadRequestException("Category already exists: " + req.categoryName());
        SkillCategory cat = new SkillCategory();
        cat.setCategoryName(req.categoryName());
        cat.setDescription(req.description());
        return toResponse(categoryRepository.save(cat));
    }

    public SkillCategoryResponse update(Long id, SkillCategoryRequest req) {
        SkillCategory cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
        cat.setCategoryName(req.categoryName());
        cat.setDescription(req.description());
        return toResponse(categoryRepository.save(cat));
    }

    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) throw new ResourceNotFoundException("Category not found: " + id);
        categoryRepository.deleteById(id);
    }

    private SkillCategoryResponse toResponse(SkillCategory c) {
        return new SkillCategoryResponse(c.getId(), c.getCategoryName(), c.getDescription(),
                skillRepository.countByCategoryId(c.getId()));
    }
}
