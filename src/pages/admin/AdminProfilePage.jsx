import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const BIO_MAX_LENGTH = 120;

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&h=240&fit=crop';

function AdminProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
  });
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    setProfile({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      bio: '',
    });
  }, [user]);

  const handleChange = (field) => (event) => {
    let { value } = event.target;

    if (field === 'bio' && value.length > BIO_MAX_LENGTH) {
      value = value.slice(0, BIO_MAX_LENGTH);
    }

    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaveMessage('');

    try {
      await refreshUser();
      setSaveMessage('Profile refreshed from server.');
    } catch {
      setSaveMessage('Could not refresh profile. Please try again.');
    }
  };

  const avatarSrc = user?.profilePic || DEFAULT_AVATAR;

  return (
    <div className="admin-page admin-profile-page">
      <header className="admin-page-header admin-profile-header">
        <h1 className="admin-page-title">Profile</h1>
        <button
          type="submit"
          form="admin-profile-form"
          className="admin-primary-btn admin-profile-save-btn"
        >
          Save
        </button>
      </header>

      <div className="admin-profile-body">
        {saveMessage && <p className="auth-success-message">{saveMessage}</p>}

        <div className="admin-profile-avatar-row">
          <div className="admin-profile-avatar">
            <img src={avatarSrc} alt={profile.name || 'Profile'} />
          </div>
          <button type="button" className="admin-profile-upload-btn">
            Upload profile picture
          </button>
        </div>

        <hr className="admin-profile-divider" />

        <form id="admin-profile-form" className="admin-profile-form" onSubmit={handleSubmit}>
          <div className="admin-form-field">
            <label htmlFor="profile-name">Name</label>
            <input
              id="profile-name"
              type="text"
              value={profile.name}
              onChange={handleChange('name')}
              readOnly
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="profile-username">Username</label>
            <input
              id="profile-username"
              type="text"
              value={profile.username}
              onChange={handleChange('username')}
              readOnly
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="profile-email">Email</label>
            <input
              id="profile-email"
              type="email"
              value={profile.email}
              onChange={handleChange('email')}
              readOnly
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="profile-bio">Bio (max 120 letters)</label>
            <textarea
              id="profile-bio"
              rows={4}
              value={profile.bio}
              onChange={handleChange('bio')}
              maxLength={BIO_MAX_LENGTH}
              placeholder="Bio update API not available yet"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminProfilePage;
