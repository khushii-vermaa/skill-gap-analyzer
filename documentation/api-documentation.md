# REST API Documentation: Skill-Gap Analyzer

Base URL: `http://localhost:8080/api`

---

## Authentication (`/auth`)

### 1. User Login
- **Endpoint:** `POST /auth/login`
- **Request Body:**
  ```json
  {
    "email": "aarav@student.edu",
    "password": "Student@123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "userId": 2,
    "username": "aarav_shah",
    "email": "aarav@student.edu",
    "fullName": "Aarav Shah",
    "role": "STUDENT",
    "studentProfileId": 1
  }
  ```

### 2. Student Registration
- **Endpoint:** `POST /auth/register`
- **Request Body:**
  ```json
  {
    "username": "rohit_s",
    "email": "rohit@student.edu",
    "password": "Student@123",
    "fullName": "Rohit Sharma",
    "phone": "9812345678",
    "college": "Delhi Technological University",
    "department": "Computer Engineering",
    "academicYear": "3rd Year",
    "graduationYear": 2026
  }
  ```
- **Response (200 OK):** `AuthResponse`

---

## Students (`/students`)

- `GET /students` - List all students (Admin)
- `GET /students/{id}` - Get student profile by ID
- `PUT /students/{id}` - Update student profile
- `PATCH /students/{id}/status` - Update account activation status (Admin)

---

## Skill Categories (`/categories`)

- `GET /categories` - List all skill categories
- `POST /categories` - Create new category (Admin)
- `PUT /categories/{id}` - Update category (Admin)
- `DELETE /categories/{id}` - Delete category (Admin)

---

## Skills (`/skills`)

- `GET /skills` - List all skills with their categories
- `GET /skills/{id}` - Get skill by ID
- `POST /skills` - Create skill (Admin)
- `PUT /skills/{id}` - Update skill (Admin)
- `DELETE /skills/{id}` - Delete skill (Admin)

---

## Student Skills (`/student-skills`)

- `GET /student-skills/{studentId}` - List student's added skills
- `POST /student-skills` - Add new skill to student profile
  ```json
  {
    "studentId": 1,
    "skillId": 16,
    "proficiencyLevel": "INTERMEDIATE",
    "yearsOfExperience": 1.0,
    "lastPracticedDate": "2026-03-01"
  }
  ```
- `PUT /student-skills/{id}` - Update proficiency or experience
- `DELETE /student-skills/{id}` - Delete skill from profile

---

## Job Roles (`/job-roles`)

- `GET /job-roles` - List available job roles
- `GET /job-roles/{id}` - Get job role details
- `POST /job-roles` - Create job role (Admin)
- `PUT /job-roles/{id}` - Update job role (Admin)
- `DELETE /job-roles/{id}` - Delete job role (Admin)
- `GET /job-roles/{id}/skills` - Get required skills for a job role
- `POST /job-roles/{id}/skills` - Add skill requirement to role (Admin)
- `PUT /job-roles/requirements/{reqId}` - Update skill requirement (Admin)
- `DELETE /job-roles/requirements/{reqId}` - Remove skill requirement (Admin)

---

## Skill-Gap Analysis (`/analysis`)

- `POST /analysis/{studentId}/{jobRoleId}` - Compute skill-gap analysis and record assessment
- `GET /analysis/{assessmentId}` - Get overall score and summary metrics
- `GET /analysis/{assessmentId}/details` - Get individual skill match percentages, gap statuses, and importance weights

---

## Assessments (`/assessments`)

- `GET /assessments` - List all historical assessments (Admin)
- `GET /assessments/student/{studentId}` - List student's assessment history
- `GET /assessments/{id}` - Get assessment by ID
- `GET /assessments/student/{studentId}/latest` - Get latest assessment for student

---

## Learning Roadmaps (`/roadmaps`)

- `POST /roadmaps/generate/{assessmentId}` - Generate personalized learning roadmap from assessment gaps
- `GET /roadmaps/student/{studentId}` - List student's roadmaps
- `GET /roadmaps/{id}` - Get roadmap metadata and completion percentage
- `GET /roadmaps/{id}/tasks` - List all action items and milestones
- `PUT /roadmaps/tasks/{taskId}` - Update task status (`PENDING`, `IN_PROGRESS`, `COMPLETED`)

---

## Learning Resources (`/resources`)

- `GET /resources` - List all learning resources
- `GET /resources/skill/{skillId}` - List resources mapped to a specific skill
- `POST /resources` - Create learning resource (Admin)
- `PUT /resources/{id}` - Update resource (Admin)
- `DELETE /resources/{id}` - Delete resource (Admin)

---

## Dashboard & Analytics (`/dashboard`)

- `GET /dashboard/admin` - High-level metrics for Admin (total students, skills, roles, average readiness score, role-wise stats, recent activity)
- `GET /dashboard/student/{studentId}` - Student progress metrics (current score, change from last score, skill counts, roadmap progress, upcoming deadlines)

---

## Reports (`/reports`)

- `GET /reports/summary` - Aggregate high-level KPIs
- `GET /reports/job-roles` - Performance breakdown across job roles
- `GET /reports/skills` - Top missing and weak skills across students
- `GET /reports/readiness` - Histogram distribution of student placement readiness
