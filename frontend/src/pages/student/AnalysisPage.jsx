import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Target, Code2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import jobRoleService from '../../services/jobRoleService';
import studentSkillService from '../../services/studentSkillService';
import studentService from '../../services/studentService';
import analysisService from '../../services/analysisService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { LoadingSpinner, AlertBanner, EmptyState } from '../../components/common/Feedback';
import { formatProficiency, extractErrorMessage } from '../../utils/formatters';

export default function AnalysisPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [allRoles, mySkills, student] = await Promise.all([
          jobRoleService.getAll(),
          studentSkillService.getByStudent(user.studentId),
          studentService.getById(user.studentId),
        ]);
        setRoles(allRoles || []);
        setSkills(mySkills || []);
        if (student?.preferredJobRoleId) {
          setSelectedRoleId(String(student.preferredJobRoleId));
        } else if (allRoles?.length) {
          setSelectedRoleId(String(allRoles[0].id));
        }
      } catch (err) {
        setError(extractErrorMessage(err, 'Failed to load analysis setup.'));
      } finally {
        setLoading(false);
      }
    };
    if (user?.studentId) load();
    else setLoading(false);
  }, [user?.studentId]);

  const handleAnalyze = async () => {
    if (!selectedRoleId) {
      setError('Please select a target job role.');
      return;
    }
    setError('');
    setAnalyzing(true);
    try {
      const result = await analysisService.runAnalysis(user.studentId, Number(selectedRoleId));
      navigate(`/student/results/${result.id}`);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to run skill-gap analysis.'));
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <LoadingSpinner label="Preparing skill-gap analyzer..." />;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-lg font-semibold text-[#263238] dark:text-[#E7ECEB]">
          Skill-Gap Analysis
        </h1>
        <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
          Compare your current skill set against industry requirements for a target job role
        </p>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

      {skills.length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No skills added yet"
          description="Add your technical and soft skills first so we can accurately calculate your placement readiness."
          action={
            <Link to="/student/skills">
              <Button>Go to My Skills</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-5">
          <div className="card-surface p-5 space-y-4">
            <h2 className="text-sm font-semibold">Step 1: Select Target Job Role</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="flex-1 px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
              >
                <option value="">Choose a job role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.roleName} ({r.requiredSkillCount} skills)
                  </option>
                ))}
              </select>
              <Button onClick={handleAnalyze} loading={analyzing}>
                <Target className="w-4 h-4" />
                Run Skill-Gap Analysis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="card-surface p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Step 2: Your Current Skills ({skills.length})</h2>
              <Link to="/student/skills" className="text-xs text-[#426B72] dark:text-[#8DAEAA] hover:underline">
                Edit Skills
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <div
                  key={s.id}
                  className="px-3 py-1.5 rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-[#F5F6F4]/70 dark:bg-[#17232D] flex items-center gap-2 text-xs"
                >
                  <span className="font-medium">{s.skillName}</span>
                  <Badge tone="info">{formatProficiency(s.proficiencyLevel)}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
