import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BarChart3, MessageSquareQuote, FolderTree, Package,
  MapPin, Briefcase, FileText, Mail, LogOut, Search, Bell, Menu, X,
  ExternalLink
} from 'lucide-react';
import { isLoggedIn, logoutAdmin, getDashboardStats } from '../../lib/db';
import { ToastProvider } from './AdminToast';
import './admin.css';

const navItems = [
  { section: 'Overview', items: [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ]},
  { section: 'Content', items: [
    { path: '/admin/stats', label: 'Statistics', icon: BarChart3 },
    { path: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  ]},
  { section: 'Catalog', items: [
    { path: '/admin/categories', label: 'Categories', icon: FolderTree },
    { path: '/admin/products', label: 'Products', icon: Package },
  ]},
  { section: 'Operations', items: [
    { path: '/admin/dealers', label: 'Dealers', icon: MapPin },
    { path: '/admin/careers', label: 'Careers', icon: Briefcase },
    { path: '/admin/applications', label: 'Applications', icon: FileText },
    { path: '/admin/enquiries', label: 'Enquiries', icon: Mail },
  ]},
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    getDashboardStats()
      .then(data => {
        if (data) {
          setCounts({
            '/admin/categories': data.total_categories || 0,
            '/admin/products': data.total_products || 0,
            '/admin/dealers': data.total_dealers || 0,
            '/admin/careers': data.total_jobs || 0,
            '/admin/applications': data.total_applications || 0,
            '/admin/enquiries': data.total_enquiries || 0,
          });
        }
      })
      .catch(() => {});
  }, [location.pathname]);

  useEffect(() => {
    // Update page title
    const pathSegment = location.pathname.split('/').pop();
    const titleMap = {
      dashboard: 'Dashboard',
      stats: 'Statistics',
      testimonials: 'Testimonials',
      categories: 'Categories',
      products: 'Products',
      dealers: 'Dealers',
      careers: 'Careers',
      applications: 'Applications',
      enquiries: 'Enquiries',
    };
    document.title = `${titleMap[pathSegment] || 'Admin'} — FAZO Admin`;
  }, [location.pathname]);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  const adminUser = (() => {
    try {
      const stored = localStorage.getItem('fazo_admin_user');
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  })();

  if (!isLoggedIn()) return null;

  return (
    <ToastProvider>
      <div className="admin-shell">
        {/* Sidebar */}
        <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="admin-sidebar-logo">
            <img src="/hero/fazologo.png" alt="FAZO" />
            <span className="admin-badge">ADMIN</span>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                marginLeft: 'auto', display: 'none', background: 'none', border: 'none',
                color: 'rgba(255,255,255,0.6)', cursor: 'pointer'
              }}
              className="admin-mobile-toggle"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="admin-sidebar-nav">
            {navItems.map((section) => (
              <div key={section.section} className="admin-sidebar-section">
                <div className="admin-sidebar-section-title">{section.section}</div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const count = counts[item.path];
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
                    >
                      <Icon />
                      <span>{item.label}</span>
                      {count !== undefined && count > 0 && (
                        <span className="nav-count">{count}</span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <a href="/" target="_blank" rel="noopener noreferrer" className="admin-nav-item" style={{ marginBottom: 4 }}>
              <ExternalLink />
              <span>View Website</span>
            </a>
            <button onClick={handleLogout} className="admin-nav-item" style={{ color: 'rgba(239,68,68,0.8)' }}>
              <LogOut />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="admin-mobile-overlay" onClick={() => setSidebarOpen(false)} style={{ display: 'block' }} />
        )}

        {/* Main Content */}
        <div className="admin-main">
          {/* Topbar */}
          <header className="admin-topbar">
            <button
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>

            <div className="admin-topbar-search">
              <Search />
              <input type="text" placeholder="Search anything..." />
            </div>

            <div className="admin-topbar-actions">
              <button className="admin-topbar-btn">
                <Bell size={18} />
                {(counts['/admin/applications'] > 0 || counts['/admin/enquiries'] > 0) && (
                  <span className="notif-dot" />
                )}
              </button>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '4px 12px',
                borderRadius: 8, cursor: 'pointer'
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: 'var(--admin-teal)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 13, fontWeight: 700
                }}>
                  {(adminUser.username || 'A').charAt(0).toUpperCase()}
                </div>
                <div style={{ lineHeight: 1.3 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--admin-text)' }}>
                    {adminUser.username || 'Admin'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>
                    Administrator
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="admin-content admin-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};
