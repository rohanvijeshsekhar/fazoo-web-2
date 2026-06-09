import { useState, useEffect } from 'react';
import { Search, FileText, Download, Eye, Trash2, User, ChevronDown } from 'lucide-react';
import { getJobApplications, getJobs, updateApplicationStatus, deleteJobApplication, getImageUrl } from '../../lib/db';
import { AdminModal, ConfirmDialog } from './AdminModal';
import { useToast } from './AdminToast';

const STATUS_OPTIONS = ['New', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'];
const STATUS_COLORS = {
  'New': 'admin-badge-info',
  'Under Review': 'admin-badge-warning',
  'Shortlisted': 'admin-badge-success',
  'Rejected': 'admin-badge-danger',
  'Hired': 'admin-badge-success',
};

export const AdminApplications = () => {
  const toast = useToast();
  const [apps, setApps] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [detailApp, setDetailApp] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobFilter, setJobFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const refresh = async () => {
    setLoading(true);
    try {
      const [a, j] = await Promise.all([getJobApplications(), getJobs()]);
      setApps(Array.isArray(a) ? a : []);
      setJobs(Array.isArray(j) ? j : []);
    } catch { toast.error('Failed to load applications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  const getJobTitle = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    return job ? job.title : `Job #${jobId}`;
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      toast.success(`Status updated to "${newStatus}"`);
      refresh();
    } catch { toast.error('Failed to update status'); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await deleteJobApplication(deleteTarget);
      toast.success('Application deleted');
      setDeleteTarget(null);
      setDetailApp(null);
      refresh();
    } catch { toast.error('Failed to delete'); }
    finally { setSaving(false); }
  };

  const filtered = apps.filter(app => {
    const matchesSearch = !searchQuery ||
      (app.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.phone || '').includes(searchQuery);
    const matchesJob = jobFilter === 'All' || String(app.job) === String(jobFilter);
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesJob && matchesStatus;
  });

  if (loading) return <div className="admin-spinner" />;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Applications</h1>
          <p className="admin-page-subtitle">Review and manage job applications</p>
        </div>
        <span style={{ fontSize: 13, color: 'var(--admin-text-secondary)' }}>
          {filtered.length} application{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="admin-filter-bar">
        <input className="admin-form-input" placeholder="Search by name, email, or phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ minWidth: 240 }} />
        <select className="admin-form-select" value={jobFilter} onChange={e => setJobFilter(e.target.value)} style={{ minWidth: 160 }}>
          <option value="All">All Jobs</option>
          {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
        <select className="admin-form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ minWidth: 140 }}>
          <option value="All">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <FileText size={48} />
            <p className="admin-empty-title">No applications found</p>
            <p className="admin-empty-text">{searchQuery || jobFilter !== 'All' || statusFilter !== 'All' ? 'Try changing your filters.' : 'No applications have been received yet.'}</p>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Position</th>
                  <th>Applied</th>
                  <th>Status</th>
                  <th>Resume</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%', background: 'var(--admin-teal-light)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-teal)',
                          flexShrink: 0, fontWeight: 700, fontSize: 13
                        }}>
                          {(app.full_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{app.full_name}</div>
                          <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>{app.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13 }}>{getJobTitle(app.job)}</td>
                    <td style={{ fontSize: 12, color: 'var(--admin-text-secondary)' }}>{app.applied_date || '—'}</td>
                    <td>
                      <select
                        className="admin-form-select"
                        value={app.status || 'New'}
                        onChange={e => handleStatusChange(app.id, e.target.value)}
                        style={{ fontSize: 12, padding: '4px 8px', minWidth: 120 }}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      {app.resume && (
                        <a href={getImageUrl(app.resume)} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost admin-btn-sm" style={{ color: 'var(--admin-teal)' }}>
                          <Download size={14} /> PDF
                        </a>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setDetailApp(app)}>
                        <Eye size={14} />
                      </button>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setDeleteTarget(app.id)} style={{ color: 'var(--admin-danger)' }}>
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
        isOpen={!!detailApp}
        onClose={() => setDetailApp(null)}
        title="Application Details"
        footer={
          <button className="admin-btn admin-btn-secondary" onClick={() => setDetailApp(null)}>Close</button>
        }
      >
        {detailApp && (
          <div style={{ fontSize: 13 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px 16px' }}>
              <span style={{ fontWeight: 600, color: 'var(--admin-text-secondary)' }}>Name</span>
              <span>{detailApp.full_name}</span>
              <span style={{ fontWeight: 600, color: 'var(--admin-text-secondary)' }}>Email</span>
              <span>{detailApp.email}</span>
              <span style={{ fontWeight: 600, color: 'var(--admin-text-secondary)' }}>Phone</span>
              <span>{detailApp.phone}</span>
              <span style={{ fontWeight: 600, color: 'var(--admin-text-secondary)' }}>Location</span>
              <span>{detailApp.location || '—'}</span>
              <span style={{ fontWeight: 600, color: 'var(--admin-text-secondary)' }}>Position</span>
              <span>{getJobTitle(detailApp.job)}</span>
              <span style={{ fontWeight: 600, color: 'var(--admin-text-secondary)' }}>Applied</span>
              <span>{detailApp.applied_date || '—'}</span>
              <span style={{ fontWeight: 600, color: 'var(--admin-text-secondary)' }}>Status</span>
              <span className={`admin-badge ${STATUS_COLORS[detailApp.status] || 'admin-badge-neutral'}`}>{detailApp.status}</span>
            </div>
            {detailApp.cover_letter && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Cover Letter</div>
                <div style={{ background: 'var(--admin-bg)', padding: 14, borderRadius: 8, lineHeight: 1.6, color: 'var(--admin-text-secondary)' }}>
                  {detailApp.cover_letter}
                </div>
              </div>
            )}
            {detailApp.resume && (
              <div style={{ marginTop: 16 }}>
                <a href={getImageUrl(detailApp.resume)} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-primary admin-btn-sm">
                  <Download size={14} /> Download Resume
                </a>
              </div>
            )}
          </div>
        )}
      </AdminModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Application"
        message="This application will be permanently removed."
        loading={saving}
      />
    </div>
  );
};
