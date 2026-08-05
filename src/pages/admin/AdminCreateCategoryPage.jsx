import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCategory } from '@/api/categoryApi';

function AdminCreateCategoryPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFieldError('');
    setFormError('');

    if (!name.trim()) {
      setFieldError('Category name is required');
      return;
    }

    setSaving(true);

    try {
      await createCategory(name.trim());
      navigate('/admin/categories', {
        replace: true,
        state: {
          toast: {
            title: 'Create category',
            message: 'Category has been successfully created',
          },
        },
      });
    } catch (err) {
      const message = err.message || 'Failed to create category';
      if (message.toLowerCase().includes('category')) {
        setFieldError(message);
      } else {
        setFormError(message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page admin-category-editor-page">
      <form className="admin-category-form" onSubmit={handleSubmit}>
        <div className="admin-article-form-header">
          <h1 className="admin-page-title">Create category</h1>
          <button type="submit" className="admin-primary-btn" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {formError && <p className="auth-error-message">{formError}</p>}

        <div className="admin-form-field admin-category-name-field">
          <label htmlFor="category-name">Category name</label>
          <input
            id="category-name"
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setFieldError('');
              setFormError('');
            }}
          />
          {fieldError && <p className="field-error">{fieldError}</p>}
        </div>
      </form>
    </div>
  );
}

export default AdminCreateCategoryPage;
