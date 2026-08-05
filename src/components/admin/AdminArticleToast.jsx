import React, { useEffect } from 'react';
import { X } from 'lucide-react';

function AdminArticleToast({ open, title, message, onClose }) {
  useEffect(() => {
    if (!open) return undefined;

    const timer = window.setTimeout(onClose, 4000);
    return () => window.clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="admin-article-toast" role="status" aria-live="polite">
      <div className="admin-article-toast-content">
        <p className="admin-article-toast-title">{title}</p>
        <p className="admin-article-toast-text">{message}</p>
      </div>
      <button
        type="button"
        className="admin-article-toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default AdminArticleToast;
