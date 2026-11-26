import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, ArrowUpRight, Target } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import assessmentService from '../../services/assessmentService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { LoadingSpinner, AlertBanner, EmptyState } from '../../components/common/Feedback';
import { formatDateTime, formatDate, formatScore, getReadinessTier, extractErrorMessage } from '../../utils/formatters';

export default function AssessmentHistoryPage() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await assessmentService.getByStudent(user.studentId);
        setAssessments(res || []);
      } catch (err) {
        setError(extractErrorMessage(err, 'Failed to load assessment history.'));
      } finally {
        setLoading(false);
      }
    };
    if (user?.studentId) load();
    else setLoading(false);
  }, [user?.studentId]);

  if (loading) return <LoadingSpinner label="Loading assessment history..." />;
  if (error) return <AlertBanner type="error" message={error} />;

  if (assessments.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="No assessments recorded yet"
        description="Run your first skill-gap analysis to start tracking your placement readiness over time."
        action={
          <Link to="/student/analysis">
            <Button>
              <Target className="w-4 h-4" />
              Run First Analysis
            </Button>
          </Link>
        }
      />
    );
  }

  const chartData = [...assessments]
    .reverse()
    .map((a) => ({
      date: formatDate(a.assessmentDate),
      score: Number(a.readinessScore || 0),
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[#263238] dark:text-[#E7ECEB]">
            Assessment History
          </h1>
          <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
            Compare your previous and current placement readiness scores
          </p>
        </div>
        <Link to="/student/analysis">
          <Button>Reassess Readiness</Button>
        </Link>
      </div>

      <div className="card-surface p-5">
        <h2 className="text-sm font-semibold mb-4">Readiness Score Progression</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 16, left: -12, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />
              <Line
                type="monotone"
                dataKey="score"
                name="Readiness (%)"
                stroke="#426B72"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E8E5] dark:border-[#354651]">
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Date</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Job Role</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Readiness</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Matched / Missing / Improve</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((a) => {
              const tier = getReadinessTier(a.readinessScore);
              return (
                <tr key={a.id} className="border-t border-[#E5E8E5] dark:border-[#354651] hover:bg-[#F5F6F4]/50 dark:hover:bg-[#1D2C37]">
                  <td className="px-4 py-3 text-sm">{formatDateTime(a.assessmentDate)}</td>
                  <td className="px-4 py-3 text-sm font-medium">{a.jobRoleName}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge tone={tier.tone}>{formatScore(a.readinessScore)}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#77818A] dark:text-[#A2AFB5]">
                    {a.matchedSkills} matched • {a.missingSkillsCount} missing • {a.improvementSkillsCount} improve
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <Link
                      to={`/student/results/${a.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#426B72] dark:text-[#8DAEAA] hover:underline"
                    >
                      View <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
