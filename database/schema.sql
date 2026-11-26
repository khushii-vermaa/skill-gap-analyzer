-- ============================================================
-- Skill-Gap Analyzer for Placement Readiness
-- Database Schema
-- MySQL 8.0
-- ============================================================

CREATE DATABASE IF NOT EXISTS skill_gap_analyzer
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE skill_gap_analyzer;

-- ============================================================
-- 1. users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'STUDENT') NOT NULL DEFAULT 'STUDENT',
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 2. skill_categories
-- ============================================================
CREATE TABLE IF NOT EXISTS skill_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 3. job_roles
-- ============================================================
CREATE TABLE IF NOT EXISTS job_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 4. students
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    college VARCHAR(255),
    department VARCHAR(150),
    academic_year VARCHAR(50),
    graduation_year INT,
    cgpa DECIMAL(4,2),
    resume_url VARCHAR(500),
    preferred_job_role_id BIGINT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_student_job_role FOREIGN KEY (preferred_job_role_id) REFERENCES job_roles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 5. skills
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(200) NOT NULL UNIQUE,
    category_id BIGINT NOT NULL,
    description TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_skill_category FOREIGN KEY (category_id) REFERENCES skill_categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 6. student_skills
-- ============================================================
CREATE TABLE IF NOT EXISTS student_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    proficiency_level ENUM('BEGINNER','INTERMEDIATE','ADVANCED','EXPERT') NOT NULL,
    experience_years DECIMAL(4,1),
    last_practiced DATE,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_skill UNIQUE (student_id, skill_id),
    CONSTRAINT fk_ss_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_ss_skill FOREIGN KEY (skill_id) REFERENCES skills(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 7. job_role_skills
-- ============================================================
CREATE TABLE IF NOT EXISTS job_role_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_role_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    required_proficiency ENUM('BEGINNER','INTERMEDIATE','ADVANCED','EXPERT') NOT NULL,
    importance_weight INT NOT NULL DEFAULT 3 CHECK (importance_weight BETWEEN 1 AND 5),
    is_mandatory TINYINT(1) NOT NULL DEFAULT 0,
    CONSTRAINT uq_role_skill UNIQUE (job_role_id, skill_id),
    CONSTRAINT fk_jrs_role FOREIGN KEY (job_role_id) REFERENCES job_roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_jrs_skill FOREIGN KEY (skill_id) REFERENCES skills(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 8. assessments
-- ============================================================
CREATE TABLE IF NOT EXISTS assessments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    job_role_id BIGINT NOT NULL,
    readiness_score DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    total_required_skills INT NOT NULL DEFAULT 0,
    matched_skills INT NOT NULL DEFAULT 0,
    missing_skills_count INT NOT NULL DEFAULT 0,
    improvement_skills_count INT NOT NULL DEFAULT 0,
    assessment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assess_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_assess_role FOREIGN KEY (job_role_id) REFERENCES job_roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 9. assessment_details
-- ============================================================
CREATE TABLE IF NOT EXISTS assessment_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    student_proficiency ENUM('BEGINNER','INTERMEDIATE','ADVANCED','EXPERT'),
    required_proficiency ENUM('BEGINNER','INTERMEDIATE','ADVANCED','EXPERT') NOT NULL,
    match_percentage DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    importance_weight INT NOT NULL DEFAULT 1,
    gap_status ENUM('MATCHED','NEEDS_IMPROVEMENT','MISSING') NOT NULL,
    CONSTRAINT fk_ad_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    CONSTRAINT fk_ad_skill FOREIGN KEY (skill_id) REFERENCES skills(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 10. learning_resources
-- ============================================================
CREATE TABLE IF NOT EXISTS learning_resources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    skill_id BIGINT NOT NULL,
    resource_title VARCHAR(300) NOT NULL,
    resource_url VARCHAR(500),
    resource_type ENUM('VIDEO','ARTICLE','COURSE','BOOK','PRACTICE') NOT NULL DEFAULT 'COURSE',
    description TEXT,
    CONSTRAINT fk_lr_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 11. roadmaps
-- ============================================================
CREATE TABLE IF NOT EXISTS roadmaps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    assessment_id BIGINT NOT NULL,
    roadmap_title VARCHAR(300) NOT NULL,
    completion_percentage DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rm_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_rm_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 12. roadmap_tasks
-- ============================================================
CREATE TABLE IF NOT EXISTS roadmap_tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    roadmap_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    task_title VARCHAR(300) NOT NULL,
    task_description TEXT,
    priority ENUM('HIGH','MEDIUM','LOW') NOT NULL DEFAULT 'MEDIUM',
    estimated_hours INT,
    target_date DATE,
    task_status ENUM('PENDING','IN_PROGRESS','COMPLETED') NOT NULL DEFAULT 'PENDING',
    resource_id BIGINT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rt_roadmap FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE,
    CONSTRAINT fk_rt_skill FOREIGN KEY (skill_id) REFERENCES skills(id),
    CONSTRAINT fk_rt_resource FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
