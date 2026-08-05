import React from 'react';

function AdminPlaceholderPage({ title, description }) {
  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-page-title">{title}</h1>
      </header>
      <div className="admin-placeholder">
        <p>{description}</p>
      </div>
    </div>
  );
}

export default AdminPlaceholderPage;
