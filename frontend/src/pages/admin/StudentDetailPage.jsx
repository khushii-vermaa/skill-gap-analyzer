import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import studentService from '../../services/studentService';
import assessmentService from '../../services/assessmentService';
import Badge from '../../components/common/Badge';
import { LoadingSpinner, AlertBanner } from '../../components/common/Feedback';
import { formatDateTime, formatScore, getReadinessTier, extractErrorMessage } from '../../utils/formatters';

export default function StudentDetailPage() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [st, assess] = await Promise.all([
          studentService.getById(studentId),
          assessmentService.getByStudent(studentId),
        ]);
        setStudent(st);
        setAssessments(assess || []);
      } catch (err) {
        setError(extractErrorMessage(err, 'Failed to load student details.'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [studentId]);

  if (loading) return <LoadingSpinner label="Loading student details..." />;
  if (error) return <AlertBanner type="error" message={error} />;
  if (!student) return null;

  return (
    <div className="space-y-6">
      <Link
        to="/admin/students"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#426B72] dark:text-[#8DAEAA] hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Student Management
      </Link>

      <div className="card-surface p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold">{student.fullName}</h1>
            <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">{student.email}</p>
          </div>
          <Badge tone={student.active ? 'success' : 'danger'}>
            {student.active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-[#77818A]">College</p>
            <p className="font-medium mt-0.5">{student.college || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-[#77818A]">Department</p>
            <p className="font-medium mt-0.5">{student.department || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-[#77818A]">Academic / Grad Year</p>
            <p className="font-medium mt-0.5">
              {student.academicYear || '—'} ({student.graduationYear || '—'})
            </p>
          </div>
          <div>
            <p className="text-xs text-[#77818A]">CGPA / Target Role</p>
            <p className="font-medium mt-0.5">
              {student.cgpa ?? '—'} • {student.preferredJobRoleName || '—'}
            </p>
          </div>
        </div>
      </div>

      <div className="card-surface overflow-x-auto">
        <div className="px-5 py-4 border-b border-[#E5E8E5] dark:border-[#354651]">
          <h2 className="text-sm font-semibold">Assessment History ({assessments.length})</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E8E5] dark:border-[#354651]">
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Date</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Job Role</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Readiness</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Matched / Missing / Improve</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((a) => {
              const tier = getReadinessTier(a.readinessScore);
              return (
                <tr key={a.id} className="border-t border-[#E5E8E5] dark:border-[#354651]">
                  <td className="px-4 py-3 text-sm">{formatDateTime(a.assessmentDate)}</td>
                  <td className="px-4 py-3 text-sm font-medium">{a.jobRoleName}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge tone={tier.tone}>{formatScore(a.readinessScore)}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#77818A]">
                    {a.matchedSkills} / {a.missingSkillsCount} / {a.improvementSkillsCount}
                  </td>
                </tr>
              );
            })}
            {assessments.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-xs text-[#77818A]">
                  No assessments taken yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
