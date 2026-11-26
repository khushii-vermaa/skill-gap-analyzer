# Skill-Gap Analyzer for Placement Readiness

A full-stack academic project that helps students identify skill gaps and prepare for job placements.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS + React Router DOM + Axios + Recharts |
| Backend | Java 21 + Spring Boot 3.2.5 + Spring Data JPA + Hibernate |
| Database | MySQL 8.0 |
| Security | BCrypt password hashing |

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@skillgap.edu` | `Admin@123` |
| Student | `aarav@student.edu` | `Student@123` |
| Student | `priya@student.edu` | `Student@123` |
| Student | `ravi@student.edu` | `Student@123` |

---

## Project Structure

```
skill-gap-analyzer/
├── frontend/           # React + Vite frontend
├── backend/            # Java Spring Boot backend
├── database/           # SQL scripts
│   ├── schema.sql      # Database schema (auto-created by Hibernate)
│   └── sample-data.sql # Seed data for demo
└── README.md
```

---

## Setup & Run Instructions

### Prerequisites

- Java 21 (Temurin/OpenJDK)
- Maven 3.9+ (or use `mvnw.cmd` wrapper)
- Node.js 18+ and npm
- MySQL 8.0

### Step 1: Create the Database

Open MySQL Workbench or any MySQL client and run:

```sql
CREATE DATABASE IF NOT EXISTS skill_gap_analyzer;
```

### Step 2: Configure Backend

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/skill_gap_analyzer
spring.datasource.username=root
spring.datasource.password=root   # <-- Change to your MySQL password
```

### Step 3: Start the Backend

```bash
cd backend

# Using Maven Wrapper (downloads Maven automatically):
.\mvnw.cmd spring-boot:run

# Or if Maven is installed globally:
mvn spring-boot:run
```

> Tables are **auto-created** by Hibernate on first run (`ddl-auto=update`).  
> Backend runs at **http://localhost:8080**

### Step 4: Load Sample Data

After the backend starts and tables are created, load the seed data:

**Using MySQL Workbench:** Open `database/sample-data.sql` and execute it.

**Using MySQL CLI:**
```bash
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p skill_gap_analyzer < database\sample-data.sql
```

### Step 5: Start the Frontend

```bash
cd frontend
npm install          # Only needed first time
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## Skill-Gap Algorithm

The readiness score is calculated using a **weighted formula**:

**Proficiency Mapping:**
| Level | Score |
|-------|-------|
| BEGINNER | 1 |
| INTERMEDIATE | 2 |
| ADVANCED | 3 |
| EXPERT | 4 |

**Per-Skill Match Percentage:**
```
Match% = min(100, (studentScore / requiredScore) × 100)
```
- If skill is MISSING → Match% = 0%
- If student proficiency ≥ required → MATCHED (capped at 100%)
- If student proficiency < required → NEEDS_IMPROVEMENT

**Overall Readiness Score:**
```
Readiness = SUM(Match%_i × Weight_i) / SUM(Weight_i)
```

---

## REST API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register student |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | List all students |
| GET | `/api/students/{id}` | Get student by ID |
| PUT | `/api/students/{id}` | Update student profile |
| PATCH | `/api/students/{id}/status` | Activate/deactivate |

### Skills & Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/{id}` | Update category |
| DELETE | `/api/categories/{id}` | Delete category |
| GET | `/api/skills` | List skills |
| POST | `/api/skills` | Create skill |
| PUT | `/api/skills/{id}` | Update skill |
| DELETE | `/api/skills/{id}` | Delete skill |

### Student Skills
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/student-skills/{studentId}` | Get student's skills |
| POST | `/api/student-skills` | Add skill |
| PUT | `/api/student-skills/{id}` | Update skill |
| DELETE | `/api/student-skills/{id}` | Remove skill |

### Job Roles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/job-roles` | List job roles |
| GET | `/api/job-roles/{id}` | Get job role |
| POST | `/api/job-roles` | Create job role |
| PUT | `/api/job-roles/{id}` | Update job role |
| DELETE | `/api/job-roles/{id}` | Delete job role |
| GET | `/api/job-roles/{id}/skills` | Get skill requirements |
| POST | `/api/job-roles/{id}/skills` | Add requirement |
| PUT | `/api/job-roles/requirements/{id}` | Update requirement |
| DELETE | `/api/job-roles/requirements/{id}` | Delete requirement |

### Analysis & Assessments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analysis/{studentId}/{jobRoleId}` | Run skill-gap analysis |
| GET | `/api/analysis/{assessmentId}` | Get analysis result |
| GET | `/api/analysis/{assessmentId}/details` | Get detailed results |
| GET | `/api/assessments` | List all assessments |
| GET | `/api/assessments/student/{studentId}` | Student's assessments |
| GET | `/api/assessments/student/{studentId}/latest` | Latest assessment |

### Roadmaps
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/roadmaps/generate/{assessmentId}` | Generate roadmap |
| GET | `/api/roadmaps/student/{studentId}` | Student's roadmaps |
| GET | `/api/roadmaps/{id}` | Get roadmap |
| GET | `/api/roadmaps/{id}/tasks` | Get tasks |
| PUT | `/api/roadmaps/tasks/{id}` | Update task status |

### Learning Resources
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resources` | List resources |
| GET | `/api/resources/skill/{skillId}` | Resources by skill |
| POST | `/api/resources` | Create resource |
| PUT | `/api/resources/{id}` | Update resource |
| DELETE | `/api/resources/{id}` | Delete resource |

### Dashboard & Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/admin` | Admin dashboard stats |
| GET | `/api/dashboard/student/{studentId}` | Student dashboard |
| GET | `/api/reports/summary` | Summary stats |
| GET | `/api/reports/job-roles` | Job role report |
| GET | `/api/reports/skills` | Skills gap report |
| GET | `/api/reports/readiness` | Readiness distribution |

---

## User Roles

### Admin
- Manage students, skills, job roles, learning resources
- View analytics, reports, and assessment history
- Configure skill requirements per job role with weights

### Student
- Create profile and add skills with proficiency levels
- Select target job role and run skill-gap analysis
- View readiness score, matched/missing/improvement skills
- Generate personalized learning roadmap
- Track progress and mark tasks complete
- View assessment history and score trend

---

## Build for Production

```bash
# Backend JAR
cd backend
.\mvnw.cmd clean package -DskipTests
java -jar target/skill-gap-analyzer-0.0.1-SNAPSHOT.jar

# Frontend production build
cd frontend
npm run build
# Serve dist/ with any static file server
```
