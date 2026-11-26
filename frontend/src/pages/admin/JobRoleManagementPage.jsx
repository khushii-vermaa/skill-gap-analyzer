import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ListChecks } from 'lucide-react';
import jobRoleService from '../../services/jobRoleService';
import skillService from '../../services/skillService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { LoadingSpinner, AlertBanner } from '../../components/common/Feedback';
import { PROFICIENCY_LEVELS } from '../../utils/constants';
import { formatProficiency, extractErrorMessage } from '../../utils/formatters';

export default function JobRoleManagementPage() {
  const [roles, setRoles] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [roleModal, setRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleForm, setRoleForm] = useState({ roleName: '', description: '' });

  const [reqModalRole, setReqModalRole] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [reqForm, setReqForm] = useState({
    skillId: '',
    requiredProficiency: 'INTERMEDIATE',
    importanceWeight: 3,
    isMandatory: true,
  });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [r, s] = await Promise.all([jobRoleService.getAll(), skillService.getAll()]);
      setRoles(r || []);
      setAllSkills(s || []);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load job roles.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openRequirements = async (role) => {
    setReqModalRole(role);
    try {
      const reqs = await jobRoleService.getRequirements(role.id);
      setRequirements(reqs || []);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load role skills.'));
    }
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        roleName: roleForm.roleName.trim(),
        description: roleForm.description.trim(),
      };
      if (editingRole) {
        await jobRoleService.update(editingRole.id, payload);
        setSuccess('Job role updated.');
      } else {
        await jobRoleService.create(payload);
        setSuccess('Job role created.');
      }
      setRoleModal(false);
      await load();
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to save job role.'));
    } finally {
      setSaving(false);
    }
  };

  const handleAddRequirement = async (e) => {
    e.preventDefault();
    if (!reqModalRole) return;
    setSaving(true);
    setError('');
    try {
      await jobRoleService.addRequirement(reqModalRole.id, {
        skillId: Number(reqForm.skillId),
        requiredProficiency: reqForm.requiredProficiency,
        importanceWeight: Number(reqForm.importanceWeight),
        isMandatory: reqForm.isMandatory,
      });
      setReqForm({
        skillId: '',
        requiredProficiency: 'INTERMEDIATE',
        importanceWeight: 3,
        isMandatory: true,
      });
      await openRequirements(reqModalRole);
      await load();
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to add required skill.'));
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveRequirement = async (reqId) => {
    try {
      await jobRoleService.removeRequirement(reqId);
      await openRequirements(reqModalRole);
      await load();
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to remove requirement.'));
    }
  };

  const handleDeleteRole = async () => {
    if (!deleteTarget) return;
    try {
      await jobRoleService.remove(deleteTarget.id);
      setSuccess('Job role deleted.');
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to delete job role.'));
    }
  };

  if (loading) return <LoadingSpinner label="Loading job roles..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Job Role Management</h1>
          <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
            Define industry job roles and their required skill proficiencies and weights
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingRole(null);
            setRoleForm({ roleName: '', description: '' });
            setRoleModal(true);
          }}
        >
          <Plus className="w-4 h-4" /> Add Job Role
        </Button>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E8E5] dark:border-[#354651]">
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Role Name</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Description</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Required Skills</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id} className="border-t border-[#E5E8E5] dark:border-[#354651]">
                <td className="px-4 py-3 text-sm font-medium">{r.roleName}</td>
                <td className="px-4 py-3 text-xs text-[#77818A] max-w-md truncate">{r.description || '—'}</td>
                <td className="px-4 py-3 text-sm">{r.requiredSkillCount ?? 0}</td>
                <td className="px-4 py-3 text-sm text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => openRequirements(r)}>
                    <ListChecks className="w-3.5 h-3.5" /> Manage Skills
                  </Button>
                  <button
                    onClick={() => {
                      setEditingRole(r);
                      setRoleForm({ roleName: r.roleName, description: r.description || '' });
                      setRoleModal(true);
                    }}
                    className="p-1.5 rounded hover:bg-[#F5F6F4] dark:hover:bg-[#2D424F] text-[#426B72] cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(r)}
                    className="p-1.5 rounded hover:bg-rose-50 text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={roleModal} onClose={() => setRoleModal(false)} title={editingRole ? 'Edit Job Role' : 'Add Job Role'}>
        <form onSubmit={handleSaveRole} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Role Name</label>
            <input
              value={roleForm.roleName}
              onChange={(e) => setRoleForm({ ...roleForm, roleName: e.target.value })}
              required
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Description</label>
            <textarea
              rows={3}
              value={roleForm.description}
              onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRoleModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editingRole ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(reqModalRole)}
        onClose={() => setReqModalRole(null)}
        title={`Required Skills: ${reqModalRole?.roleName || ''}`}
      >
        <div className="space-y-4">
          <form onSubmit={handleAddRequirement} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-md bg-[#F5F6F4] dark:bg-[#17232D]">
            <select
              value={reqForm.skillId}
              onChange={(e) => setReqForm({ ...reqForm, skillId: e.target.value })}
              required
              className="px-2.5 py-1.5 text-xs rounded border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#243541]"
            >
              <option value="">Select Skill</option>
              {allSkills.map((s) => (
                <option key={s.id} value={s.id}>{s.skillName}</option>
              ))}
            </select>
            <select
              value={reqForm.requiredProficiency}
              onChange={(e) => setReqForm({ ...reqForm, requiredProficiency: e.target.value })}
              className="px-2.5 py-1.5 text-xs rounded border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#243541]"
            >
              {PROFICIENCY_LEVELS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 text-xs">
              <label>Weight (1-5):</label>
              <input
                type="number"
                min="1"
                max="5"
                value={reqForm.importanceWeight}
                onChange={(e) => setReqForm({ ...reqForm, importanceWeight: e.target.value })}
                className="w-16 px-2 py-1 rounded border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#243541]"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs">
                <input
                  type="checkbox"
                  checked={reqForm.isMandatory}
                  onChange={(e) => setReqForm({ ...reqForm, isMandatory: e.target.checked })}
                />
                Mandatory
              </label>
              <Button type="submit" size="sm" loading={saving}>Add</Button>
            </div>
          </form>

          <div className="max-h-60 overflow-y-auto divide-y divide-[#E5E8E5] dark:divide-[#354651]">
            {requirements.map((req) => (
              <div key={req.id} className="py-2 flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium">{req.skillName}</span>
                  <span className="ml-2 text-[#77818A]">
                    {formatProficiency(req.requiredProficiency)} • Weight {req.importanceWeight}/5
                  </span>
                  {req.isMandatory && <Badge tone="danger" className="ml-2">Mandatory</Badge>}
                </div>
                <button
                  onClick={() => handleRemoveRequirement(req.id)}
                  className="text-rose-600 hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteRole}
        title="Delete Job Role"
        message={`Are you sure you want to delete "${deleteTarget?.roleName}"?`}
      />
    </div>
  );
}
