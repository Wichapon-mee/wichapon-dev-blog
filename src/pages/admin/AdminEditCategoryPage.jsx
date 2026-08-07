import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCategoryById, updateCategory } from '@/api/categoryApi';

function AdminEditCategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [fieldError, setFieldError] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCategory = async () => {
      setLoading(true);
      setFormError('');

      try {
        const category = await fetchCategoryById(categoryId);
        setName(category.name || '');
      } catch (err) {
        setFormError(err.message || 'Failed to load category');
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [categoryId]);

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
      await updateCategory(categoryId, name.trim());
      navigate('/admin/categories', {
        replace: true,
        state: {
          toast: {
            title: 'Update category',
            message: 'Category has been successfully updated',
          },
        },
      });
    } catch (err) {
      const message = err.message || 'Failed to update category';
      if (message.toLowerCase().includes('category')) {
        setFieldError(message);
      } else {
        setFormError(message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-table-empty">Loading...</p>
      </div>
    );
  }

  if (formError && !name) {
    return (
      <div className="admin-page">
        <p className="auth-error-message">{formError}</p>
      </div>
    );
  }

  return (
    <div className="admin-page admin-category-editor-page">
      <form className="admin-category-form" onSubmit={handleSubmit}>
        <div className="admin-article-form-header">
          <h1 className="admin-page-title">Edit category</h1>
          <button type="submit" className="admin-primary-btn" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {formError && name && <p className="auth-error-message">{formError}</p>}

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

export default AdminEditCategoryPage;
