package com.skillgap.repository;

import com.skillgap.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByStudentIdOrderByAssessmentDateDesc(Long studentId);
    Optional<Assessment> findFirstByStudentIdOrderByAssessmentDateDesc(Long studentId);
    List<Assessment> findAllByOrderByAssessmentDateDesc();
}
