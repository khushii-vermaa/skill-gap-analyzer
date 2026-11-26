package com.skillgap.repository;

import com.skillgap.entity.RoadmapTask;
import com.skillgap.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoadmapTaskRepository extends JpaRepository<RoadmapTask, Long> {
    List<RoadmapTask> findByRoadmapIdOrderByPriorityAscCreatedAtAsc(Long roadmapId);
    long countByRoadmapId(Long roadmapId);
    long countByRoadmapIdAndTaskStatus(Long roadmapId, TaskStatus status);
}
