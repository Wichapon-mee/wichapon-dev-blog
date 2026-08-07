import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getStoredToken, updateProfile, uploadProfilePicture } from '@/api/authApi';
import ProfileSavedToast from '@/components/ProfileSavedToast';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&h=240&fit=crop';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const BIO_MAX_LENGTH = 120;

function AdminProfilePage() {
  const { user, token, refreshUser } = useAuth();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setProfile({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      bio: (user.bio || '').slice(0, BIO_MAX_LENGTH),
    });
  }, [user]);

  const handleChange = (field) => (event) => {
    let { value } = event.target;

    if (field === 'bio' && value.length > BIO_MAX_LENGTH) {
      value = value.slice(0, BIO_MAX_LENGTH);
    }

    setProfile((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    setFormError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setFieldErrors({});

    const errors = {};
    if (!profile.name.trim()) errors.name = 'Name is required';
    if (!profile.username.trim()) errors.username = 'Username is required';
    if (profile.bio.length > BIO_MAX_LENGTH) {
      errors.bio = `Bio must be at most ${BIO_MAX_LENGTH} characters`;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const accessToken = token || getStoredToken();
    if (!accessToken) {
      setFormError('You must be logged in to save your profile');
      return;
    }

    setSaving(true);

    try {
      await updateProfile(accessToken, {
        name: profile.name.trim(),
        username: profile.username.trim(),
        bio: profile.bio.trim(),
      });
      await refreshUser();
      setShowToast(true);
    } catch (err) {
      const message = err.message || 'Failed to save profile';
      if (message.toLowerCase().includes('username')) {
        setFieldErrors({ username: message });
      } else if (message.toLowerCase().includes('bio')) {
        setFieldErrors({ bio: message });
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

    const accessToken = token || getStoredToken();
    if (!accessToken) {
      setFormError('You must be logged in to upload a profile picture');
      return;
    }

    setUploading(true);
    setFormError('');

    try {
      await uploadProfilePicture(accessToken, file);
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
      <form className="admin-page admin-profile-page" onSubmit={handleSubmit}>
        <header className="admin-page-header admin-profile-header">
          <h1 className="admin-page-title">Profile</h1>
          <button
            type="submit"
            className="admin-primary-btn admin-profile-save-btn"
            disabled={saving || uploading}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </header>

        <div className="admin-profile-body">
          {formError && <p className="auth-error-message">{formError}</p>}

          <div className="admin-profile-avatar-row">
            <div className="admin-profile-avatar">
              <img src={avatarSrc} alt={profile.name || 'Profile'} />
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
                className="admin-profile-upload-btn"
                onClick={handleUploadClick}
                disabled={uploading || saving}
              >
                {uploading ? 'Uploading...' : 'Upload profile picture'}
              </button>
            </div>
          </div>

          <hr className="admin-profile-divider" />

          <div className="admin-profile-form">
            <div className="admin-form-field">
              <label htmlFor="profile-name">Name</label>
              <input
                id="profile-name"
                type="text"
                value={profile.name}
                onChange={handleChange('name')}
              />
              {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
            </div>

            <div className="admin-form-field">
              <label htmlFor="profile-username">Username</label>
              <input
                id="profile-username"
                type="text"
                value={profile.username}
                onChange={handleChange('username')}
              />
              {fieldErrors.username && (
                <p className="field-error">{fieldErrors.username}</p>
              )}
            </div>

            <div className="admin-form-field">
              <label htmlFor="profile-email">Email</label>
              <input
                id="profile-email"
                type="email"
                value={profile.email}
                disabled
                readOnly
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="profile-bio">Bio (max {BIO_MAX_LENGTH} letters)</label>
              <textarea
                id="profile-bio"
                rows={4}
                placeholder="Bio"
                value={profile.bio}
                onChange={handleChange('bio')}
                maxLength={BIO_MAX_LENGTH}
              />
              {fieldErrors.bio && <p className="field-error">{fieldErrors.bio}</p>}
            </div>
          </div>
        </div>
      </form>

      <ProfileSavedToast open={showToast} onClose={() => setShowToast(false)} />
    </>
  );
}

export default AdminProfilePage;
