import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getStats, saveStat, deleteStat } from '../../lib/db';
import { AdminModal, ConfirmDialog } from './AdminModal';
import { useToast } from './AdminToast';

const ICON_OPTIONS = ['ShieldCheck', 'Activity', 'Package', 'Globe', 'Award', 'Cpu', 'Layers', 'HeartPulse', 'Zap', 'Building', 'Users', 'Landmark'];

export const AdminStats = () => {
  const toast = useToast();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ id: '', label: '', value: '', icon: 'ShieldCheck', display_order: 0, active: true });

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getStats();
      setStats(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load statistics'); }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  const openCreate = () => {
    setForm({ id: '', label: '', value: '', icon: 'ShieldCheck', display_order: stats.length + 1, active: true });
    setFormOpen(true);
  };

  const openEdit = (stat) => {
    setForm({ ...stat });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.label || !form.value) return;
    setSaving(true);
    try {
      await saveStat(form);
      toast.success(form.id ? 'Statistic updated!' : 'Statistic created!');
      setFormOpen(false);
      refresh();
    } catch { toast.error('Failed to save statistic'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await deleteStat(deleteTarget);
      toast.success('Statistic deleted');
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
          <h1 className="admin-page-title">Statistics</h1>
          <p className="admin-page-subtitle">Manage homepage statistics displayed to visitors</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Statistic
        </button>
      </div>

      {stats.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <p className="admin-empty-title">No statistics yet</p>
            <p className="admin-empty-text">Create your first statistic to display on the homepage.</p>
            <button className="admin-btn admin-btn-primary" onClick={openCreate} style={{ marginTop: 16 }}>
              <Plus size={16} /> Add Statistic
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Label</th>
                  <th>Value</th>
                  <th>Icon</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.map(stat => (
                  <tr key={stat.id}>
                    <td style={{ fontWeight: 600 }}>{stat.display_order}</td>
                    <td style={{ fontWeight: 600 }}>{stat.label}</td>
                    <td>{stat.value}</td>
                    <td><span className="admin-badge admin-badge-neutral">{stat.icon}</span></td>
                    <td>
                      <span className={`admin-badge ${stat.active ? 'admin-badge-success' : 'admin-badge-neutral'}`}>
                        {stat.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openEdit(stat)}>
                        <Edit size={14} />
                      </button>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setDeleteTarget(stat.id)} style={{ color: 'var(--admin-danger)' }}>
                        <Trash2 size={14} />
                      </button>
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
        title={form.id ? 'Edit Statistic' : 'New Statistic'}
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
              <label className="admin-form-label">Label <span className="required">*</span></label>
              <input className="admin-form-input" value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} placeholder="e.g. Years of Experience" required />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Value <span className="required">*</span></label>
              <input className="admin-form-input" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} placeholder="e.g. 10+" required />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Icon</label>
              <select className="admin-form-select" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}>
                {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Display Order</label>
              <input type="number" className="admin-form-input" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-checkbox">
              <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} />
              Active (visible on website)
            </label>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Statistic"
        message="This will permanently remove this statistic from the website."
        loading={saving}
      />
    </div>
  );
};
