package com.skillgap.service;

import com.skillgap.dto.request.StudentSkillRequest;
import com.skillgap.dto.response.StudentSkillResponse;
import com.skillgap.entity.Skill;
import com.skillgap.entity.Student;
import com.skillgap.entity.StudentSkill;
import com.skillgap.exception.BadRequestException;
import com.skillgap.exception.ResourceNotFoundException;
import com.skillgap.repository.SkillRepository;
import com.skillgap.repository.StudentRepository;
import com.skillgap.repository.StudentSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StudentSkillService {

    private final StudentSkillRepository studentSkillRepository;
    private final StudentRepository studentRepository;
    private final SkillRepository skillRepository;

    public StudentSkillService(StudentSkillRepository studentSkillRepository,
                                StudentRepository studentRepository,
                                SkillRepository skillRepository) {
        this.studentSkillRepository = studentSkillRepository;
        this.studentRepository = studentRepository;
        this.skillRepository = skillRepository;
    }

    public List<StudentSkillResponse> getByStudentId(Long studentId) {
        return studentSkillRepository.findByStudentId(studentId).stream().map(this::toResponse).toList();
    }

    public StudentSkillResponse add(StudentSkillRequest req) {
        Student student = studentRepository.findById(req.studentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + req.studentId()));
        Skill skill = skillRepository.findById(req.skillId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found: " + req.skillId()));
        if (studentSkillRepository.findByStudentIdAndSkillId(req.studentId(), req.skillId()).isPresent()) {
            throw new BadRequestException("Skill already added to this student's profile.");
        }
        StudentSkill ss = new StudentSkill();
        ss.setStudent(student);
        ss.setSkill(skill);
        ss.setProficiencyLevel(req.proficiencyLevel());
        ss.setExperienceYears(req.experienceYears());
        ss.setLastPracticed(req.lastPracticed());
        return toResponse(studentSkillRepository.save(ss));
    }

    public StudentSkillResponse update(Long id, StudentSkillRequest req) {
        StudentSkill ss = studentSkillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student skill not found: " + id));
        ss.setProficiencyLevel(req.proficiencyLevel());
        ss.setExperienceYears(req.experienceYears());
        ss.setLastPracticed(req.lastPracticed());
        return toResponse(studentSkillRepository.save(ss));
    }

    public void delete(Long id) {
        if (!studentSkillRepository.existsById(id))
            throw new ResourceNotFoundException("Student skill not found: " + id);
        studentSkillRepository.deleteById(id);
    }

    private StudentSkillResponse toResponse(StudentSkill ss) {
        return new StudentSkillResponse(
                ss.getId(), ss.getStudent().getId(),
                ss.getSkill().getId(), ss.getSkill().getSkillName(),
                ss.getSkill().getCategory().getCategoryName(),
                ss.getProficiencyLevel(), ss.getExperienceYears(),
                ss.getLastPracticed(), ss.getUpdatedAt()
        );
    }
}
