import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { KeyRound, User } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { useAuth } from '@/contexts/AuthContext';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop';

const navItems = [
  { to: '/member/profile', label: 'Profile', icon: User },
  { to: '/member/reset-password', label: 'Reset password', icon: KeyRound },
];

function MemberLayout() {
  const { user } = useAuth();
  const avatarSrc = user?.profilePic || DEFAULT_AVATAR;
  const displayName = user?.name || user?.username || 'Member';

  return (
    <div className="member-layout">
      <NavBar />

      <div className="member-shell">
        <aside className="member-sidebar">
          <div className="member-sidebar-user">
            <img src={avatarSrc} alt={displayName} className="member-sidebar-avatar" />
            <div className="member-sidebar-user-text">
              <span className="member-sidebar-name">{displayName}</span>
              <NavLink to="/member/profile" className="member-sidebar-page-link">
                Profile
              </NavLink>
            </div>
          </div>

          <nav className="member-nav">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  isActive ? 'member-nav-link member-nav-link--active' : 'member-nav-link'
                }
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="member-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MemberLayout;
