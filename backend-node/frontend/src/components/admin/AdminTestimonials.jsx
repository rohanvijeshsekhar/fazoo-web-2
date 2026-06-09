import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { getTestimonials, saveTestimonial, deleteTestimonial, compressImageFile, getImageUrl } from '../../lib/db';
import { AdminModal, ConfirmDialog } from './AdminModal';
import { useToast } from './AdminToast';

export const AdminTestimonials = () => {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', designation: '', company: '', content: '', image: '', display_order: 0, active: true });

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getTestimonials();
      setItems(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load testimonials'); }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  const openCreate = () => {
    setForm({ id: '', name: '', designation: '', company: '', content: '', image: '', display_order: items.length + 1, active: true });
    setFormOpen(true);
  };

  const openEdit = (t) => {
    setForm({ ...t, image: t.image ? getImageUrl(t.image) : '' });
    setFormOpen(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.content) return;
    setSaving(true);
    try {
      await saveTestimonial(form);
      toast.success(form.id ? 'Testimonial updated!' : 'Testimonial created!');
      setFormOpen(false);
      refresh();
    } catch { toast.error('Failed to save testimonial'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await deleteTestimonial(deleteTarget);
      toast.success('Testimonial deleted');
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
          <h1 className="admin-page-title">Testimonials</h1>
          <p className="admin-page-subtitle">Manage customer testimonials displayed on the homepage</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {items.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <p className="admin-empty-title">No testimonials yet</p>
            <p className="admin-empty-text">Add customer testimonials to build trust with your visitors.</p>
          </div>
        </div>
      ) : (
        <div className="admin-items-grid">
          {items.map(t => (
            <div key={t.id} className="admin-item-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }} className="admin-text-truncate">{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--admin-text-secondary)' }} className="admin-text-truncate">{t.designation}, {t.company}</div>
                </div>
                <span className={`admin-badge ${t.active ? 'admin-badge-success' : 'admin-badge-neutral'}`}>
                  {t.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                "{t.content}"
              </p>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => openEdit(t)}>
                  <Edit size={14} /> Edit
                </button>
                <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteTarget(t.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AdminModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={form.id ? 'Edit Testimonial' : 'New Testimonial'}
        footer={
          <>
            <button className="admin-btn admin-btn-secondary" onClick={() => setFormOpen(false)}>Cancel</button>
            <button className="admin-btn admin-btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : form.id ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Name <span className="required">*</span></label>
              <input className="admin-form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Customer name" required />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Company</label>
              <input className="admin-form-input" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="Company / Clinic" />
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Designation</label>
            <input className="admin-form-input" value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))} placeholder="e.g. Chief Dentist" />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Testimonial Content <span className="required">*</span></label>
            <textarea className="admin-form-textarea" value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="What the customer said..." required rows={4} />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Display Order</label>
              <input type="number" className="admin-form-input" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <label className="admin-form-checkbox">
                <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} />
                Active (visible on website)
              </label>
            </div>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        message="This testimonial will be permanently removed."
        loading={saving}
      />
    </div>
  );
};
