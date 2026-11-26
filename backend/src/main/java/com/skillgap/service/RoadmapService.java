package com.skillgap.service;

import com.skillgap.dto.request.TaskUpdateRequest;
import com.skillgap.dto.response.RoadmapResponse;
import com.skillgap.dto.response.RoadmapTaskResponse;
import com.skillgap.entity.*;
import com.skillgap.enums.GapStatus;
import com.skillgap.enums.Priority;
import com.skillgap.enums.TaskStatus;
import com.skillgap.exception.ResourceNotFoundException;
import com.skillgap.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class RoadmapService {

    private final RoadmapRepository roadmapRepository;
    private final RoadmapTaskRepository taskRepository;
    private final AssessmentRepository assessmentRepository;
    private final AssessmentDetailRepository detailRepository;
    private final LearningResourceRepository resourceRepository;

    public RoadmapService(RoadmapRepository roadmapRepository,
                          RoadmapTaskRepository taskRepository,
                          AssessmentRepository assessmentRepository,
                          AssessmentDetailRepository detailRepository,
                          LearningResourceRepository resourceRepository) {
        this.roadmapRepository = roadmapRepository;
        this.taskRepository = taskRepository;
        this.assessmentRepository = assessmentRepository;
        this.detailRepository = detailRepository;
        this.resourceRepository = resourceRepository;
    }

    public RoadmapResponse generate(Long assessmentId) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found: " + assessmentId));

        List<AssessmentDetail> gaps = detailRepository.findByAssessmentId(assessmentId).stream()
                .filter(d -> d.getGapStatus() != GapStatus.MATCHED)
                .sorted(Comparator
                        .comparingInt((AssessmentDetail d) -> priorityScore(d.getGapStatus(), d.getImportanceWeight()))
                        .reversed())
                .toList();

        Roadmap roadmap = new Roadmap();
        roadmap.setStudent(assessment.getStudent());
        roadmap.setAssessment(assessment);
        roadmap.setRoadmapTitle("Learning Roadmap – " + assessment.getJobRole().getRoleName());
        roadmap.setCompletionPercentage(0.0);
        roadmap = roadmapRepository.save(roadmap);

        LocalDate targetDate = LocalDate.now().plusWeeks(1);
        for (int i = 0; i < gaps.size(); i++) {
            AssessmentDetail d = gaps.get(i);
            int required = d.getRequiredProficiency().getValue();
            int current = d.getStudentProficiency() != null ? d.getStudentProficiency().getValue() : 0;
            int delta = required - current;
            int hours = Math.max(10, delta * 15);

            Priority priority = computePriority(d.getGapStatus(), d.getImportanceWeight());
            String taskTitle = d.getGapStatus() == GapStatus.MISSING
                    ? "Learn " + d.getSkill().getSkillName() + " from scratch"
                    : "Improve " + d.getSkill().getSkillName() + " from " + d.getStudentProficiency().name() + " to " + d.getRequiredProficiency().name();

            String desc = "Build " + d.getRequiredProficiency().name().toLowerCase() +
                    "-level proficiency in " + d.getSkill().getSkillName() +
                    " to meet the requirements for " + assessment.getJobRole().getRoleName() + ".";

            LearningResource resource = resourceRepository.findFirstBySkillId(d.getSkill().getId()).orElse(null);

            RoadmapTask task = new RoadmapTask();
            task.setRoadmap(roadmap);
            task.setSkill(d.getSkill());
            task.setTaskTitle(taskTitle);
            task.setTaskDescription(desc);
            task.setPriority(priority);
            task.setEstimatedHours(hours);
            task.setTargetDate(targetDate.plusWeeks(i));
            task.setTaskStatus(TaskStatus.PENDING);
            task.setResource(resource);
            taskRepository.save(task);
        }

        return toResponse(roadmap);
    }

    public List<RoadmapResponse> getByStudent(Long studentId) {
        return roadmapRepository.findByStudentIdOrderByCreatedAtDesc(studentId)
                .stream().map(this::toResponse).toList();
    }

    public RoadmapResponse getById(Long id) {
        return toResponse(findById(id));
    }

    public List<RoadmapTaskResponse> getTasks(Long roadmapId) {
        findById(roadmapId);
        return taskRepository.findByRoadmapIdOrderByPriorityAscCreatedAtAsc(roadmapId)
                .stream().map(this::toTaskResponse).toList();
    }

    public RoadmapTaskResponse updateTask(Long taskId, TaskUpdateRequest req) {
        RoadmapTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + taskId));
        if (req.taskStatus() != null) task.setTaskStatus(req.taskStatus());
        if (req.taskTitle() != null) task.setTaskTitle(req.taskTitle());
        if (req.taskDescription() != null) task.setTaskDescription(req.taskDescription());
        if (req.targetDate() != null) task.setTargetDate(req.targetDate());
        task = taskRepository.save(task);
        recalculateCompletion(task.getRoadmap());
        return toTaskResponse(task);
    }

    private void recalculateCompletion(Roadmap roadmap) {
        long total = taskRepository.countByRoadmapId(roadmap.getId());
        long completed = taskRepository.countByRoadmapIdAndTaskStatus(roadmap.getId(), TaskStatus.COMPLETED);
        double pct = total > 0 ? Math.round(((double) completed / total * 100.0) * 100.0) / 100.0 : 0.0;
        roadmap.setCompletionPercentage(pct);
        roadmapRepository.save(roadmap);
    }

    private Priority computePriority(GapStatus status, int weight) {
        if (status == GapStatus.MISSING || weight >= 4) return Priority.HIGH;
        if (weight == 3) return Priority.MEDIUM;
        return Priority.LOW;
    }

    private int priorityScore(GapStatus status, int weight) {
        int base = status == GapStatus.MISSING ? 10 : 0;
        return base + weight;
    }

    private Roadmap findById(Long id) {
        return roadmapRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap not found: " + id));
    }

    private RoadmapResponse toResponse(Roadmap r) {
        long total = taskRepository.countByRoadmapId(r.getId());
        long completed = taskRepository.countByRoadmapIdAndTaskStatus(r.getId(), TaskStatus.COMPLETED);
        return new RoadmapResponse(r.getId(), r.getStudent().getId(), r.getAssessment().getId(),
                r.getRoadmapTitle(), r.getCompletionPercentage(), (int) total, (int) completed, r.getCreatedAt());
    }

    private RoadmapTaskResponse toTaskResponse(RoadmapTask t) {
        LearningResource res = t.getResource();
        return new RoadmapTaskResponse(
                t.getId(), t.getRoadmap().getId(),
                t.getSkill().getId(), t.getSkill().getSkillName(),
                t.getTaskTitle(), t.getTaskDescription(),
                t.getPriority(), t.getEstimatedHours(), t.getTargetDate(),
                t.getTaskStatus(),
                res != null ? res.getId() : null,
                res != null ? res.getResourceTitle() : null,
                res != null ? res.getResourceUrl() : null,
                t.getUpdatedAt()
        );
    }
}
