import React, { useState } from 'react';

const BIO_MAX_LENGTH = 120;

// ข้อมูล mock — รอเชื่อม database / API ในอนาคต
const initialProfile = {
  name: 'Thompson P.',
  username: 'thompson',
  email: 'thompson.p@gmail.com',
  bio: 'I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.',
};

function AdminProfilePage() {
  const [profile, setProfile] = useState(initialProfile);

  const handleChange = (field) => (event) => {
    let { value } = event.target;

    if (field === 'bio' && value.length > BIO_MAX_LENGTH) {
      value = value.slice(0, BIO_MAX_LENGTH);
    }

    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: ส่งข้อมูลไป API เมื่อมีระบบ login + database
  };

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
        <div className="admin-profile-avatar-row">
          <div className="admin-profile-avatar">
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&h=240&fit=crop"
              alt={profile.name}
            />
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
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="profile-username">Username</label>
            <input
              id="profile-username"
              type="text"
              value={profile.username}
              onChange={handleChange('username')}
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="profile-email">Email</label>
            <input
              id="profile-email"
              type="email"
              value={profile.email}
              onChange={handleChange('email')}
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
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminProfilePage;
