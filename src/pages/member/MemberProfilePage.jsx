import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileSavedToast from '@/components/ProfileSavedToast';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&h=240&fit=crop';

function MemberProfilePage() {
  const { user, updateUserLocal } = useAuth();
  const [form, setForm] = useState({ name: '', username: '', email: '' });
  const [showToast, setShowToast] = useState(false);

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
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateUserLocal({ name: form.name, username: form.username });
    setShowToast(true);
  };

  const avatarSrc = user?.profilePic || DEFAULT_AVATAR;

  return (
    <>
      <div className="member-page">
        <h1 className="member-page-title">Profile</h1>

        <div className="member-card">
          <div className="member-profile-avatar-row">
            <div className="member-profile-avatar">
              <img src={avatarSrc} alt={form.name || 'Profile'} />
            </div>
            <button type="button" className="member-upload-btn">
              Upload profile picture
            </button>
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

            <button type="submit" className="member-save-btn">
              Save
            </button>
          </form>
        </div>
      </div>

      <ProfileSavedToast open={showToast} onClose={() => setShowToast(false)} />
    </>
  );
}

export default MemberProfilePage;
