import { useEffect, useState } from 'react';
import { UserCircle, Save, ExternalLink } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import studentService from '../../services/studentService';
import jobRoleService from '../../services/jobRoleService';
import Button from '../../components/common/Button';
import { LoadingSpinner, AlertBanner } from '../../components/common/Feedback';
import { ACADEMIC_YEARS } from '../../utils/constants';
import { extractErrorMessage } from '../../utils/formatters';

export default function ProfilePage() {
  const { user, updateUserSession } = useAuth();
  const [jobRoles, setJobRoles] = useState([]);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    academicYear: '',
    graduationYear: '',
    cgpa: '',
    resumeUrl: '',
    preferredJobRoleId: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [student, roles] = await Promise.all([
          studentService.getById(user.studentId),
          jobRoleService.getAll(),
        ]);
        setJobRoles(roles || []);
        setForm({
          fullName: student.fullName || '',
          email: student.email || '',
          phone: student.phone || '',
          college: student.college || '',
          department: student.department || '',
          academicYear: student.academicYear || '',
          graduationYear: student.graduationYear ?? '',
          cgpa: student.cgpa ?? '',
          resumeUrl: student.resumeUrl || '',
          preferredJobRoleId: student.preferredJobRoleId ?? '',
        });
      } catch (err) {
        setError(extractErrorMessage(err, 'Failed to load profile.'));
      } finally {
        setLoading(false);
      }
    };
    if (user?.studentId) load();
    else setLoading(false);
  }, [user?.studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        college: form.college.trim(),
        department: form.department.trim(),
        academicYear: form.academicYear,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : null,
        cgpa: form.cgpa ? Number(form.cgpa) : null,
        resumeUrl: form.resumeUrl.trim(),
        preferredJobRoleId: form.preferredJobRoleId ? Number(form.preferredJobRoleId) : null,
      };
      const updated = await studentService.update(user.studentId, payload);
      updateUserSession({ fullName: updated.fullName });
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to update profile.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading profile..." />;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[#263238] dark:text-[#E7ECEB]">
            My Profile
          </h1>
          <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
            Keep your academic details and target job role up to date
          </p>
        </div>
        {form.resumeUrl && (
          <a
            href={form.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#426B72] dark:text-[#8DAEAA] hover:underline"
          >
            View Resume <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />}

      <form onSubmit={handleSubmit} className="card-surface p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E5E8E5] dark:border-[#354651]">
          <div className="w-11 h-11 rounded-full bg-[#25364A] dark:bg-[#8DAEAA] text-white dark:text-[#17232D] flex items-center justify-center">
            <UserCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold">{form.fullName || user?.fullName}</p>
            <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">{form.email || user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Email</label>
            <input
              value={form.email}
              disabled
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-[#F5F6F4] dark:bg-[#1D2C37] text-[#77818A]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">College / University</label>
            <input
              name="college"
              value={form.college}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Branch / Department</label>
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="Computer Science"
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Academic Year</label>
            <select
              name="academicYear"
              value={form.academicYear}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            >
              <option value="">Select year</option>
              {ACADEMIC_YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Graduation Year</label>
            <input
              type="number"
              name="graduationYear"
              value={form.graduationYear}
              onChange={handleChange}
              min="2020"
              max="2035"
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">CGPA (Optional)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              name="cgpa"
              value={form.cgpa}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Preferred Job Role</label>
            <select
              name="preferredJobRoleId"
              value={form.preferredJobRoleId}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            >
              <option value="">Select target job role</option>
              {jobRoles.map((r) => (
                <option key={r.id} value={r.id}>{r.roleName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Resume URL (Optional)</label>
            <input
              type="url"
              name="resumeUrl"
              value={form.resumeUrl}
              onChange={handleChange}
              placeholder="https://drive.google.com/..."
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" loading={saving}>
            <Save className="w-4 h-4" />
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
