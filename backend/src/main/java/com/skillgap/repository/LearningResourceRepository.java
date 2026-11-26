package com.skillgap.repository;

import com.skillgap.entity.LearningResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LearningResourceRepository extends JpaRepository<LearningResource, Long> {
    List<LearningResource> findBySkillId(Long skillId);
    Optional<LearningResource> findFirstBySkillId(Long skillId);
}
