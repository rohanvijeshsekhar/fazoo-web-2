import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Search, ExternalLink } from 'lucide-react';
import { getDealers, saveDealer, deleteDealer, COUNTRY_STATES_MAP } from '../../lib/db';
import { AdminModal, ConfirmDialog } from './AdminModal';
import { useToast } from './AdminToast';

const emptyDealer = {
  id: '', name: '', country: 'India', state: '', city: '', address: '',
  contactPerson: '', phone: '', email: '', type: 'Dealer', mapsLink: '', active: true
};

export const AdminDealers = () => {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('All');
  const [form, setForm] = useState({ ...emptyDealer });

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getDealers();
      setItems(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load dealers'); }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  const openCreate = () => {
    setForm({ ...emptyDealer });
    setFormOpen(true);
  };

  const openEdit = (d) => {
    setForm({ ...d, contactPerson: d.contactPerson || d.contact_person || '', mapsLink: d.mapsLink || d.maps_link || '' });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.country || !form.city) return;
    setSaving(true);
    try {
      await saveDealer(form);
      toast.success(form.id ? 'Dealer updated!' : 'Dealer added!');
      setFormOpen(false);
      refresh();
    } catch { toast.error('Failed to save dealer'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await deleteDealer(deleteTarget);
      toast.success('Dealer deleted');
      setDeleteTarget(null);
      refresh();
    } catch { toast.error('Failed to delete'); }
    finally { setSaving(false); }
  };

  const filtered = items.filter(d => {
    const matchesSearch = !searchQuery ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.contactPerson || d.contact_person || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = filterCountry === 'All' || d.country === filterCountry;
    return matchesSearch && matchesCountry;
  });

  const countries = [...new Set(items.map(d => d.country))];
  const states = COUNTRY_STATES_MAP[form.country] || [];

  if (loading) return <div className="admin-spinner" />;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dealers</h1>
          <p className="admin-page-subtitle">Manage your dealer and distributor network</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Dealer
        </button>
      </div>

      <div className="admin-filter-bar">
        <input className="admin-form-input" placeholder="Search dealers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ minWidth: 220 }} />
        <select className="admin-form-select" value={filterCountry} onChange={e => setFilterCountry(e.target.value)} style={{ minWidth: 140 }}>
          <option value="All">All Countries</option>
          {Object.keys(COUNTRY_STATES_MAP).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginLeft: 'auto' }}>
          {filtered.length} dealer{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <MapPin size={48} />
            <p className="admin-empty-title">No dealers found</p>
            <p className="admin-empty-text">{searchQuery || filterCountry !== 'All' ? 'Try changing your filters.' : 'Add your first dealer to the network.'}</p>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Dealer Name</th>
                  <th>Location</th>
                  <th>Contact</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600 }}>{d.name}</td>
                    <td>
                      <div style={{ fontSize: 13 }}>{d.city}, {d.state}</div>
                      <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>{d.country}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13 }}>{d.contactPerson || d.contact_person}</div>
                      <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>{d.phone}</div>
                    </td>
                    <td><span className="admin-badge admin-badge-info">{d.type}</span></td>
                    <td>
                      <span className={`admin-badge ${d.active ? 'admin-badge-success' : 'admin-badge-neutral'}`}>
                        {d.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {(d.mapsLink || d.maps_link) && (
                        <a href={d.mapsLink || d.maps_link} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost admin-btn-sm">
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openEdit(d)}><Edit size={14} /></button>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setDeleteTarget(d.id)} style={{ color: 'var(--admin-danger)' }}><Trash2 size={14} /></button>
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
        title={form.id ? 'Edit Dealer' : 'New Dealer'}
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
              <label className="admin-form-label">Dealer Name <span className="required">*</span></label>
              <input className="admin-form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Business name" required />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Type</label>
              <select className="admin-form-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                <option value="Dealer">Dealer</option>
                <option value="Distributor">Distributor</option>
                <option value="Partner">Partner</option>
              </select>
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Country <span className="required">*</span></label>
              <select className="admin-form-select" value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value, state: '' }))}>
                {Object.keys(COUNTRY_STATES_MAP).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">State</label>
              <select className="admin-form-select" value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))}>
                <option value="">Select state</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">City <span className="required">*</span></label>
              <input className="admin-form-input" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="City" required />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Contact Person</label>
              <input className="admin-form-input" value={form.contactPerson} onChange={e => setForm(p => ({ ...p, contactPerson: e.target.value }))} placeholder="Contact name" />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Address</label>
            <textarea className="admin-form-textarea" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="Full address" rows={2} />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Phone</label>
              <input className="admin-form-input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Email</label>
              <input type="email" className="admin-form-input" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="dealer@email.com" />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Google Maps Link</label>
            <input className="admin-form-input" value={form.mapsLink} onChange={e => setForm(p => ({ ...p, mapsLink: e.target.value }))} placeholder="https://maps.google.com/..." />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-checkbox">
              <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} />
              Active (visible on website)
            </label>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Dealer"
        message="This dealer will be permanently removed from the network."
        loading={saving}
      />
    </div>
  );
};
