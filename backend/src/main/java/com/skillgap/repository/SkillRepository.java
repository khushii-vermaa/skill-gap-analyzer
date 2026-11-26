package com.skillgap.repository;

import com.skillgap.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByCategoryId(Long categoryId);
    Optional<Skill> findBySkillNameIgnoreCase(String skillName);
    long countByCategoryId(Long categoryId);
}
