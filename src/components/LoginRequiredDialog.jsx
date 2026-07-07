import React from 'react';
import { X } from 'lucide-react';

function LoginRequiredDialog({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="login-dialog-overlay" onClick={onClose} role="presentation">
      <div
        className="login-dialog"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-dialog-title"
      >
        <button
          type="button"
          className="login-dialog-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <h2 id="login-dialog-title" className="login-dialog-title">
          Create an account to continue
        </h2>

        <button type="button" className="login-dialog-create-btn">
          Create account
        </button>

        <p className="login-dialog-footer">
          Already have an account?{' '}
          <button type="button" className="login-dialog-login-link">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginRequiredDialog;
