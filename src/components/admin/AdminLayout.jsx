import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  ExternalLink,
  FileText,
  FolderOpen,
  KeyRound,
  LogOut,
  User,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const mainNavItems = [
  { to: '/admin/articles', label: 'Article management', icon: FileText },
  { to: '/admin/categories', label: 'Category management', icon: FolderOpen },
  { to: '/admin/profile', label: 'Profile', icon: User },
  { to: '/admin/notifications', label: 'Notification', icon: Bell },
  { to: '/admin/reset-password', label: 'Reset password', icon: KeyRound },
];

function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <Link to="/" className="admin-logo">
            DogGo<span className="admin-logo-dot logo-dot">.</span>
          </Link>
          <p className="admin-panel-label">Admin panel</p>

          <nav className="admin-nav">
            {mainNavItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  isActive ? 'admin-nav-link admin-nav-link--active' : 'admin-nav-link'
                }
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          <Link to="/" className="admin-nav-link">
            <ExternalLink size={18} aria-hidden="true" />
            DogGo<span className="logo-dot">.</span> website
          </Link>
          <button type="button" className="admin-nav-link admin-nav-logout" onClick={handleLogout}>
            <LogOut size={18} aria-hidden="true" />
            Log out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
