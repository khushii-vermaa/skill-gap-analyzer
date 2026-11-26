import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Layers,
  Briefcase,
  ClipboardCheck,
  TrendingUp,
  Award,
  AlertTriangle,
  ArrowRight,
  Terminal,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import dashboardService from '../../services/dashboardService';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { LoadingSpinner, AlertBanner } from '../../components/common/Feedback';
import { formatDateTime, formatScore, extractErrorMessage } from '../../utils/formatters';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await dashboardService.getAdminDashboard();
        setData(res);
      } catch (err) {
        setError(extractErrorMessage(err, 'Failed to query admin telemetry.'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Compiling system diagnostics..." />;
  if (error) return <AlertBanner type="error" message={error} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Metrics Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Enrolled Candidates" value={data.totalStudents ?? 0} icon={Users} subtitle="Verified placement profiles" />
        <StatCard title="Skill Taxonomy" value={data.totalSkills ?? 0} icon={Layers} subtitle="Across 13 tech domains" />
        <StatCard title="Configured Roles" value={data.totalJobRoles ?? 0} icon={Briefcase} subtitle="Industry benchmarks" />
        <StatCard title="Evaluations Executed" value={data.totalAssessments ?? 0} icon={ClipboardCheck} subtitle="Algorithmic assessments" />
      </div>

      {/* Metrics Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Campus Average Readiness"
          value={formatScore(data.avgReadiness)}
          icon={TrendingUp}
          subtitle="Mean weighted match score"
        />
        <StatCard
          title="Placement Ready (>= 75%)"
          value={data.highReadinessStudents ?? 0}
          icon={Award}
          subtitle="High competency tier"
        />
        <StatCard
          title="Needs Upskilling (< 50%)"
          value={data.needsImprovementStudents ?? 0}
          icon={AlertTriangle}
          subtitle="Priority training target"
        />
      </div>

      {/* Charts & Quick Matrix Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-surface p-6 border-slate-700/80">
          <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Role-Wise Mean Placement Readiness
            </h2>
            <Link to="/admin/reports" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group">
              Full Analytics <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {data.roleWiseReadiness?.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.roleWiseReadiness} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="roleName" stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} angle={-15} textAnchor="end" interval={0} />
                  <YAxis domain={[0, 100]} stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontFamily: 'monospace',
                    }}
                    formatter={(v) => [`${Number(v).toFixed(1)}%`, 'Mean Readiness']}
                  />
                  <Bar dataKey="avgScore" fill="#22D3EE" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs font-mono text-slate-500 py-12 text-center">
              &gt; No evaluation records currently available.
            </p>
          )}
        </div>

        {/* Quick Operations Console */}
        <div className="card-surface p-6 border-slate-700/80 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              Console Operations
            </h2>
            <p className="text-xs font-mono text-slate-400 mb-4 leading-relaxed">
              Maintain domain models, tune skill weights (1-5), and inspect student placement profiles.
            </p>
            <div className="space-y-2">
              <Link to="/admin/students" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Users className="w-4 h-4 text-cyan-400" />
                  STUDENT DIRECTORY
                </Button>
              </Link>
              <Link to="/admin/skills" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Layers className="w-4 h-4 text-purple-400" />
                  TAXONOMY &amp; WEIGHTS
                </Button>
              </Link>
              <Link to="/admin/job-roles" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  JOB ROLES CATALOG
                </Button>
              </Link>
              <Link to="/admin/reports" className="block">
                <Button variant="secondary" size="sm" className="w-full justify-start text-xs">
                  <Activity className="w-4 h-4 text-white" />
                  VIVA ANALYTICS REPORT
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ENGINE IN SYNC WITH MYSQL 8.0
            </span>
          </div>
        </div>
      </div>

      {/* Recent Assessment Activity Feed */}
      <div className="card-surface overflow-hidden border-slate-700/80">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-cyan-400" />
            Recent Assessment Execution Stream
          </h2>
          <Link to="/admin/assessments" className="text-xs font-mono text-cyan-400 hover:underline">
            View full log &rarr;
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950/70 uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Candidate</th>
                <th className="px-5 py-3">Target Profile</th>
                <th className="px-5 py-3">Readiness Score</th>
                <th className="px-5 py-3">Evaluation Details</th>
                <th className="px-5 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {(data.recentAssessments || []).map((a) => (
                <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3 font-semibold text-slate-200">{a.studentName}</td>
                  <td className="px-5 py-3 text-cyan-300">{a.jobRoleName}</td>
                  <td className="px-5 py-3">
                    <Badge tone={a.readinessScore >= 75 ? 'success' : a.readinessScore >= 50 ? 'warning' : 'danger'}>
                      {formatScore(a.readinessScore)}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    ID #{a.id} &bull; Recorded in DB
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {formatDateTime(a.assessmentDate)}
                  </td>
                </tr>
              ))}
              {(!data.recentAssessments || data.recentAssessments.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500 font-mono">
                    &gt; No assessment records detected in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
