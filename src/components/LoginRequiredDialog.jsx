import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

function LoginRequiredDialog({ open, onClose, returnTo }) {
  const location = useLocation();
  const redirectTo = returnTo || location.pathname;

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

        <Link
          to="/signup"
          state={{ from: redirectTo }}
          className="login-dialog-create-btn"
          onClick={onClose}
        >
          Create account
        </Link>

        <p className="login-dialog-footer">
          Already have an account?{' '}
          <Link
            to="/login"
            state={{ from: redirectTo }}
            className="login-dialog-login-link"
            onClick={onClose}
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginRequiredDialog;
