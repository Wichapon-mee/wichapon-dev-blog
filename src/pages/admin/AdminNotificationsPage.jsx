import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications } from '@/api/notificationApi';
import { useNotifications } from '@/contexts/NotificationContext';

const POLL_INTERVAL_MS = 30000;

function AdminNotificationsPage() {
  const navigate = useNavigate();
  const { markAllAsRead } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }
    setError('');

    try {
      const { notifications: data } = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err.message);
      setNotifications([]);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    markAllAsRead();
    loadNotifications(true);

    const timer = window.setInterval(() => {
      loadNotifications(false);
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [loadNotifications, markAllAsRead]);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-page-title">Notification</h1>
      </header>

      {error && <p className="auth-error-message">{error}</p>}

      <div className="admin-notifications-list">
        {loading && (
          <p className="admin-table-empty">Loading notifications...</p>
        )}

        {!loading && notifications.length === 0 && !error && (
          <p className="admin-table-empty">No notifications found</p>
        )}

        {!loading && notifications.map((item) => (
          <article key={item.id} className="admin-notification-item">
            <img
              src={item.avatar}
              alt={item.author}
              className="admin-notification-avatar"
            />
            <div className="admin-notification-body">
              <p className="admin-notification-text">
                <strong>{item.author}</strong> {item.message}
              </p>
              <p className="admin-notification-time">{item.time}</p>
            </div>
            <button
              type="button"
              className="admin-outline-btn admin-notification-view-btn"
              onClick={() => navigate(item.link)}
            >
              View
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

export default AdminNotificationsPage;
