package com.skillgap.repository;

import com.skillgap.entity.JobRoleSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobRoleSkillRepository extends JpaRepository<JobRoleSkill, Long> {
    List<JobRoleSkill> findByJobRoleId(Long jobRoleId);
    Optional<JobRoleSkill> findByJobRoleIdAndSkillId(Long jobRoleId, Long skillId);
    int countByJobRoleId(Long jobRoleId);
}
