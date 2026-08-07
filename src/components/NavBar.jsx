import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  ExternalLink,
  LogOut,
  Menu,
  RotateCcw,
  User,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { fetchNotifications } from '@/api/notificationApi';
import { useNotifications } from '@/contexts/NotificationContext';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop';

const NAV_NOTIFICATION_POLL_MS = 30000;

const LinkedinIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

function NotificationBadge({ count }) {
  if (count <= 0) return null;

  const label = count > 9 ? '9+' : String(count);

  return (
    <span className="nav-notification-badge" aria-hidden="true">
      {label}
    </span>
  );
}

function NotificationDropdown() {
  const { isAdmin } = useAuth();
  const { unreadCount, markAllAsRead } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!isAdmin) {
      setNotifications([]);
      return;
    }

    setLoading(true);

    try {
      const { notifications: data } = await fetchNotifications(5);
      setNotifications(data);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadNotifications();

    if (!isAdmin) return undefined;

    const timer = window.setInterval(loadNotifications, NAV_NOTIFICATION_POLL_MS);
    return () => window.clearInterval(timer);
  }, [isAdmin, loadNotifications]);

  const handleOpenChange = (open) => {
    if (open && unreadCount > 0) {
      markAllAsRead();
    }
  };

  if (!isAdmin) return null;

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        className="nav-icon-btn nav-icon-btn--with-badge"
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
      >
        <Bell size={20} />
        <NotificationBadge count={unreadCount} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="nav-notifications-menu">
        <div className="nav-notifications-header">Notification</div>
        {loading && notifications.length === 0 && (
          <div className="nav-notification-item nav-notification-item-status">
            Loading...
          </div>
        )}
        {!loading && notifications.length === 0 && (
          <div className="nav-notification-item nav-notification-item-status">
            No notifications
          </div>
        )}
        {notifications.map((item) => (
          <div key={item.id} className="nav-notification-item">
            <img src={item.avatar || DEFAULT_AVATAR} alt={item.author} className="nav-notification-avatar" />
            <div className="nav-notification-body">
              <p className="nav-notification-text">
                <strong>{item.author}</strong> {item.message}
              </p>
              <p className="nav-notification-time">{item.time}</p>
            </div>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenuItem({ icon: Icon, label, onClick }) {
  return (
    <DropdownMenuItem className="nav-user-menu-item" onClick={onClick}>
      <Icon size={18} className="nav-user-menu-icon" aria-hidden="true" />
      <span>{label}</span>
    </DropdownMenuItem>
  );
}

function UserMenu({ onNavigate }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const avatarSrc = user?.profilePic || DEFAULT_AVATAR;
  const displayName = user?.name || user?.username || 'Member';

  const goTo = (path) => {
    onNavigate?.();
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    onNavigate?.();
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="nav-user-menu-trigger">
        <img src={avatarSrc} alt={displayName} className="nav-user-avatar" />
        <span className="nav-user-name">{displayName}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="nav-user-menu">
        <UserMenuItem
          icon={User}
          label="Profile"
          onClick={() => goTo('/member/profile')}
        />
        <DropdownMenuSeparator className="nav-user-menu-separator" />
        <UserMenuItem
          icon={RotateCcw}
          label="Reset password"
          onClick={() => goTo('/member/reset-password')}
        />
        {isAdmin && (
          <UserMenuItem
            icon={ExternalLink}
            label="Admin panel"
            onClick={() => goTo('/admin')}
          />
        )}
        <DropdownMenuSeparator className="nav-user-menu-separator" />
        <UserMenuItem icon={LogOut} label="Log out" onClick={handleLogout} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavAuthButtons({ onNavigate, classNamePrefix = 'btn' }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="nav-auth-user">
        <NotificationDropdown />
        <UserMenu onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <>
      <Link
        to="/login"
        className={`${classNamePrefix}-login`}
        onClick={onNavigate}
      >
        Log in
      </Link>
      <Link
        to="/signup"
        className={`${classNamePrefix}-signup`}
        onClick={onNavigate}
      >
        Sign up
      </Link>
    </>
  );
}

export const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={`nav-header-group${menuOpen ? ' nav-header-group--open' : ''}`}>
      <nav className="nav-bar">
        <Link to="/" className="nav-logo">
          DogGo<span className="logo-dot">.</span>
        </Link>

        <div className="nav-bar-right">
          <div className="nav-buttons">
            <NavAuthButtons classNamePrefix="btn" />
          </div>

          <div className="nav-hamburger">
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger
                className="nav-hamburger-trigger"
                aria-label="Open menu"
              >
                <Menu size={24} strokeWidth={2} />
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="nav-mobile-panel">
          <NavAuthButtons
            classNamePrefix="nav-dropdown"
            onNavigate={() => setMenuOpen(false)}
          />
        </div>
      )}
    </header>
  );
};

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-left">
          <span className="site-footer-label">Get in touch</span>
          <div className="site-footer-icons">
            <a href="#linkedin" className="site-footer-icon" aria-label="LinkedIn">
              <LinkedinIcon size={12} />
            </a>
            <a href="#github" className="site-footer-icon" aria-label="GitHub">
              <GithubIcon size={12} />
            </a>
            <a href="#google" className="site-footer-icon site-footer-icon--text" aria-label="Google">
              G
            </a>
          </div>
        </div>
        <Link to="/" className="site-footer-link">
          Home page
        </Link>
      </div>
    </footer>
  );
};
