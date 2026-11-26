-- ============================================================
-- Skill-Gap Analyzer - Schema-Matched Seed Data
-- ============================================================

USE skill_gap_analyzer;

-- 1. SKILL CATEGORIES
INSERT IGNORE INTO skill_categories (id, category_name, description, created_at) VALUES
(1,  'Programming Languages',         'Core programming languages used in software engineering', NOW()),
(2,  'Data Structures and Algorithms','DSA fundamentals for algorithmic problem solving', NOW()),
(3,  'Database Management',           'SQL, NoSQL, and database architecture', NOW()),
(4,  'Web Development',               'Frontend and full-stack web standards', NOW()),
(5,  'Frameworks',                    'Industry enterprise frameworks and libraries', NOW()),
(6,  'Operating Systems',             'OS concepts, memory, and Linux administration', NOW()),
(7,  'Computer Networks',             'Networking concepts, protocols, and HTTP/TCP', NOW()),
(8,  'Software Engineering',          'SDLC, design patterns, and engineering practices', NOW()),
(9,  'Cloud and DevOps',              'Containerization, CI/CD, and cloud infrastructures', NOW()),
(10, 'Data Science and Machine Learning', 'Data analysis, statistics, and machine learning models', NOW()),
(11, 'Communication Skills',          'Professional verbal and written communication', NOW()),
(12, 'Problem Solving',               'Analytical reasoning and solution decomposition', NOW()),
(13, 'Other Soft Skills',             'Teamwork, collaboration, and workplace adaptability', NOW());

-- 2. SKILLS
INSERT IGNORE INTO skills (id, skill_name, category_id, description, created_at) VALUES
-- Programming Languages
(1,  'Java',           1, 'Object-oriented programming language for enterprise applications', NOW()),
(2,  'Python',         1, 'Versatile language for backend, AI, automation, and data', NOW()),
(3,  'JavaScript',     1, 'Primary language of the modern web ecosystem', NOW()),
(4,  'C++',            1, 'High-performance systems programming language', NOW()),
(5,  'TypeScript',     1, 'Strongly typed superset of JavaScript', NOW()),
-- DSA
(6,  'Data Structures',2, 'Arrays, Linked Lists, Trees, Graphs, Hash Maps', NOW()),
(7,  'Algorithms',     2, 'Sorting, Searching, Dynamic Programming, Greedy approaches', NOW()),
-- Database Management
(8,  'SQL',            3, 'Relational query language and schema design', NOW()),
(9,  'MySQL',          3, 'Relational database management system', NOW()),
(10, 'MongoDB',        3, 'Document-based NoSQL database', NOW()),
(11, 'PostgreSQL',     3, 'Advanced open-source relational database', NOW()),
-- Web Development
(12, 'HTML & CSS',     4, 'Web markup, semantic structuring, and styling', NOW()),
(13, 'React',          4, 'Component-driven frontend UI library', NOW()),
(14, 'Angular',        4, 'TypeScript web application framework', NOW()),
(15, 'Vue.js',         4, 'Progressive JavaScript UI framework', NOW()),
-- Frameworks
(16, 'Spring Boot',    5, 'Java framework for production-grade microservices and APIs', NOW()),
(17, 'Django',         5, 'High-level Python web development framework', NOW()),
(18, 'Flask',          5, 'Lightweight Python micro-framework', NOW()),
(19, 'Node.js',        5, 'Server-side JavaScript runtime environment', NOW()),
(20, 'REST APIs',      5, 'RESTful API architecture, endpoints, and HTTP methods', NOW()),
-- Operating Systems
(21, 'Linux',          6, 'Command line, bash scripting, and Unix system operations', NOW()),
(22, 'Operating System Concepts', 6, 'Process scheduling, concurrency, threading, memory management', NOW()),
-- Computer Networks
(23, 'Computer Networks', 7, 'TCP/IP, DNS, OSI layers, sockets, HTTP/HTTPS protocols', NOW()),
-- Software Engineering
(24, 'Git',            8, 'Distributed version control and branch workflows', NOW()),
(25, 'Design Patterns',8, 'Creational, Structural, and Behavioral software patterns', NOW()),
(26, 'Agile/Scrum',    8, 'Iterative development methodologies and sprint planning', NOW()),
-- Cloud & DevOps
(27, 'Docker',         9, 'Containerization technology for application packaging', NOW()),
(28, 'Kubernetes',     9, 'Container orchestration and cluster management', NOW()),
(29, 'AWS',            9, 'Amazon Web Services cloud platform solutions', NOW()),
(30, 'CI/CD',          9, 'Continuous Integration and Continuous Deployment pipelines', NOW()),
(31, 'Jenkins',        9, 'Automation server for continuous build pipelines', NOW()),
-- Data Science & ML
(32, 'Machine Learning', 10, 'Supervised and unsupervised learning models', NOW()),
(33, 'Data Analysis',    10, 'Exploratory data analysis, cleaning, and visualization', NOW()),
(34, 'Pandas',           10, 'Python data manipulation and tabular analysis', NOW()),
(35, 'NumPy',            10, 'Scientific and multi-dimensional numerical computing', NOW()),
(36, 'TensorFlow',       10, 'Machine learning and deep neural network framework', NOW()),
(37, 'Statistics',       10, 'Probability, distributions, hypothesis testing, regression', NOW()),
-- Soft Skills
(38, 'Communication',    11, 'Technical and professional verbal/written communication', NOW()),
(39, 'Problem Solving',  12, 'Logical problem decomposition and debugging skills', NOW()),
(40, 'Teamwork',         13, 'Cross-functional collaboration and peer code reviews', NOW());

-- 3. JOB ROLES
INSERT IGNORE INTO job_roles (id, role_name, description, created_at, updated_at) VALUES
(1,  'Java Developer',          'Develops enterprise software services and APIs with Java and Spring', NOW(), NOW()),
(2,  'Python Developer',        'Builds backend services, automated workflows, and data pipelines', NOW(), NOW()),
(3,  'Frontend Developer',      'Builds interactive user interfaces using modern React and web standards', NOW(), NOW()),
(4,  'Backend Developer',       'Designs databases, servers, microservices, and high-throughput APIs', NOW(), NOW()),
(5,  'Full Stack Developer',    'End-to-end web engineering across frontend, backend, and databases', NOW(), NOW()),
(6,  'Data Analyst',            'Transforms raw data into business intelligence and dashboards', NOW(), NOW()),
(7,  'Data Scientist',          'Develops predictive models, statistics, and machine learning pipelines', NOW(), NOW()),
(8,  'Machine Learning Engineer','Builds, trains, and deploys scalable ML models to production', NOW(), NOW()),
(9,  'Software Engineer',       'Builds robust, scalable software systems across various domains', NOW(), NOW()),
(10, 'DevOps Engineer',         'Automates infrastructure, deployments, CI/CD, and cloud platforms', NOW(), NOW());

-- 4. JOB ROLE SKILL REQUIREMENTS
-- Java Developer
INSERT IGNORE INTO job_role_skills (job_role_id, skill_id, required_proficiency, importance_weight, is_mandatory) VALUES
(1, 1,  'ADVANCED',      5, 1), -- Java
(1, 6,  'ADVANCED',      5, 1), -- Data Structures
(1, 7,  'INTERMEDIATE',  4, 0), -- Algorithms
(1, 16, 'INTERMEDIATE',  4, 1), -- Spring Boot
(1, 20, 'INTERMEDIATE',  3, 0), -- REST APIs
(1, 8,  'INTERMEDIATE',  3, 0), -- SQL
(1, 9,  'BEGINNER',      2, 0), -- MySQL
(1, 24, 'INTERMEDIATE',  2, 0), -- Git
(1, 25, 'BEGINNER',      2, 0), -- Design Patterns
(1, 39, 'INTERMEDIATE',  3, 0), -- Problem Solving
(1, 38, 'INTERMEDIATE',  2, 0); -- Communication

-- Python Developer
INSERT IGNORE INTO job_role_skills (job_role_id, skill_id, required_proficiency, importance_weight, is_mandatory) VALUES
(2, 2,  'ADVANCED',      5, 1), -- Python
(2, 8,  'INTERMEDIATE',  3, 0), -- SQL
(2, 6,  'INTERMEDIATE',  4, 1), -- Data Structures
(2, 7,  'INTERMEDIATE',  4, 0), -- Algorithms
(2, 17, 'INTERMEDIATE',  3, 0), -- Django
(2, 18, 'BEGINNER',      2, 0), -- Flask
(2, 20, 'INTERMEDIATE',  3, 0), -- REST APIs
(2, 24, 'INTERMEDIATE',  2, 0), -- Git
(2, 39, 'INTERMEDIATE',  3, 0), -- Problem Solving
(2, 38, 'INTERMEDIATE',  2, 0); -- Communication

-- Frontend Developer
INSERT IGNORE INTO job_role_skills (job_role_id, skill_id, required_proficiency, importance_weight, is_mandatory) VALUES
(3, 3,  'ADVANCED',      5, 1), -- JavaScript
(3, 12, 'ADVANCED',      4, 1), -- HTML & CSS
(3, 13, 'ADVANCED',      5, 1), -- React
(3, 5,  'INTERMEDIATE',  3, 0), -- TypeScript
(3, 20, 'INTERMEDIATE',  3, 0), -- REST APIs
(3, 24, 'INTERMEDIATE',  2, 0), -- Git
(3, 38, 'INTERMEDIATE',  2, 0), -- Communication
(3, 40, 'INTERMEDIATE',  2, 0); -- Teamwork

-- Full Stack Developer
INSERT IGNORE INTO job_role_skills (job_role_id, skill_id, required_proficiency, importance_weight, is_mandatory) VALUES
(5, 3,  'ADVANCED',      4, 1), -- JavaScript
(5, 13, 'INTERMEDIATE',  4, 1), -- React
(5, 1,  'INTERMEDIATE',  3, 0), -- Java
(5, 16, 'INTERMEDIATE',  4, 1), -- Spring Boot
(5, 8,  'INTERMEDIATE',  3, 0), -- SQL
(5, 20, 'ADVANCED',      5, 1), -- REST APIs
(5, 24, 'INTERMEDIATE',  3, 0), -- Git
(5, 27, 'BEGINNER',      2, 0), -- Docker
(5, 39, 'INTERMEDIATE',  3, 0), -- Problem Solving
(5, 38, 'INTERMEDIATE',  2, 0); -- Communication

-- Data Analyst
INSERT IGNORE INTO job_role_skills (job_role_id, skill_id, required_proficiency, importance_weight, is_mandatory) VALUES
(6, 2,  'INTERMEDIATE',  3, 0), -- Python
(6, 8,  'ADVANCED',      5, 1), -- SQL
(6, 33, 'ADVANCED',      5, 1), -- Data Analysis
(6, 34, 'INTERMEDIATE',  4, 0), -- Pandas
(6, 35, 'INTERMEDIATE',  3, 0), -- NumPy
(6, 37, 'INTERMEDIATE',  4, 0), -- Statistics
(6, 24, 'BEGINNER',      2, 0), -- Git
(6, 38, 'INTERMEDIATE',  3, 0), -- Communication
(6, 39, 'INTERMEDIATE',  3, 0); -- Problem Solving

-- 5. LEARNING RESOURCES
INSERT IGNORE INTO learning_resources (skill_id, resource_title, resource_url, resource_type, description) VALUES
(1,  'Java Masterclass - Comprehensive Course', 'https://docs.oracle.com/en/java/', 'DOCUMENTATION', 'Complete reference for Java SE fundamentals and object-oriented design'),
(2,  'Python Official Documentation & Tutorial', 'https://docs.python.org/3/tutorial/', 'DOCUMENTATION', 'Official guide for Python syntax, standard libraries, and modules'),
(3,  'MDN Web Docs - JavaScript Guide', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', 'DOCUMENTATION', 'Comprehensive modern JavaScript reference and tutorials'),
(6,  'GeeksforGeeks - Data Structures Guide', 'https://www.geeksforgeeks.org/data-structures/', 'ARTICLE', 'Tutorials and problem walkthroughs for core data structures'),
(7,  'Abdul Bari - Algorithms Video Lectures', 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O', 'VIDEO', 'In-depth conceptual lectures on dynamic programming, greedy, and graph algorithms'),
(8,  'SQL Tutorial - Interactive Lessons', 'https://www.w3schools.com/sql/', 'ARTICLE', 'Interactive SQL guide for queries, joins, aggregates, and subqueries'),
(9,  'MySQL Reference Manual', 'https://dev.mysql.com/doc/', 'DOCUMENTATION', 'Official documentation for MySQL database administration and indexing'),
(13, 'React Documentation - Quick Start', 'https://react.dev/', 'DOCUMENTATION', 'Official modern React tutorial covering components, hooks, and state'),
(16, 'Spring Boot Reference Guide - Baeldung', 'https://www.baeldung.com/spring-boot', 'ARTICLE', 'Guides and tutorials for creating REST APIs with Spring Boot and Data JPA'),
(20, 'RESTful API Design Best Practices', 'https://www.restapitutorial.com/', 'ARTICLE', 'Standard guidelines for designing scalable REST APIs'),
(21, 'Ubuntu Linux Command Line Tutorial', 'https://ubuntu.com/tutorials/command-line-for-beginners', 'COURSE', 'Hands-on practice with Linux CLI commands, permissions, and shell'),
(24, 'Git Official Documentation & Pro Git Book', 'https://git-scm.com/doc', 'BOOK', 'Comprehensive guide to version control, branching, and rebasing in Git'),
(27, 'Docker Getting Started Guide', 'https://docs.docker.com/get-started/', 'DOCUMENTATION', 'Official guide to containers, images, and multi-container Docker Compose');

-- 6. USERS & ADMIN ACCOUNT
-- Admin@123 password hash
INSERT INTO users (id, username, email, password, role, active, created_at)
VALUES (1, 'admin', 'admin@skillgap.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lkiy', 'ADMIN', 1, NOW())
ON DUPLICATE KEY UPDATE password = VALUES(password), active = 1;

-- Demo Student: aarav@student.edu (Student@123)
INSERT INTO users (id, username, email, password, role, active, created_at)
VALUES (2, 'aarav_shah', 'aarav@student.edu', '$2a$10$7EqHMxYk8V8T3L2R5BPdCeJ7xOg9p8MKvXzHqT1YnWbKfL6sDcAXe', 'STUDENT', 1, NOW())
ON DUPLICATE KEY UPDATE password = VALUES(password), active = 1;

INSERT IGNORE INTO students (id, user_id, full_name, phone, college, department, academic_year, graduation_year, cgpa, preferred_job_role_id, created_at)
VALUES (1, 2, 'Aarav Shah', '9876543210', 'Engineering College', 'Computer Science', '3rd Year', 2026, 8.5, 1, NOW());
