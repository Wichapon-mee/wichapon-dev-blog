import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile, uploadProfilePicture } from '@/api/authApi';
import ProfileSavedToast from '@/components/ProfileSavedToast';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&h=240&fit=crop';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

function MemberProfilePage() {
  const { user, token, refreshUser } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({ name: '', username: '', email: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
    });
  }, [user]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    setFormError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setFieldErrors({});

    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.username.trim()) errors.username = 'Username is required';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);

    try {
      await updateProfile(token, {
        name: form.name.trim(),
        username: form.username.trim(),
      });
      await refreshUser();
      setShowToast(true);
    } catch (err) {
      const message = err.message || 'Failed to save profile';
      if (message.toLowerCase().includes('username')) {
        setFieldErrors({ username: message });
      } else {
        setFormError(message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select an image file');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setFormError('Image must be smaller than 2MB');
      return;
    }

    setUploading(true);
    setFormError('');

    try {
      const dataUrl = await readFileAsDataUrl(file);
      await uploadProfilePicture(token, dataUrl);
      await refreshUser();
      setShowToast(true);
    } catch (err) {
      setFormError(err.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const avatarSrc = user?.profilePic || DEFAULT_AVATAR;

  return (
    <>
      <div className="member-page">
        <h1 className="member-page-title">Profile</h1>

        <div className="member-card">
          {formError && <p className="auth-error-message">{formError}</p>}

          <div className="member-profile-avatar-row">
            <div className="member-profile-avatar">
              <img src={avatarSrc} alt={form.name || 'Profile'} />
            </div>
            <div className="member-upload-group">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="member-upload-input"
                onChange={handleFileChange}
                aria-hidden="true"
                tabIndex={-1}
              />
              <button
                type="button"
                className="member-upload-btn"
                onClick={handleUploadClick}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload profile picture'}
              </button>
            </div>
          </div>

          <form className="member-profile-form" onSubmit={handleSubmit}>
            <div className="member-form-field">
              <label htmlFor="member-name">Name</label>
              <input
                id="member-name"
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                required
              />
              {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
            </div>

            <div className="member-form-field">
              <label htmlFor="member-username">Username</label>
              <input
                id="member-username"
                type="text"
                value={form.username}
                onChange={handleChange('username')}
                required
              />
              {fieldErrors.username && (
                <p className="field-error">{fieldErrors.username}</p>
              )}
            </div>

            <div className="member-form-field">
              <label htmlFor="member-email">Email</label>
              <input
                id="member-email"
                type="email"
                value={form.email}
                disabled
                readOnly
              />
            </div>

            <button type="submit" className="member-save-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
      </div>

      <ProfileSavedToast open={showToast} onClose={() => setShowToast(false)} />
    </>
  );
}

export default MemberProfilePage;
