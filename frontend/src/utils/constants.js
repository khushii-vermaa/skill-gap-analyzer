export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const ROLES = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
};

export const PROFICIENCY_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner', score: 1 },
  { value: 'INTERMEDIATE', label: 'Intermediate', score: 2 },
  { value: 'ADVANCED', label: 'Advanced', score: 3 },
  { value: 'EXPERT', label: 'Expert', score: 4 },
];

export const PROFICIENCY_SCORE_MAP = {
  NONE: 0,
  MISSING: 0,
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
};

export const GAP_STATUS = {
  MATCHED: 'MATCHED',
  NEEDS_IMPROVEMENT: 'NEEDS_IMPROVEMENT',
  MISSING: 'MISSING',
};

export const PRIORITY_LEVELS = ['HIGH', 'MEDIUM', 'LOW'];

export const TASK_STATUSES = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

export const RESOURCE_TYPES = [
  'DOCUMENTATION',
  'COURSE',
  'VIDEO',
  'ARTICLE',
  'PRACTICE',
  'BOOK',
];

export const ACADEMIC_YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Final Year',
];
