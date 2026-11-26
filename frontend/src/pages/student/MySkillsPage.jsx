import { useEffect, useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Search, Code2, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import studentSkillService from '../../services/studentSkillService';
import skillService from '../../services/skillService';
import categoryService from '../../services/categoryService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { LoadingSpinner, AlertBanner, EmptyState } from '../../components/common/Feedback';
import { PROFICIENCY_LEVELS } from '../../utils/constants';
import { formatDate, formatProficiency, extractErrorMessage } from '../../utils/formatters';

const PROF_TONE = {
  BEGINNER: 'warning',
  INTERMEDIATE: 'cyan',
  ADVANCED: 'purple',
  EXPERT: 'success',
};

export default function MySkillsPage() {
  const { user } = useAuth();
  const [studentSkills, setStudentSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [proficiencyFilter, setProficiencyFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    skillId: '',
    proficiencyLevel: 'INTERMEDIATE',
    experienceYears: '',
    lastPracticed: '',
  });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadData = async () => {
    try {
      const [ss, skills, cats] = await Promise.all([
        studentSkillService.getByStudent(user.studentId),
        skillService.getAll(),
        categoryService.getAll(),
      ]);
      setStudentSkills(ss || []);
      setAllSkills(skills || []);
      setCategories(cats || []);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load your skills.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.studentId) loadData();
    else setLoading(false);
  }, [user?.studentId]);

  const filtered = useMemo(() => {
    return studentSkills.filter((item) => {
      const matchesSearch = item.skillName.toLowerCase().includes(search.toLowerCase());
      const matchesCat = !categoryFilter || item.categoryName === categoryFilter;
      const matchesProf = !proficiencyFilter || item.proficiencyLevel === proficiencyFilter;
      return matchesSearch && matchesCat && matchesProf;
    });
  }, [studentSkills, search, categoryFilter, proficiencyFilter]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      skillId: '',
      proficiencyLevel: 'INTERMEDIATE',
      experienceYears: '',
      lastPracticed: '',
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      skillId: item.skillId,
      proficiencyLevel: item.proficiencyLevel,
      experienceYears: item.experienceYears ?? '',
      lastPracticed: item.lastPracticed || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const payload = {
        studentId: user.studentId,
        skillId: Number(form.skillId),
        proficiencyLevel: form.proficiencyLevel,
        experienceYears: form.experienceYears ? Number(form.experienceYears) : null,
        lastPracticed: form.lastPracticed || null,
      };
      if (editing) {
        await studentSkillService.update(editing.id, payload);
        setSuccess('Skill updated successfully.');
      } else {
        await studentSkillService.add(payload);
        setSuccess('Skill added to your profile.');
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to save skill.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await studentSkillService.remove(deleteTarget.id);
      setSuccess('Skill removed.');
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to remove skill.'));
    }
  };

  if (loading) return <LoadingSpinner label="Loading your skills..." />;

  const existingIds = new Set(studentSkills.map((s) => s.skillId));
  const availableSkills = editing
    ? allSkills
    : allSkills.filter((s) => !existingIds.has(s.id));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            My Skills
          </h1>
          <p className="text-xs text-slate-400">
            Add your programming languages, frameworks, databases, and tools with your proficiency level
          </p>
        </div>
        <Button onClick={openAdd} variant="primary">
          <Plus className="w-4 h-4" />
          Add Skill
        </Button>
      </div>

      {error && <AlertBanner type="error" message={error} onDismiss={() => setError('')} />}
      {success && <AlertBanner type="success" message={success} onDismiss={() => setSuccess('')} />}

      {/* Filter / Search Bar */}
      <div className="card-surface p-4 flex flex-col md:flex-row gap-3 border-slate-700/80 bg-slate-900/80">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your skills..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950/80 text-slate-200 focus:outline-none focus:border-cyan-400"
        >
          <option value="" className="bg-slate-900">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.categoryName} className="bg-slate-900">{c.categoryName}</option>
          ))}
        </select>
        <select
          value={proficiencyFilter}
          onChange={(e) => setProficiencyFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950/80 text-slate-200 focus:outline-none focus:border-cyan-400"
        >
          <option value="" className="bg-slate-900">All Proficiencies</option>
          {PROFICIENCY_LEVELS.map((p) => (
            <option key={p.value} value={p.value} className="bg-slate-900">{p.label}</option>
          ))}
        </select>
      </div>

      {/* Content Table or Empty State */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No Skills Added Yet"
          description="Click '+ Add Skill' to add skills you know (e.g. Java, Python, SQL) and compare them with job roles."
          action={<Button onClick={openAdd} variant="primary"><Plus className="w-4 h-4" /> Add Skill</Button>}
        />
      ) : (
        <div className="card-surface overflow-x-auto border-slate-700/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/70 uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Skill Name</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Proficiency Level</th>
                <th className="px-5 py-3.5">Experience</th>
                <th className="px-5 py-3.5">Last Practiced</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    {item.skillName}
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">{item.categoryName}</td>
                  <td className="px-5 py-3.5">
                    <Badge tone={PROF_TONE[item.proficiencyLevel] || 'cyan'}>
                      {formatProficiency(item.proficiencyLevel)}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{item.experienceYears != null ? `${item.experienceYears} yrs` : '—'}</td>
                  <td className="px-5 py-3.5 text-slate-400">{formatDate(item.lastPracticed)}</td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 rounded-lg hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Skill' : 'Add Skill'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Select Skill *
            </label>
            <select
              value={form.skillId}
              onChange={(e) => setForm({ ...form, skillId: e.target.value })}
              disabled={Boolean(editing)}
              required
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-cyan-400 transition-all disabled:opacity-50"
            >
              <option value="" className="bg-slate-900">Choose a skill...</option>
              {availableSkills.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900">
                  {s.skillName} ({s.categoryName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Proficiency Level *
            </label>
            <select
              value={form.proficiencyLevel}
              onChange={(e) => setForm({ ...form, proficiencyLevel: e.target.value })}
              required
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-cyan-400 transition-all"
            >
              {PROFICIENCY_LEVELS.map((p) => (
                <option key={p.value} value={p.value} className="bg-slate-900">
                  {p.label} (Level {p.value === 'BEGINNER' ? 1 : p.value === 'INTERMEDIATE' ? 2 : p.value === 'ADVANCED' ? 3 : 4})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Experience (Years)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="20"
                value={form.experienceYears}
                onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                placeholder="e.g. 1"
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Last Practiced
              </label>
              <input
                type="date"
                value={form.lastPracticed}
                onChange={(e) => setForm({ ...form, lastPracticed: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>
              {editing ? 'Update Skill' : 'Save Skill'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Skill"
        message={`Are you sure you want to remove "${deleteTarget?.skillName}" from your profile?`}
        confirmLabel="Remove"
      />
    </div>
  );
}
