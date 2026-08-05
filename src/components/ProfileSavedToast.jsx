import React, { useEffect } from 'react';
import { X } from 'lucide-react';

function ProfileSavedToast({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;

    const timer = window.setTimeout(onClose, 4000);
    return () => window.clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="profile-saved-toast" role="status" aria-live="polite">
      <div className="profile-saved-toast-content">
        <p className="profile-saved-toast-title">Saved profile</p>
        <p className="profile-saved-toast-text">
          Your profile has been successfully updated
        </p>
      </div>
      <button
        type="button"
        className="profile-saved-toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default ProfileSavedToast;
