import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Briefcase } from 'lucide-react';
import { getJobs, saveJob, deleteJob } from '../../lib/db';
import { AdminModal, ConfirmDialog } from './AdminModal';
import { useToast } from './AdminToast';

const emptyJob = {
  id: '', title: '', salary: '', status: 'Open', display_order: 0,
  description: { paragraphs: [''], responsibilities: [''], requirements: [''] }
};

export const AdminCareers = () => {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...emptyJob });

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getJobs();
      setItems(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  const openCreate = () => {
    setForm({ ...emptyJob, display_order: items.length + 1 });
    setFormOpen(true);
  };

  const openEdit = (job) => {
    const desc = job.description || {};
    setForm({
      ...job,
      description: {
        paragraphs: Array.isArray(desc.paragraphs) && desc.paragraphs.length > 0 ? desc.paragraphs : [''],
        responsibilities: Array.isArray(desc.responsibilities) && desc.responsibilities.length > 0 ? desc.responsibilities : [''],
        requirements: Array.isArray(desc.requirements) && desc.requirements.length > 0 ? desc.requirements : [''],
      }
    });
    setFormOpen(true);
  };

  // Description list helpers
  const updateDescList = (key, idx, val) => {
    setForm(p => ({
      ...p,
      description: { ...p.description, [key]: p.description[key].map((item, i) => i === idx ? val : item) }
    }));
  };

  const addDescItem = (key) => {
    setForm(p => ({
      ...p,
      description: { ...p.description, [key]: [...p.description[key], ''] }
    }));
  };

  const removeDescItem = (key, idx) => {
    setForm(p => ({
      ...p,
      description: { ...p.description, [key]: p.description[key].filter((_, i) => i !== idx) }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    setSaving(true);
    try {
      const cleanedForm = {
        ...form,
        description: {
          paragraphs: form.description.paragraphs.filter(p => p.trim()),
          responsibilities: form.description.responsibilities.filter(r => r.trim()),
          requirements: form.description.requirements.filter(r => r.trim()),
        }
      };
      await saveJob(cleanedForm);
      toast.success(form.id ? 'Job updated!' : 'Job posted!');
      setFormOpen(false);
      refresh();
    } catch { toast.error('Failed to save job'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await deleteJob(deleteTarget);
      toast.success('Job deleted');
      setDeleteTarget(null);
      refresh();
    } catch { toast.error('Failed to delete'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="admin-spinner" />;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Careers</h1>
          <p className="admin-page-subtitle">Manage job postings displayed on the careers page</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}>
          <Plus size={16} /> Post Job
        </button>
      </div>

      {items.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <Briefcase size={48} />
            <p className="admin-empty-title">No job postings yet</p>
            <p className="admin-empty-text">Create a job posting to start accepting applications.</p>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Salary</th>
                  <th>Posted</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(job => (
                  <tr key={job.id}>
                    <td style={{ fontWeight: 600 }}>{job.title}</td>
                    <td style={{ fontSize: 13 }}>{job.salary || '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--admin-text-secondary)' }}>{job.posted_date || '—'}</td>
                    <td>
                      <span className={`admin-badge ${job.status === 'Open' ? 'admin-badge-success' : 'admin-badge-neutral'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td>{job.display_order}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openEdit(job)}><Edit size={14} /></button>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setDeleteTarget(job.id)} style={{ color: 'var(--admin-danger)' }}><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <AdminModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={form.id ? 'Edit Job' : 'New Job Posting'}
        size="lg"
        footer={
          <>
            <button className="admin-btn admin-btn-secondary" onClick={() => setFormOpen(false)}>Cancel</button>
            <button className="admin-btn admin-btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : form.id ? 'Update' : 'Post Job'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Job Title <span className="required">*</span></label>
              <input className="admin-form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Senior Sales Manager" required />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Salary Range</label>
              <input className="admin-form-input" value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} placeholder="e.g. ₹5L - ₹8L / year" />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Status</label>
              <select className="admin-form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Display Order</label>
              <input type="number" className="admin-form-input" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>

          {/* Description Paragraphs */}
          <div className="admin-form-group">
            <label className="admin-form-label">Description Paragraphs</label>
            {form.description.paragraphs.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <textarea className="admin-form-textarea" style={{ minHeight: 60 }} value={p} onChange={e => updateDescList('paragraphs', i, e.target.value)} placeholder={`Paragraph ${i + 1}`} />
                {form.description.paragraphs.length > 1 && (
                  <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => removeDescItem('paragraphs', i)} style={{ color: 'var(--admin-danger)', alignSelf: 'start', marginTop: 8 }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => addDescItem('paragraphs')}>
              <Plus size={14} /> Add Paragraph
            </button>
          </div>

          {/* Responsibilities */}
          <div className="admin-form-group">
            <label className="admin-form-label">Responsibilities</label>
            {form.description.responsibilities.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input className="admin-form-input" value={r} onChange={e => updateDescList('responsibilities', i, e.target.value)} placeholder={`Responsibility ${i + 1}`} />
                {form.description.responsibilities.length > 1 && (
                  <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => removeDescItem('responsibilities', i)} style={{ color: 'var(--admin-danger)' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => addDescItem('responsibilities')}>
              <Plus size={14} /> Add Responsibility
            </button>
          </div>

          {/* Requirements */}
          <div className="admin-form-group">
            <label className="admin-form-label">Requirements</label>
            {form.description.requirements.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input className="admin-form-input" value={r} onChange={e => updateDescList('requirements', i, e.target.value)} placeholder={`Requirement ${i + 1}`} />
                {form.description.requirements.length > 1 && (
                  <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => removeDescItem('requirements', i)} style={{ color: 'var(--admin-danger)' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => addDescItem('requirements')}>
              <Plus size={14} /> Add Requirement
            </button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Job"
        message="This job posting and all associated applications will be affected."
        loading={saving}
      />
    </div>
  );
};
