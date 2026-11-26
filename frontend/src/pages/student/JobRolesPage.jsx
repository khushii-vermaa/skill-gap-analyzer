import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, CheckCircle2, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import jobRoleService from '../../services/jobRoleService';
import studentService from '../../services/studentService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { LoadingSpinner, AlertBanner } from '../../components/common/Feedback';
import { formatProficiency, extractErrorMessage } from '../../utils/formatters';

export default function JobRolesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [roles, setRoles] = useState([]);
  const [preferredRoleId, setPreferredRoleId] = useState(null);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [selectedRole, setSelectedRole] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [allRoles, student] = await Promise.all([
          jobRoleService.getAll(),
          user?.studentId ? studentService.getById(user.studentId) : Promise.resolve(null),
        ]);
        setRoles(allRoles || []);
        setPreferredRoleId(student?.preferredJobRoleId || null);
      } catch (err) {
        setError(extractErrorMessage(err, 'Failed to load job roles.'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.studentId]);

  const openRoleDetails = async (role) => {
    setSelectedRole(role);
    setReqLoading(true);
    try {
      const reqs = await jobRoleService.getRequirements(role.id);
      setRequirements(reqs || []);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load role requirements.'));
    } finally {
      setReqLoading(false);
    }
  };

  const handleSelectTargetRole = async (roleId) => {
    if (!user?.studentId) return;
    setSelecting(true);
    setError('');
    setSuccess('');
    try {
      const student = await studentService.getById(user.studentId);
      await studentService.update(user.studentId, {
        fullName: student.fullName,
        phone: student.phone,
        college: student.college,
        department: student.department,
        academicYear: student.academicYear,
        graduationYear: student.graduationYear,
        cgpa: student.cgpa,
        resumeUrl: student.resumeUrl,
        preferredJobRoleId: roleId,
      });
      setPreferredRoleId(roleId);
      setSuccess('Target job role updated!');
      setSelectedRole(null);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to update target role.'));
    } finally {
      setSelecting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading job roles..." />;

  const filtered = roles.filter(
    (r) =>
      r.roleName.toLowerCase().includes(search.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#263238] dark:text-[#E7ECEB]">Explore Job Roles</h1>
          <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
            Inspect industry skill requirements and select your target placement role
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#77818A] absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search job roles..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
          />
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((role) => {
          const isTarget = preferredRoleId === role.id;
          return (
            <div
              key={role.id}
              onClick={() => openRoleDetails(role)}
              className={`card-surface p-5 cursor-pointer transition-colors hover:border-[#426B72] dark:hover:border-[#8DAEAA] flex flex-col justify-between ${
                isTarget ? 'ring-2 ring-[#426B72] dark:ring-[#8DAEAA]' : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="p-2 rounded-md bg-[#D7E2DF]/60 dark:bg-[#2D424F] text-[#25364A] dark:text-[#8DAEAA]">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  {isTarget && (
                    <Badge tone="success">
                      <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Target Role
                    </Badge>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-[#263238] dark:text-[#E7ECEB]">
                  {role.roleName}
                </h3>
                <p className="mt-1.5 text-xs text-[#77818A] dark:text-[#A2AFB5] line-clamp-3">
                  {role.description || 'Explore required technical and soft skills for this role.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E5E8E5] dark:border-[#354651] flex items-center justify-between text-xs">
                <span className="text-[#77818A] dark:text-[#A2AFB5]">
                  {role.requiredSkillCount ?? 0} Required Skills
                </span>
                <span className="font-medium text-[#426B72] dark:text-[#8DAEAA]">
                  View Details →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={Boolean(selectedRole)}
        onClose={() => setSelectedRole(null)}
        title={selectedRole?.roleName || 'Job Role Details'}
      >
        <div className="space-y-4">
          <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
            {selectedRole?.description}
          </p>

          {reqLoading ? (
            <LoadingSpinner label="Loading requirements..." />
          ) : (
            <div className="max-h-72 overflow-y-auto border border-[#E5E8E5] dark:border-[#354651] rounded-md">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E8E5] dark:border-[#354651] bg-[#F5F6F4] dark:bg-[#1D2C37]">
                    <th className="text-xs font-medium px-3 py-2">Skill</th>
                    <th className="text-xs font-medium px-3 py-2">Required</th>
                    <th className="text-xs font-medium px-3 py-2">Weight</th>
                    <th className="text-xs font-medium px-3 py-2">Mandatory</th>
                  </tr>
                </thead>
                <tbody>
                  {requirements.map((req) => (
                    <tr key={req.id} className="border-t border-[#E5E8E5] dark:border-[#354651] text-xs">
                      <td className="px-3 py-2 font-medium">{req.skillName}</td>
                      <td className="px-3 py-2">
                        <Badge tone="info">{formatProficiency(req.requiredProficiency)}</Badge>
                      </td>
                      <td className="px-3 py-2">{req.importanceWeight}/5</td>
                      <td className="px-3 py-2">
                        {req.isMandatory ? <Badge tone="danger">Mandatory</Badge> : 'Optional'}
                      </td>
                    </tr>
                  ))}
                  {requirements.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-center text-xs text-[#77818A]">
                        No skill requirements configured yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setSelectedRole(null)}>Close</Button>
            {selectedRole && (
              <Button
                loading={selecting}
                onClick={() => handleSelectTargetRole(selectedRole.id)}
              >
                Select This Role
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
