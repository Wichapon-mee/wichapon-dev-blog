import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { fetchUnreadCount, markAllNotificationsRead } from '@/api/notificationApi';
import { useAuth } from '@/contexts/AuthContext';

const POLL_INTERVAL_MS = 30000;

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAdmin } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    if (!isAdmin) {
      setUnreadCount(0);
      return;
    }

    try {
      const count = await fetchUnreadCount();
      setUnreadCount(count);
    } catch {
      setUnreadCount(0);
    }
  }, [isAdmin]);

  const markAllAsRead = useCallback(async () => {
    if (!isAdmin) return;

    try {
      await markAllNotificationsRead();
      setUnreadCount(0);
    } catch {
      await refreshUnreadCount();
    }
  }, [isAdmin, refreshUnreadCount]);

  useEffect(() => {
    refreshUnreadCount();

    if (!isAdmin) return undefined;

    const timer = window.setInterval(refreshUnreadCount, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isAdmin, refreshUnreadCount]);

  const value = useMemo(
    () => ({ unreadCount, refreshUnreadCount, markAllAsRead }),
    [unreadCount, refreshUnreadCount, markAllAsRead],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }

  return context;
}
