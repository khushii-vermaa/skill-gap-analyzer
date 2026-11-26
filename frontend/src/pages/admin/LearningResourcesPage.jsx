import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import resourceService from '../../services/resourceService';
import skillService from '../../services/skillService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { LoadingSpinner, AlertBanner } from '../../components/common/Feedback';
import { RESOURCE_TYPES } from '../../utils/constants';
import { extractErrorMessage } from '../../utils/formatters';

export default function LearningResourcesPage() {
  const [resources, setResources] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    resourceTitle: '',
    skillId: '',
    resourceType: 'COURSE',
    resourceUrl: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    try {
      const [res, sk] = await Promise.all([resourceService.getAll(), skillService.getAll()]);
      setResources(res || []);
      setSkills(sk || []);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load learning resources.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        resourceTitle: form.resourceTitle.trim(),
        skillId: Number(form.skillId),
        resourceType: form.resourceType,
        resourceUrl: form.resourceUrl.trim(),
        description: form.description.trim(),
      };
      if (editing) {
        await resourceService.update(editing.id, payload);
        setSuccess('Resource updated.');
      } else {
        await resourceService.create(payload);
        setSuccess('Resource added.');
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to save resource.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await resourceService.remove(deleteTarget.id);
      setSuccess('Resource deleted.');
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to delete resource.'));
    }
  };

  if (loading) return <LoadingSpinner label="Loading learning resources..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Learning Resources</h1>
          <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
            Curate courses, videos, documentation, and practice links for roadmap recommendations
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setForm({
              resourceTitle: '',
              skillId: skills[0]?.id || '',
              resourceType: 'COURSE',
              resourceUrl: '',
              description: '',
            });
            setModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> Add Resource
        </Button>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E8E5] dark:border-[#354651]">
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Title</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Skill</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Type</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Link</th>
              <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => (
              <tr key={r.id} className="border-t border-[#E5E8E5] dark:border-[#354651]">
                <td className="px-4 py-3 text-sm font-medium">{r.resourceTitle}</td>
                <td className="px-4 py-3 text-sm text-[#77818A]">{r.skillName}</td>
                <td className="px-4 py-3 text-sm">
                  <Badge tone="info">{r.resourceType}</Badge>
                </td>
                <td className="px-4 py-3 text-sm">
                  {r.resourceUrl ? (
                    <a
                      href={r.resourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#426B72] dark:text-[#8DAEAA] hover:underline"
                    >
                      Open <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-right space-x-1">
                  <button
                    onClick={() => {
                      setEditing(r);
                      setForm({
                        resourceTitle: r.resourceTitle,
                        skillId: r.skillId,
                        resourceType: r.resourceType,
                        resourceUrl: r.resourceUrl || '',
                        description: r.description || '',
                      });
                      setModalOpen(true);
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Resource' : 'Add Resource'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Resource Title</label>
            <input
              value={form.resourceTitle}
              onChange={(e) => setForm({ ...form, resourceTitle: e.target.value })}
              required
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Skill</label>
              <select
                value={form.skillId}
                onChange={(e) => setForm({ ...form, skillId: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
              >
                <option value="">Select skill</option>
                {skills.map((s) => (
                  <option key={s.id} value={s.id}>{s.skillName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Type</label>
              <select
                value={form.resourceType}
                onChange={(e) => setForm({ ...form, resourceType: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
              >
                {RESOURCE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">URL</label>
            <input
              type="url"
              value={form.resourceUrl}
              onChange={(e) => setForm({ ...form, resourceUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Resource"
        message={`Are you sure you want to delete "${deleteTarget?.resourceTitle}"?`}
      />
    </div>
  );
}
