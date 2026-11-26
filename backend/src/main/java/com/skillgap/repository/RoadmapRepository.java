package com.skillgap.repository;

import com.skillgap.entity.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {
    List<Roadmap> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    Optional<Roadmap> findFirstByStudentIdOrderByCreatedAtDesc(Long studentId);
}
