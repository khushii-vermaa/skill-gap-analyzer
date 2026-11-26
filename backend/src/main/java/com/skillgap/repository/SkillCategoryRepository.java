package com.skillgap.repository;

import com.skillgap.entity.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillCategoryRepository extends JpaRepository<SkillCategory, Long> {
    boolean existsByCategoryNameIgnoreCase(String categoryName);
}
