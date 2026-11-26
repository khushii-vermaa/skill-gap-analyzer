package com.skillgap.repository;

import com.skillgap.entity.AssessmentDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentDetailRepository extends JpaRepository<AssessmentDetail, Long> {
    List<AssessmentDetail> findByAssessmentId(Long assessmentId);
}
