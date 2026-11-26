import { useEffect, useState, useMemo } from 'react';
import assessmentService from '../../services/assessmentService';
import Badge from '../../components/common/Badge';
import { LoadingSpinner, AlertBanner } from '../../components/common/Feedback';
import { formatDateTime, formatScore, getReadinessTier, extractErrorMessage } from '../../utils/formatters';

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await assessmentService.getAll();
        setAssessments(data || []);
      } catch (err) {
        setError(extractErrorMessage(err, 'Failed to load assessments.'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const roles = useMemo(() => {
    return [...new Set(assessments.map((a) => a.jobRoleName).filter(Boolean))];
  }, [assessments]);

  const filtered = useMemo(() => {
    return assessments.filter((a) => !roleFilter || a.jobRoleName === roleFilter);
  }, [assessments, roleFilter]);

  if (loading) return <LoadingSpinner label="Loading assessments..." />;
  if (error) return <AlertBanner type="error" message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">All Student Assessments</h1>
          <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
            Monitor placement readiness evaluations across all students and roles
          </p>
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
        >
          <option value="">All Job Roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E8E5] dark:border-[#354651]">
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Student</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Job Role</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Readiness</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Matched / Missing / Improve</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const tier = getReadinessTier(a.readinessScore);
              return (
                <tr key={a.id} className="border-t border-[#E5E8E5] dark:border-[#354651]">
                  <td className="px-4 py-3 text-sm font-medium">{a.studentName}</td>
                  <td className="px-4 py-3 text-sm">{a.jobRoleName}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge tone={tier.tone}>{formatScore(a.readinessScore)}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#77818A]">
                    {a.matchedSkills} / {a.missingSkillsCount} / {a.improvementSkillsCount}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#77818A]">{formatDateTime(a.assessmentDate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
