import axios from 'axios';
import { getStoredToken } from '@/api/authApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop';

function getErrorMessage(error) {
  return error.response?.data?.error
    || error.response?.data?.message
    || error.message
    || 'Request failed';
}

function getAuthHeaders() {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function formatNotificationTime(isoDate) {
  if (!isoDate) return '';

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function mapNotification(item) {
  return {
    id: item.id,
    author: item.author || 'User',
    avatar: item.avatar || DEFAULT_AVATAR,
    message: item.message,
    time: formatNotificationTime(item.created_at),
    link: item.link,
  };
}

export async function fetchNotifications(limit = 50) {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/notifications`, {
      params: { limit },
      headers: getAuthHeaders(),
    });
    return (data.notifications || []).map(mapNotification);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export { DEFAULT_AVATAR as NOTIFICATION_DEFAULT_AVATAR };
