import { PROFICIENCY_SCORE_MAP } from './constants';

export function formatProficiency(level) {
  if (!level || level === 'NONE' || level === 'MISSING') return 'Not Added';
  return level.charAt(0) + level.slice(1).toLowerCase();
}

export function getProficiencyScore(level) {
  return PROFICIENCY_SCORE_MAP[level] ?? 0;
}

export function formatScore(score) {
  if (score === null || score === undefined || Number.isNaN(Number(score))) return '0%';
  return `${Number(score).toFixed(1)}%`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function extractErrorMessage(error, fallback = 'An unexpected error occurred.') {
  if (!error) return fallback;
  const data = error.response?.data;
  if (data) {
    if (typeof data === 'string') return data;
    if (data.message) return data.message;
    if (data.errors && typeof data.errors === 'object') {
      return Object.values(data.errors).join(', ');
    }
  }
  return error.message || fallback;
}

export function getReadinessTier(score) {
  const num = Number(score || 0);
  if (num >= 75) return { label: 'Placement Ready', tone: 'success' };
  if (num >= 50) return { label: 'Moderate Readiness', tone: 'warning' };
  return { label: 'Needs Preparation', tone: 'danger' };
}
