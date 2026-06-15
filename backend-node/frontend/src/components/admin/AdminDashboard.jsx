import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, FolderTree, MapPin, Briefcase, FileText, Mail,
  BarChart3, MessageSquareQuote, ArrowRight, Clock, User
} from 'lucide-react';
import { getDashboardStats, getImageUrl } from '../../lib/db';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-spinner" />;
  if (!data) return <div className="admin-empty"><p>Failed to load dashboard data.</p></div>;

  const statCards = [
    { label: 'Categories', value: data.total_categories || 0, icon: FolderTree, color: 'teal', path: '/admin/categories' },
    { label: 'Products', value: data.total_products || 0, icon: Package, color: 'blue', path: '/admin/products' },
    { label: 'Dealers', value: data.total_dealers || 0, icon: MapPin, color: 'green', path: '/admin/dealers' },
    { label: 'Open Jobs', value: data.total_jobs || 0, icon: Briefcase, color: 'purple', path: '/admin/careers' },
    { label: 'Applications', value: data.total_applications || 0, icon: FileText, color: 'amber', path: '/admin/applications' },
    { label: 'Enquiries', value: data.total_enquiries || 0, icon: Mail, color: 'red', path: '/admin/enquiries' },
  ];

  const recentApps = Array.isArray(data.recent_applications) ? data.recent_applications : [];
  const recentEnqs = Array.isArray(data.recent_enquiries) ? data.recent_enquiries : [];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Welcome back. Here's an overview of your FAAZO platform.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="admin-stat-grid" style={{ marginBottom: 28 }}>
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="admin-stat-card"
              onClick={() => navigate(card.path)}
              style={{ cursor: 'pointer' }}
            >
              <div className={`admin-stat-card-icon ${card.color}`}>
                <Icon size={20} />
              </div>
              <div className="admin-stat-card-value">{card.value}</div>
              <div className="admin-stat-card-label">{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent Applications */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Recent Applications</span>
            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => navigate('/admin/applications')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="admin-card-body" style={{ padding: 0 }}>
            {recentApps.length === 0 ? (
              <div className="admin-empty" style={{ padding: 32 }}>
                <FileText size={32} style={{ color: 'var(--admin-text-muted)' }} />
                <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', marginTop: 8 }}>No recent applications</p>
              </div>
            ) : (
              <div>
                {recentApps.slice(0, 5).map((app, i) => (
                  <div key={app.id || i} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px',
                    borderBottom: i < recentApps.length - 1 ? '1px solid var(--admin-border-light)' : 'none'
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', background: 'var(--admin-teal-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-teal)',
                      flexShrink: 0
                    }}>
                      <User size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }} className="admin-text-truncate">
                        {app.full_name || app.applicant_name || 'Unknown'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }} className="admin-text-truncate">
                        {app.job_title || `Job #${app.job}`}
                      </div>
                    </div>
                    <span className={`admin-badge ${app.status === 'New' ? 'admin-badge-info' : app.status === 'Shortlisted' ? 'admin-badge-success' : 'admin-badge-neutral'}`}>
                      {app.status || 'New'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Recent Enquiries</span>
            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => navigate('/admin/enquiries')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="admin-card-body" style={{ padding: 0 }}>
            {recentEnqs.length === 0 ? (
              <div className="admin-empty" style={{ padding: 32 }}>
                <Mail size={32} style={{ color: 'var(--admin-text-muted)' }} />
                <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', marginTop: 8 }}>No recent enquiries</p>
              </div>
            ) : (
              <div>
                {recentEnqs.slice(0, 5).map((enq, i) => (
                  <div key={enq.id || i} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px',
                    borderBottom: i < recentEnqs.length - 1 ? '1px solid var(--admin-border-light)' : 'none'
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', background: 'var(--admin-info-bg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-info)',
                      flexShrink: 0
                    }}>
                      <Mail size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }} className="admin-text-truncate">
                        {enq.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }} className="admin-text-truncate">
                        {enq.subject}
                      </div>
                    </div>
                    <span className={`admin-badge ${enq.contacted ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                      {enq.contacted ? 'Contacted' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
