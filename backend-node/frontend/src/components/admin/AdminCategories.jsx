import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, Package, FileText, X } from 'lucide-react';
import { getCategories, saveCategory, deleteCategory, compressImageFile, getImageUrl } from '../../lib/db';
import { AdminModal, ConfirmDialog } from './AdminModal';
import { useToast } from './AdminToast';

export const AdminCategories = () => {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', slug: '', description: '', overview: '', image: '', brochureUrl: '', display_order: 0, active: true });

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setItems(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  const openCreate = () => {
    setForm({ id: '', name: '', slug: '', description: '', overview: '', image: '', brochureUrl: '', display_order: items.length + 1, active: true });
    setFormOpen(true);
  };

  const openEdit = (cat) => {
    setForm({ ...cat, image: cat.image ? getImageUrl(cat.image) : '', brochureUrl: cat.brochure ? getImageUrl(cat.brochure) : '' });
    setFormOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const base64 = await compressImageFile(file, 800, 600);
      setForm(p => ({ ...p, image: base64 }));
    } catch { toast.error('Error processing image'); }
  };

  const handleBrochureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const base64 = await compressImageFile(file);
      setForm(p => ({ ...p, brochureUrl: base64 }));
    } catch { toast.error('Error processing file'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description) return;
    setSaving(true);
    try {
      await saveCategory(form);
      toast.success(form.id ? 'Category updated!' : 'Category created!');
      setFormOpen(false);
      refresh();
    } catch { toast.error('Failed to save category'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await deleteCategory(deleteTarget);
      toast.success('Category deleted');
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
          <h1 className="admin-page-title">Categories</h1>
          <p className="admin-page-subtitle">Manage product categories — each category groups related products</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}>
          <Plus size={16} /> New Category
        </button>
      </div>

      {items.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <Package size={48} />
            <p className="admin-empty-title">No categories yet</p>
            <p className="admin-empty-text">Create your first product category to organize your catalog.</p>
            <button className="admin-btn admin-btn-primary" onClick={openCreate} style={{ marginTop: 16 }}>
              <Plus size={16} /> New Category
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-items-grid">
          {items.map(cat => (
            <div key={cat.id} className="admin-item-card">
              <div style={{ display: 'flex', gap: 14 }}>
                {cat.image ? (
                  <img src={getImageUrl(cat.image)} alt={cat.name} style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover', border: '1px solid var(--admin-border)' }} />
                ) : (
                  <div style={{ width: 72, height: 72, borderRadius: 10, background: 'var(--admin-teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-teal)' }}>
                    <Package size={28} />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }} className="admin-text-truncate">{cat.name}</span>
                    <span className={`admin-badge ${cat.active ? 'admin-badge-success' : 'admin-badge-neutral'}`}>
                      {cat.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginBottom: 4 }}>/{cat.slug}</div>
                  <p style={{ fontSize: 12, color: 'var(--admin-text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {cat.description}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 14, borderTop: '1px solid var(--admin-border-light)', paddingTop: 14 }}>
                <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => openEdit(cat)}>
                  <Edit size={14} /> Edit
                </button>
                <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteTarget(cat.slug)}>
                  <Trash2 size={14} />
                </button>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--admin-text-muted)', alignSelf: 'center' }}>
                  Order: {cat.display_order}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AdminModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={form.id ? 'Edit Category' : 'New Category'}
        size="lg"
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
              <label className="admin-form-label">Category Name <span className="required">*</span></label>
              <input className="admin-form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Dental Chairs" required />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Slug (auto-generated if empty)</label>
              <input className="admin-form-input" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="dental-chairs" />
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Description <span className="required">*</span></label>
            <textarea className="admin-form-textarea" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Short description of this category..." required rows={3} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Overview (detailed)</label>
            <textarea className="admin-form-textarea" value={form.overview} onChange={e => setForm(p => ({ ...p, overview: e.target.value }))} placeholder="Detailed overview shown on the category page..." rows={4} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Category Image</label>
            {form.image ? (
              <div className="admin-upload-preview">
                <img src={form.image} alt="Preview" />
                <button type="button" className="remove-btn" onClick={() => setForm(p => ({ ...p, image: '' }))}>×</button>
              </div>
            ) : (
              <label className="admin-upload-area" style={{ display: 'block' }}>
                <Upload />
                <p>Click to upload image</p>
                <p className="upload-hint">Recommended: 800×600 — JPG, PNG</p>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
            )}
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Brochure PDF</label>
            {form.brochureUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--admin-bg)', borderRadius: 8, border: '1px solid var(--admin-border)' }}>
                <FileText size={18} style={{ color: 'var(--admin-teal)' }} />
                <span style={{ fontSize: 13, flex: 1 }}>Brochure attached</span>
                <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setForm(p => ({ ...p, brochureUrl: '' }))} style={{ color: 'var(--admin-danger)' }}>
                  <X size={14} /> Remove
                </button>
              </div>
            ) : (
              <label className="admin-upload-area" style={{ display: 'block', padding: 20 }}>
                <FileText />
                <p>Upload brochure PDF</p>
                <input type="file" accept="application/pdf" onChange={handleBrochureUpload} style={{ display: 'none' }} />
              </label>
            )}
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
        title="Delete Category"
        message="All products inside this category will also be deleted permanently!"
        loading={saving}
      />
    </div>
  );
};
