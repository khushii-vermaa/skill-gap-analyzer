import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Briefcase,
  Code2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Map,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import dashboardService from '../../services/dashboardService';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { LoadingSpinner, AlertBanner } from '../../components/common/Feedback';
import { formatDate, formatScore, extractErrorMessage } from '../../utils/formatters';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.studentId) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const res = await dashboardService.getStudentDashboard(user.studentId);
        setData(res);
      } catch (err) {
        setError(extractErrorMessage(err, 'Failed to load dashboard.'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.studentId]);

  if (loading) return <LoadingSpinner label="Loading your dashboard..." />;
  if (error) return <AlertBanner type="error" message={error} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Target Role Banner */}
      <div className="card-surface p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-slate-700/80 bg-gradient-to-r from-slate-900/90 via-[#1E293B] to-slate-900/90">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              Target Job Role
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
              Selected
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-cyan-400" />
            {data.preferredJobRoleName || 'No Target Role Selected Yet'}
          </h2>
          {data.previousReadinessScore !== null && data.previousReadinessScore !== undefined && (
            <p className="text-xs text-slate-400">
              Previous Readiness Score: <span className="text-slate-200 font-bold">{formatScore(data.previousReadinessScore)}</span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/student/skills">
            <Button variant="outline" size="sm">
              <Code2 className="w-4 h-4" />
              Manage Skills
            </Button>
          </Link>
          <Link to="/student/analysis">
            <Button variant="primary" size="sm">
              <Target className="w-4 h-4" />
              Analyze Skills
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Placement Readiness"
          value={formatScore(data.currentReadinessScore)}
          icon={Target}
          trend={data.scoreImprovement}
        />
        <StatCard title="Total Skills Added" value={data.totalSkillsAdded ?? 0} icon={Code2} />
        <StatCard title="Matched Skills" value={data.matchedSkills ?? 0} icon={CheckCircle2} />
        <StatCard
          title="Roadmap Completed"
          value={formatScore(data.roadmapCompletionPercentage)}
          icon={Map}
        />
      </div>

      {/* Secondary Gaps Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Needs Improvement"
          value={data.improvementSkills ?? 0}
          icon={AlertCircle}
          subtitle="Skills below required proficiency"
        />
        <StatCard
          title="Missing Skills"
          value={data.missingSkills ?? 0}
          icon={XCircle}
          subtitle="Required for role, not in profile"
        />
      </div>

      {/* Chart & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-surface p-6 border-slate-700/80">
          <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Readiness Score Progress
            </h2>
            <Link
              to="/student/history"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
            >
              View History <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {data.readinessTrend?.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.readinessTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cyberGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="label" stroke="#64748B" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} stroke="#64748B" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                    }}
                    formatter={(v) => [`${Number(v).toFixed(1)}%`, 'Readiness']}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#22D3EE"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#cyberGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-12 text-center">
              No assessment history yet. Click 'Analyze Skills' to take your first assessment.
            </p>
          )}
        </div>

        {/* Priority Learning Tasks */}
        <div className="card-surface p-6 border-slate-700/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Upcoming Learning Tasks
              </h2>
              <Link to="/student/roadmap" className="text-xs text-cyan-400 hover:underline">
                Roadmap &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {(data.upcomingTasks || []).slice(0, 4).map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 truncate pr-2">{t.taskTitle}</span>
                    <Badge tone={t.priority}>{t.priority}</Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-cyan-400">{t.skillName}</span>
                    <span>Due: {formatDate(t.targetDate)}</span>
                  </div>
                </div>
              ))}
              {(!data.upcomingTasks || data.upcomingTasks.length === 0) && (
                <p className="text-xs text-slate-500 py-6 text-center">
                  All tasks completed! Generate a new roadmap to view your next steps.
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800">
            <Link to="/student/roadmap" className="block">
              <Button variant="secondary" size="sm" className="w-full">
                <Map className="w-4 h-4" />
                View Full Learning Roadmap
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
