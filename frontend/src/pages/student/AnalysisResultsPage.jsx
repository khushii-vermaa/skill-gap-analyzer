import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Map,
  Printer,
  Target,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import analysisService from '../../services/analysisService';
import roadmapService from '../../services/roadmapService';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { LoadingSpinner, AlertBanner } from '../../components/common/Feedback';
import {
  formatScore,
  formatDateTime,
  formatProficiency,
  getProficiencyScore,
  getReadinessTier,
  extractErrorMessage,
} from '../../utils/formatters';

const GAP_TONE = {
  MATCHED: 'success',
  NEEDS_IMPROVEMENT: 'warning',
  MISSING: 'danger',
};

export default function AnalysisResultsPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [res, det] = await Promise.all([
          analysisService.getResult(assessmentId),
          analysisService.getDetails(assessmentId),
        ]);
        setAssessment(res);
        setDetails(det || []);
      } catch (err) {
        setError(extractErrorMessage(err, 'Failed to load analysis results.'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [assessmentId]);

  const handleGenerateRoadmap = async () => {
    setGenerating(true);
    setError('');
    try {
      await roadmapService.generate(assessmentId);
      navigate('/student/roadmap');
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to generate learning roadmap.'));
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading analysis results..." />;
  if (error) return <AlertBanner type="error" message={error} />;
  if (!assessment) return null;

  const tier = getReadinessTier(assessment.readinessScore);

  const radarData = details.slice(0, 6).map((d) => ({
    skill: d.skillName,
    match: Number(d.matchPercentage || 0),
  }));

  const barData = details.slice(0, 8).map((d) => ({
    skill: d.skillName,
    YourLevel: getProficiencyScore(d.studentProficiency),
    Required: getProficiencyScore(d.requiredProficiency),
  }));

  const highPriorityGaps = details.filter(
    (d) => d.gapStatus !== 'MATCHED' && d.importanceWeight >= 4
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#263238] dark:text-[#E7ECEB]">
            Skill-Gap Analysis Results
          </h1>
          <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
            {assessment.jobRoleName} • Assessed on {formatDateTime(assessment.assessmentDate)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 no-print">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="w-4 h-4" />
            Print Report
          </Button>
          <Button onClick={handleGenerateRoadmap} loading={generating}>
            <Map className="w-4 h-4" />
            Generate Learning Roadmap
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Readiness Score"
          value={formatScore(assessment.readinessScore)}
          icon={Target}
          subtitle={tier.label}
        />
        <StatCard
          title="Matched Skills"
          value={`${assessment.matchedSkills} / ${assessment.totalRequiredSkills}`}
          icon={CheckCircle2}
        />
        <StatCard
          title="Needs Improvement"
          value={assessment.improvementSkillsCount}
          icon={AlertCircle}
        />
        <StatCard
          title="Missing Skills"
          value={assessment.missingSkillsCount}
          icon={XCircle}
        />
      </div>

      {highPriorityGaps.length > 0 && (
        <div className="card-surface p-4 border-l-4 border-l-rose-500">
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-2">
            High-Priority Skill Gaps (Weight ≥ 4)
          </p>
          <div className="flex flex-wrap gap-2">
            {highPriorityGaps.map((g) => (
              <Badge key={g.id} tone="danger">
                {g.skillName} ({g.gapStatus === 'MISSING' ? 'Missing' : formatProficiency(g.studentProficiency)} → {formatProficiency(g.requiredProficiency)})
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-surface p-5">
          <h2 className="text-sm font-semibold mb-4">Skill Match Radar (%)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Match %"
                  dataKey="match"
                  stroke="#426B72"
                  fill="#426B72"
                  fillOpacity={0.35}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface p-5">
          <h2 className="text-sm font-semibold mb-4">Your Level vs Required Level (1–4)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 8, right: 12, left: -16, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="skill" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="YourLevel" name="Your Level" fill="#426B72" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Required" name="Required" fill="#25364A" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card-surface overflow-x-auto">
        <div className="px-5 py-4 border-b border-[#E5E8E5] dark:border-[#354651]">
          <h2 className="text-sm font-semibold">Detailed Skill Comparison</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E8E5] dark:border-[#354651]">
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Skill</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Your Level</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Required</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Weight</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Match %</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {details.map((d) => (
              <tr key={d.id} className="border-t border-[#E5E8E5] dark:border-[#354651]">
                <td className="px-4 py-3 text-sm font-medium">{d.skillName}</td>
                <td className="px-4 py-3 text-sm">{formatProficiency(d.studentProficiency)}</td>
                <td className="px-4 py-3 text-sm">{formatProficiency(d.requiredProficiency)}</td>
                <td className="px-4 py-3 text-sm">{d.importanceWeight}/5</td>
                <td className="px-4 py-3 text-sm">{formatScore(d.matchPercentage)}</td>
                <td className="px-4 py-3 text-sm">
                  <Badge tone={GAP_TONE[d.gapStatus] || 'default'}>
                    {d.gapStatus.replace('_', ' ')}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
