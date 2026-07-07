import React, { useEffect } from 'react';
import { X } from 'lucide-react';

function CopyToast({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;

    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="copy-toast" role="status" aria-live="polite">
      <button
        type="button"
        className="copy-toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
      <p className="copy-toast-title">Copied!</p>
      <p className="copy-toast-message">
        This article has been copied to your clipboard.
      </p>
    </div>
  );
}

export default CopyToast;
