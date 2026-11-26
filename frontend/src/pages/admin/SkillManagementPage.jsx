import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import skillService from '../../services/skillService';
import categoryService from '../../services/categoryService';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { LoadingSpinner, AlertBanner } from '../../components/common/Feedback';
import { extractErrorMessage } from '../../utils/formatters';

export default function SkillManagementPage() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState('skills');
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [skillModal, setSkillModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({ skillName: '', categoryId: '', description: '' });

  const [catModal, setCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catForm, setCatForm] = useState({ categoryName: '', description: '' });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [sk, cats] = await Promise.all([skillService.getAll(), categoryService.getAll()]);
      setSkills(sk || []);
      setCategories(cats || []);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load skills and categories.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        skillName: skillForm.skillName.trim(),
        categoryId: Number(skillForm.categoryId),
        description: skillForm.description.trim(),
      };
      if (editingSkill) {
        await skillService.update(editingSkill.id, payload);
        setSuccess('Skill updated.');
      } else {
        await skillService.create(payload);
        setSuccess('Skill created.');
      }
      setSkillModal(false);
      await load();
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to save skill.'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCat = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        categoryName: catForm.categoryName.trim(),
        description: catForm.description.trim(),
      };
      if (editingCat) {
        await categoryService.update(editingCat.id, payload);
        setSuccess('Category updated.');
      } else {
        await categoryService.create(payload);
        setSuccess('Category created.');
      }
      setCatModal(false);
      await load();
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to save category.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'skill') {
        await skillService.remove(deleteTarget.item.id);
        setSuccess('Skill deleted.');
      } else {
        await categoryService.remove(deleteTarget.item.id);
        setSuccess('Category deleted.');
      }
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to delete item.'));
    }
  };

  if (loading) return <LoadingSpinner label="Loading skills..." />;

  const filteredSkills = skills.filter(
    (s) =>
      s.skillName.toLowerCase().includes(search.toLowerCase()) ||
      (s.categoryName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Skill & Category Management</h1>
          <p className="text-xs text-[#77818A] dark:text-[#A2AFB5]">
            Maintain the curated catalog of technical and soft skills
          </p>
        </div>
        <div className="flex gap-2">
          {tab === 'skills' ? (
            <Button
              onClick={() => {
                setEditingSkill(null);
                setSkillForm({ skillName: '', categoryId: categories[0]?.id || '', description: '' });
                setSkillModal(true);
              }}
            >
              <Plus className="w-4 h-4" /> Add Skill
            </Button>
          ) : (
            <Button
              onClick={() => {
                setEditingCat(null);
                setCatForm({ categoryName: '', description: '' });
                setCatModal(true);
              }}
            >
              <Plus className="w-4 h-4" /> Add Category
            </Button>
          )}
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="flex items-center justify-between gap-4 border-b border-[#E5E8E5] dark:border-[#354651]">
        <div className="flex gap-4">
          <button
            onClick={() => setTab('skills')}
            className={`pb-2.5 text-sm font-medium border-b-2 cursor-pointer ${
              tab === 'skills'
                ? 'border-[#426B72] text-[#25364A] dark:border-[#8DAEAA] dark:text-[#E7ECEB]'
                : 'border-transparent text-[#77818A]'
            }`}
          >
            Skills ({skills.length})
          </button>
          <button
            onClick={() => setTab('categories')}
            className={`pb-2.5 text-sm font-medium border-b-2 cursor-pointer ${
              tab === 'categories'
                ? 'border-[#426B72] text-[#25364A] dark:border-[#8DAEAA] dark:text-[#E7ECEB]'
                : 'border-transparent text-[#77818A]'
            }`}
          >
            Categories ({categories.length})
          </button>
        </div>
      </div>

      {tab === 'skills' ? (
        <>
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-[#77818A] absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            />
          </div>
          <div className="card-surface overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E8E5] dark:border-[#354651]">
                  <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Skill Name</th>
                  <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Category</th>
                  <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Description</th>
                  <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSkills.map((s) => (
                  <tr key={s.id} className="border-t border-[#E5E8E5] dark:border-[#354651]">
                    <td className="px-4 py-3 text-sm font-medium">{s.skillName}</td>
                    <td className="px-4 py-3 text-sm text-[#77818A]">{s.categoryName}</td>
                    <td className="px-4 py-3 text-xs text-[#77818A]">{s.description || '—'}</td>
                    <td className="px-4 py-3 text-sm text-right space-x-1">
                      <button
                        onClick={() => {
                          setEditingSkill(s);
                          setSkillForm({
                            skillName: s.skillName,
                            categoryId: s.categoryId,
                            description: s.description || '',
                          });
                          setSkillModal(true);
                        }}
                        className="p-1.5 rounded hover:bg-[#F5F6F4] dark:hover:bg-[#2D424F] text-[#426B72] cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: 'skill', item: s })}
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
        </>
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E8E5] dark:border-[#354651]">
                <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Category</th>
                <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Description</th>
                <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3">Skills</th>
                <th className="text-xs font-medium text-[#77818A] uppercase px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-t border-[#E5E8E5] dark:border-[#354651]">
                  <td className="px-4 py-3 text-sm font-medium">{c.categoryName}</td>
                  <td className="px-4 py-3 text-xs text-[#77818A]">{c.description || '—'}</td>
                  <td className="px-4 py-3 text-sm">{c.skillCount ?? 0}</td>
                  <td className="px-4 py-3 text-sm text-right space-x-1">
                    <button
                      onClick={() => {
                        setEditingCat(c);
                        setCatForm({ categoryName: c.categoryName, description: c.description || '' });
                        setCatModal(true);
                      }}
                      className="p-1.5 rounded hover:bg-[#F5F6F4] dark:hover:bg-[#2D424F] text-[#426B72] cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: 'cat', item: c })}
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
      )}

      <Modal open={skillModal} onClose={() => setSkillModal(false)} title={editingSkill ? 'Edit Skill' : 'Add Skill'}>
        <form onSubmit={handleSaveSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Skill Name</label>
            <input
              value={skillForm.skillName}
              onChange={(e) => setSkillForm({ ...skillForm, skillName: e.target.value })}
              required
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Category</label>
            <select
              value={skillForm.categoryId}
              onChange={(e) => setSkillForm({ ...skillForm, categoryId: e.target.value })}
              required
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.categoryName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Description</label>
            <textarea
              rows={3}
              value={skillForm.description}
              onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSkillModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editingSkill ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={catModal} onClose={() => setCatModal(false)} title={editingCat ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSaveCat} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Category Name</label>
            <input
              value={catForm.categoryName}
              onChange={(e) => setCatForm({ ...catForm, categoryName: e.target.value })}
              required
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Description</label>
            <textarea
              rows={3}
              value={catForm.description}
              onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-[#E5E8E5] dark:border-[#354651] bg-white dark:bg-[#17232D]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCatModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editingCat ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete this ${deleteTarget?.type === 'skill' ? 'skill' : 'category'}?`}
      />
    </div>
  );
}
