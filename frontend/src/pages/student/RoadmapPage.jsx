import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Map, CheckCircle2, Clock, ExternalLink, Target } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import roadmapService from '../../services/roadmapService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { LoadingSpinner, AlertBanner, EmptyState } from '../../components/common/Feedback';
import { formatDate, formatScore, extractErrorMessage } from '../../utils/formatters';

const PRIORITY_TONE = {
  HIGH: 'danger',
  MEDIUM: 'warning',
  LOW: 'info',
};

const STATUS_TONE = {
  COMPLETED: 'success',
  IN_PROGRESS: 'info',
  PENDING: 'default',
};

export default function RoadmapPage() {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadRoadmap = async () => {
    try {
      const roadmaps = await roadmapService.getByStudent(user.studentId);
      if (roadmaps && roadmaps.length > 0) {
        const latest = roadmaps[0];
        setRoadmap(latest);
        const taskList = await roadmapService.getTasks(latest.id);
        setTasks(taskList || []);
      } else {
        setRoadmap(null);
        setTasks([]);
      }
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load learning roadmap.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.studentId) loadRoadmap();
    else setLoading(false);
  }, [user?.studentId]);

  const handleToggleStatus = async (task) => {
    const nextStatus = task.taskStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    setUpdatingId(task.id);
    setError('');
    setSuccess('');
    try {
      await roadmapService.updateTask(task.id, { taskStatus: nextStatus });
      setSuccess(nextStatus === 'COMPLETED' ? 'Task marked as completed!' : 'Task reopened.');
      await loadRoadmap();
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to update task status.'));
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <LoadingSpinner label="Loading your learning roadmap..." />;

  if (!roadmap) {
    return (
      <EmptyState
        icon={Map}
        title="No learning roadmap generated yet"
        description="Run a skill-gap analysis for your target job role, then generate a personalized roadmap."
        action={
          <Link to="/student/analysis">
            <Button>
              <Target className="w-4 h-4" />
              Go to Skill-Gap Analysis
            </Button>
          </Link>
        }
      />
    );
  }

  const priorities = ['HIGH', 'MEDIUM', 'LOW'];

  return (
    <div className="space-y-6">
      <div className="card-surface p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-[#263238] dark:text-[#E7ECEB]">
              {roadmap.roadmapTitle}
            </h1>
            <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
              Created on {formatDate(roadmap.createdAt)} • {roadmap.completedTasks} of {roadmap.totalTasks} tasks completed
            </p>
          </div>
          <div className="text-right">
            <span className="text-xl font-semibold text-[#426B72] dark:text-[#8DAEAA]">
              {formatScore(roadmap.completionPercentage)}
            </span>
            <p className="text-[11px] text-[#77818A] dark:text-[#A2AFB5]">Overall Completion</p>
          </div>
        </div>
        <div className="mt-4 w-full h-2.5 rounded-full bg-[#E5E8E5] dark:bg-[#17232D] overflow-hidden">
          <div
            className="h-full bg-[#426B72] dark:bg-[#8DAEAA] transition-all duration-300"
            style={{ width: `${Math.min(100, Number(roadmap.completionPercentage || 0))}%` }}
          />
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />}

      {priorities.map((prio) => {
        const group = tasks.filter((t) => t.priority === prio);
        if (group.length === 0) return null;
        return (
          <div key={prio} className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge tone={PRIORITY_TONE[prio]}>{prio} PRIORITY</Badge>
              <span className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
                ({group.length} {group.length === 1 ? 'task' : 'tasks'})
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.map((task) => {
                const isDone = task.taskStatus === 'COMPLETED';
                return (
                  <div key={task.id} className="card-surface p-4 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-sm font-semibold ${isDone ? 'line-through text-[#77818A]' : ''}`}>
                          {task.taskTitle}
                        </h3>
                        <Badge tone={STATUS_TONE[task.taskStatus] || 'default'}>
                          {task.taskStatus.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-[#77818A] dark:text-[#A2AFB5]">
                        {task.taskDescription}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#77818A] dark:text-[#A2AFB5]">
                        <span className="font-medium text-[#263238] dark:text-[#E7ECEB]">{task.skillName}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {task.estimatedHours} hrs
                        </span>
                        <span>Target: {formatDate(task.targetDate)}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E5E8E5] dark:border-[#354651] flex items-center justify-between gap-2">
                      {task.resourceUrl ? (
                        <a
                          href={task.resourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#426B72] dark:text-[#8DAEAA] hover:underline"
                        >
                          {task.resourceTitle || 'Learning Resource'}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-[#77818A]">Self-study</span>
                      )}

                      <Button
                        size="sm"
                        variant={isDone ? 'outline' : 'primary'}
                        loading={updatingId === task.id}
                        onClick={() => handleToggleStatus(task)}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isDone ? 'Completed' : 'Mark Complete'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
