import { useEffect, useState } from 'react';
import { Printer, Users, Target, ClipboardCheck, Briefcase } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import reportService from '../../services/reportService';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import { LoadingSpinner, AlertBanner } from '../../components/common/Feedback';
import { formatScore, extractErrorMessage } from '../../utils/formatters';

const PIE_COLORS = ['#dc2626', '#d97706', '#426B72', '#25364A'];

export default function ReportsPage() {
  const [summary, setSummary] = useState(null);
  const [rolesReport, setRolesReport] = useState([]);
  const [skillsReport, setSkillsReport] = useState([]);
  const [readinessDist, setReadinessDist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [sum, roles, skills, dist] = await Promise.all([
          reportService.getSummary(),
          reportService.getJobRolesReport(),
          reportService.getSkillsReport(),
          reportService.getReadinessDistribution(),
        ]);
        setSummary(sum);
        setRolesReport(roles || []);
        setSkillsReport(skills || []);
        setReadinessDist(dist || []);
      } catch (err) {
        setError(extractErrorMessage(err, 'Failed to load reports.'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Generating analytics reports..." />;
  if (error) return <AlertBanner type="error" message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Reports & Analytics</h1>
          <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
            Institution-wide placement readiness and skill-gap insights
          </p>
        </div>
        <Button variant="outline" className="no-print" onClick={() => window.print()}>
          <Printer className="w-4 h-4" /> Print Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={summary?.totalStudents ?? 0} icon={Users} />
        <StatCard title="Average Readiness" value={formatScore(summary?.avgScore)} icon={Target} />
        <StatCard title="Total Assessments" value={summary?.totalAssessments ?? 0} icon={ClipboardCheck} />
        <StatCard title="Most Popular Role" value={summary?.mostPopularRole || '—'} icon={Briefcase} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-surface p-5">
          <h2 className="text-sm font-semibold mb-4">Role-Wise Average Readiness (%)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rolesReport} margin={{ top: 8, right: 12, left: -12, bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="roleName" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />
                <Bar dataKey="avgScore" name="Avg Readiness (%)" fill="#426B72" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface p-5">
          <h2 className="text-sm font-semibold mb-4">Readiness Score Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={readinessDist}
                  dataKey="count"
                  nameKey="range"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {readinessDist.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card-surface p-5">
        <h2 className="text-sm font-semibold mb-4">Top Missing Skills Across Assessments</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillsReport} margin={{ top: 8, right: 12, left: -12, bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="skillName" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="missingCount" name="Missing Count" fill="#25364A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
