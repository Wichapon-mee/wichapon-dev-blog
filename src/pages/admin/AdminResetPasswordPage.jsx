import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { resetPassword } from '@/api/authApi';
import ConfirmDialog from '@/components/ConfirmDialog';

function AdminResetPasswordPage() {
  const { token } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validateForm = () => {
    const errors = {};

    if (!oldPassword) {
      errors.oldPassword = 'Old password is required';
    }

    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setShowConfirm(true);
  };

  const handleConfirmReset = async () => {
    setShowConfirm(false);
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await resetPassword(token, { oldPassword, newPassword });
      setSuccess(data.message || 'Password updated successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="admin-page">
        <header className="admin-page-header">
          <h1 className="admin-page-title">Reset password</h1>
        </header>

        <div className="admin-reset-password-card">
          {error && <p className="auth-error-message">{error}</p>}
          {success && <p className="auth-success-message">{success}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="old-password">Old password</label>
              <input
                id="old-password"
                type="password"
                value={oldPassword}
                onChange={(event) => {
                  setOldPassword(event.target.value);
                  setFieldErrors((prev) => ({ ...prev, oldPassword: '' }));
                  setError('');
                  setSuccess('');
                }}
                autoComplete="current-password"
              />
              {fieldErrors.oldPassword && (
                <p className="field-error">{fieldErrors.oldPassword}</p>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="new-password">New password</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  setFieldErrors((prev) => ({ ...prev, newPassword: '' }));
                  setError('');
                  setSuccess('');
                }}
                autoComplete="new-password"
              />
              {fieldErrors.newPassword && (
                <p className="field-error">{fieldErrors.newPassword}</p>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="confirm-password">Confirm new password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  setError('');
                  setSuccess('');
                }}
                autoComplete="new-password"
              />
              {fieldErrors.confirmPassword && (
                <p className="field-error">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Updating...' : 'Reset password'}
            </button>
          </form>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Reset password"
        message="Do you want to reset your password?"
        confirmLabel="Reset"
        cancelLabel="Cancel"
        onConfirm={handleConfirmReset}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}

export default AdminResetPasswordPage;
