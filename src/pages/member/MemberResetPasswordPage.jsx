import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { resetPassword } from '@/api/authApi';
import ConfirmDialog from '@/components/ConfirmDialog';

function MemberResetPasswordPage() {
  const { token } = useAuth();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    setFormError('');
    setSuccess('');
  };

  const validateForm = () => {
    const errors = {};

    if (!form.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!form.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (form.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (form.confirmPassword !== form.newPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError('');
    setSuccess('');

    if (!validateForm()) return;

    setShowConfirm(true);
  };

  const handleConfirmReset = async () => {
    setShowConfirm(false);
    setLoading(true);
    setFormError('');
    setSuccess('');

    try {
      const data = await resetPassword(token, {
        oldPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(data.message || 'Password updated successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="member-page">
        <h1 className="member-page-title">Reset password</h1>

        <div className="member-card">
          {formError && <p className="auth-error-message">{formError}</p>}
          {success && <p className="auth-success-message">{success}</p>}

          <form className="member-profile-form" onSubmit={handleSubmit}>
            <div className="member-form-field">
              <label htmlFor="current-password">Current password</label>
              <input
                id="current-password"
                type="password"
                placeholder="Current password"
                value={form.currentPassword}
                onChange={handleChange('currentPassword')}
                autoComplete="current-password"
              />
              {fieldErrors.currentPassword && (
                <p className="field-error">{fieldErrors.currentPassword}</p>
              )}
            </div>

            <div className="member-form-field">
              <label htmlFor="new-password">New password</label>
              <input
                id="new-password"
                type="password"
                placeholder="New password"
                value={form.newPassword}
                onChange={handleChange('newPassword')}
                autoComplete="new-password"
              />
              {fieldErrors.newPassword && (
                <p className="field-error">{fieldErrors.newPassword}</p>
              )}
            </div>

            <div className="member-form-field">
              <label htmlFor="confirm-password">Confirm new password</label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                autoComplete="new-password"
              />
              {fieldErrors.confirmPassword && (
                <p className="field-error">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button type="submit" className="member-save-btn" disabled={loading}>
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

export default MemberResetPasswordPage;
