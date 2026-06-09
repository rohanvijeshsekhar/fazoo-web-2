import { useState, useEffect } from 'react';
import { Search, Mail, Trash2, Eye, CheckCircle, Clock } from 'lucide-react';
import { getContactEnquiries, markEnquiryContacted, deleteContactEnquiry } from '../../lib/db';
import { AdminModal, ConfirmDialog } from './AdminModal';
import { useToast } from './AdminToast';

export const AdminEnquiries = () => {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getContactEnquiries();
      setItems(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load enquiries'); }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  const handleToggleContacted = async (id, currentStatus) => {
    try {
      await markEnquiryContacted(id, !currentStatus);
      toast.success(!currentStatus ? 'Marked as contacted' : 'Marked as pending');
      refresh();
    } catch { toast.error('Failed to update status'); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await deleteContactEnquiry(deleteTarget);
      toast.success('Enquiry deleted');
      setDeleteTarget(null);
      setDetailItem(null);
      refresh();
    } catch { toast.error('Failed to delete'); }
    finally { setSaving(false); }
  };

  const filtered = items.filter(enq => {
    const matchesSearch = !searchQuery ||
      enq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' ||
      (statusFilter === 'Contacted' && enq.contacted) ||
      (statusFilter === 'Pending' && !enq.contacted);
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="admin-spinner" />;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Enquiries</h1>
          <p className="admin-page-subtitle">Manage contact form submissions from the website</p>
        </div>
        <span style={{ fontSize: 13, color: 'var(--admin-text-secondary)' }}>
          {filtered.length} enquir{filtered.length !== 1 ? 'ies' : 'y'}
        </span>
      </div>

      <div className="admin-filter-bar">
        <input className="admin-form-input" placeholder="Search by name, email, or subject..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ minWidth: 260 }} />
        <select className="admin-form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ minWidth: 140 }}>
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Contacted">Contacted</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <Mail size={48} />
            <p className="admin-empty-title">No enquiries found</p>
            <p className="admin-empty-text">{searchQuery || statusFilter !== 'All' ? 'Try changing your filters.' : 'No contact enquiries received yet.'}</p>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Subject</th>
                  <th>Company</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(enq => (
                  <tr key={enq.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{enq.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>{enq.email}</div>
                    </td>
                    <td style={{ maxWidth: 220 }} className="admin-text-truncate">{enq.subject}</td>
                    <td style={{ fontSize: 13, color: 'var(--admin-text-secondary)' }}>{enq.company || '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--admin-text-secondary)', whiteSpace: 'nowrap' }}>
                      {enq.submitted_date ? new Date(enq.submitted_date).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <button
                        className={`admin-badge ${enq.contacted ? 'admin-badge-success' : 'admin-badge-warning'}`}
                        onClick={() => handleToggleContacted(enq.id, enq.contacted)}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle"
                      >
                        {enq.contacted ? '✓ Contacted' : '⏳ Pending'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setDetailItem(enq)}>
                        <Eye size={14} />
                      </button>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setDeleteTarget(enq.id)} style={{ color: 'var(--admin-danger)' }}>
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

      {/* Detail Modal */}
      <AdminModal
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title="Enquiry Details"
        footer={
          <>
            <button className="admin-btn admin-btn-secondary" onClick={() => setDetailItem(null)}>Close</button>
            {detailItem && (
              <button
                className={`admin-btn ${detailItem.contacted ? 'admin-btn-secondary' : 'admin-btn-primary'}`}
                onClick={() => { handleToggleContacted(detailItem.id, detailItem.contacted); setDetailItem(null); }}
              >
                {detailItem.contacted ? 'Mark as Pending' : 'Mark as Contacted'}
              </button>
            )}
          </>
        }
      >
        {detailItem && (
          <div style={{ fontSize: 13 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '12px 16px' }}>
              <span style={{ fontWeight: 600, color: 'var(--admin-text-secondary)' }}>Name</span>
              <span>{detailItem.name}</span>
              <span style={{ fontWeight: 600, color: 'var(--admin-text-secondary)' }}>Email</span>
              <span><a href={`mailto:${detailItem.email}`} style={{ color: 'var(--admin-teal)' }}>{detailItem.email}</a></span>
              <span style={{ fontWeight: 600, color: 'var(--admin-text-secondary)' }}>Phone</span>
              <span>{detailItem.phone}</span>
              <span style={{ fontWeight: 600, color: 'var(--admin-text-secondary)' }}>Company</span>
              <span>{detailItem.company || '—'}</span>
              <span style={{ fontWeight: 600, color: 'var(--admin-text-secondary)' }}>Subject</span>
              <span style={{ fontWeight: 600 }}>{detailItem.subject}</span>
              <span style={{ fontWeight: 600, color: 'var(--admin-text-secondary)' }}>Date</span>
              <span>{detailItem.submitted_date ? new Date(detailItem.submitted_date).toLocaleString() : '—'}</span>
              <span style={{ fontWeight: 600, color: 'var(--admin-text-secondary)' }}>Status</span>
              <span className={`admin-badge ${detailItem.contacted ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                {detailItem.contacted ? 'Contacted' : 'Pending'}
              </span>
            </div>
            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Message</div>
              <div style={{ background: 'var(--admin-bg)', padding: 16, borderRadius: 8, lineHeight: 1.7, color: 'var(--admin-text-secondary)', whiteSpace: 'pre-wrap' }}>
                {detailItem.message}
              </div>
            </div>
          </div>
        )}
      </AdminModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Enquiry"
        message="This enquiry will be permanently removed."
        loading={saving}
      />
    </div>
  );
};
