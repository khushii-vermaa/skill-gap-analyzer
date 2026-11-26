import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, UserCheck, UserX } from 'lucide-react';
import studentService from '../../services/studentService';
import Badge from '../../components/common/Badge';
import { LoadingSpinner, AlertBanner } from '../../components/common/Feedback';
import { extractErrorMessage } from '../../utils/formatters';

export default function StudentManagementPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    try {
      const data = await studentService.getAll();
      setStudents(data || []);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load students.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const departments = useMemo(() => {
    return [...new Set(students.map((s) => s.department).filter(Boolean))];
  }, [students]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        (s.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.email || '').toLowerCase().includes(search.toLowerCase());
      const matchDept = !deptFilter || s.department === deptFilter;
      return matchSearch && matchDept;
    });
  }, [students, search, deptFilter]);

  const toggleStatus = async (student) => {
    setError('');
    setSuccess('');
    try {
      await studentService.updateStatus(student.id, !student.active);
      setSuccess(`Student account ${!student.active ? 'activated' : 'deactivated'}.`);
      await load();
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to update student status.'));
    }
  };

  if (loading) return <LoadingSpinner label="Loading students..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-[#263238] dark:text-[#E7ECEB]">
          Student Management
        </h1>
        <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
          View registered students, inspect profiles, and manage account status
        </p>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="card-surface p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#77818A] absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E8E5] dark:border-[#354651]">
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Name</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Email</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Department</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Grad Year</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Target Role</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Status</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t border-[#E5E8E5] dark:border-[#354651] hover:bg-[#F5F6F4]/50 dark:hover:bg-[#1D2C37]">
                <td className="px-4 py-3 text-sm font-medium">{s.fullName}</td>
                <td className="px-4 py-3 text-sm text-[#77818A] dark:text-[#A2AFB5]">{s.email}</td>
                <td className="px-4 py-3 text-sm">{s.department || '—'}</td>
                <td className="px-4 py-3 text-sm">{s.graduationYear || '—'}</td>
                <td className="px-4 py-3 text-sm">{s.preferredJobRoleName || '—'}</td>
                <td className="px-4 py-3 text-sm">
                  <Badge tone={s.active ? 'success' : 'danger'}>
                    {s.active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-right space-x-2">
                  <Link
                    to={`/admin/students/${s.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#426B72] dark:text-[#8DAEAA] hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </Link>
                  <button
                    onClick={() => toggleStatus(s)}
                    className={`inline-flex items-center gap-1 text-xs font-medium cursor-pointer ${
                      s.active ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {s.active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                    {s.active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-[#77818A]">
                  No students match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
