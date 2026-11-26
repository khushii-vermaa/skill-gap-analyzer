package com.skillgap.service;

import com.skillgap.dto.request.LoginRequest;
import com.skillgap.dto.request.RegisterRequest;
import com.skillgap.dto.response.AuthResponse;
import com.skillgap.entity.Student;
import com.skillgap.entity.User;
import com.skillgap.enums.Role;
import com.skillgap.exception.BadRequestException;
import com.skillgap.repository.StudentRepository;
import com.skillgap.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, StudentRepository studentRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new BadRequestException("Invalid email or password."));
        if (!user.isActive()) throw new BadRequestException("Account is deactivated. Please contact admin.");
        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password.");
        }
        Long studentId = null;
        String fullName = user.getUsername();
        if (user.getRole() == Role.STUDENT) {
            Student student = studentRepository.findByUserId(user.getId()).orElse(null);
            if (student != null) {
                studentId = student.getId();
                fullName = student.getFullName();
            }
        }
        return new AuthResponse(user.getId(), user.getUsername(), user.getEmail(), fullName, user.getRole(), studentId);
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) throw new BadRequestException("Email already registered.");
        if (userRepository.existsByUsername(req.username())) throw new BadRequestException("Username already taken.");

        User user = new User();
        user.setUsername(req.username());
        user.setEmail(req.email());
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setRole(Role.STUDENT);
        userRepository.save(user);

        Student student = new Student();
        student.setUser(user);
        student.setFullName(req.fullName());
        student.setPhone(req.phone());
        student.setCollege(req.college());
        student.setDepartment(req.department());
        student.setAcademicYear(req.academicYear());
        student.setGraduationYear(req.graduationYear());
        studentRepository.save(student);

        return new AuthResponse(user.getId(), user.getUsername(), user.getEmail(), student.getFullName(), user.getRole(), student.getId());
    }
}
