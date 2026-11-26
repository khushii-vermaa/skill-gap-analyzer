package com.skillgap.service;

import com.skillgap.dto.request.StudentRequest;
import com.skillgap.dto.response.StudentResponse;
import com.skillgap.entity.JobRole;
import com.skillgap.entity.Student;
import com.skillgap.exception.ResourceNotFoundException;
import com.skillgap.repository.JobRoleRepository;
import com.skillgap.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;
    private final JobRoleRepository jobRoleRepository;

    public StudentService(StudentRepository studentRepository, JobRoleRepository jobRoleRepository) {
        this.studentRepository = studentRepository;
        this.jobRoleRepository = jobRoleRepository;
    }

    public List<StudentResponse> getAll() {
        return studentRepository.findAll().stream().map(this::toResponse).toList();
    }

    public StudentResponse getById(Long id) {
        return toResponse(findById(id));
    }

    public StudentResponse update(Long id, StudentRequest req) {
        Student student = findById(id);
        if (req.fullName() != null) student.setFullName(req.fullName());
        if (req.phone() != null) student.setPhone(req.phone());
        if (req.college() != null) student.setCollege(req.college());
        if (req.department() != null) student.setDepartment(req.department());
        if (req.academicYear() != null) student.setAcademicYear(req.academicYear());
        if (req.graduationYear() != null) student.setGraduationYear(req.graduationYear());
        if (req.cgpa() != null) student.setCgpa(req.cgpa());
        if (req.resumeUrl() != null) student.setResumeUrl(req.resumeUrl());
        if (req.preferredJobRoleId() != null) {
            JobRole role = jobRoleRepository.findById(req.preferredJobRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Job role not found: " + req.preferredJobRoleId()));
            student.setPreferredJobRole(role);
        }
        return toResponse(studentRepository.save(student));
    }

    public StudentResponse updateStatus(Long id, boolean active) {
        Student student = findById(id);
        student.getUser().setActive(active);
        return toResponse(studentRepository.save(student));
    }

    private Student findById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + id));
    }

    public StudentResponse toResponse(Student s) {
        return new StudentResponse(
                s.getId(), s.getUser().getId(), s.getFullName(), s.getUser().getEmail(),
                s.getPhone(), s.getCollege(), s.getDepartment(), s.getAcademicYear(),
                s.getGraduationYear(), s.getCgpa(), s.getResumeUrl(),
                s.getPreferredJobRole() != null ? s.getPreferredJobRole().getId() : null,
                s.getPreferredJobRole() != null ? s.getPreferredJobRole().getRoleName() : null,
                s.getUser().isActive(), s.getCreatedAt()
        );
    }
}
