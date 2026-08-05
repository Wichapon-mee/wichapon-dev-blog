import React, { useEffect, useRef, useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { fetchCategories } from '@/api/categoryApi';
import { useAuth } from '@/contexts/AuthContext';

const INTRO_MAX_LENGTH = 120;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const EMPTY_FORM = {
  image: '',
  category: '',
  author: '',
  title: '',
  description: '',
  content: '',
};

function normalizeFormValues(values, fallbackAuthor = '') {
  return {
    ...EMPTY_FORM,
    ...values,
    author: values.author || fallbackAuthor || '',
    description: (values.description || '').slice(0, INTRO_MAX_LENGTH),
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

function AdminArticleForm({
  mode = 'create',
  initialValues = EMPTY_FORM,
  onSaveDraft,
  onSavePublish,
  onDelete,
  saving = false,
}) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(() => normalizeFormValues(initialValues, user?.name));
  const [categories, setCategories] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (mode === 'create' && user?.name && !form.author) {
      setForm((prev) => ({ ...prev, author: user.name }));
    }
  }, [mode, user?.name, form.author]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch {
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!form.category) errors.category = 'Category is required';
    if (!form.author.trim()) errors.author = 'Author name is required';
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.image) errors.image = 'Thumbnail image is required';
    if (!form.description.trim()) errors.description = 'Introduction is required';
    if (form.description.length > INTRO_MAX_LENGTH) {
      errors.description = `Introduction must be at most ${INTRO_MAX_LENGTH} characters`;
    }
    if (!form.content.trim()) errors.content = 'Content is required';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field) => (event) => {
    let { value } = event.target;

    if (field === 'description' && value.length > INTRO_MAX_LENGTH) {
      value = value.slice(0, INTRO_MAX_LENGTH);
    }

    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    setFormError('');
  };

  const handleSubmit = (status) => async (event) => {
    event.preventDefault();
    setFormError('');

    if (!validateForm()) return;

    const payload = normalizeFormValues(form);

    if (status === 'Draft') {
      await onSaveDraft?.(payload, categories);
    } else {
      await onSavePublish?.(payload, categories);
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
      setForm((prev) => ({ ...prev, image: dataUrl }));
    } catch (err) {
      setFormError(err.message || 'Failed to upload thumbnail');
    } finally {
      setUploading(false);
    }
  };

  const thumbnailSrc = form.image;

  return (
    <form className="admin-article-form" onSubmit={(event) => event.preventDefault()}>
      {formError && <p className="auth-error-message">{formError}</p>}

      <div className="admin-article-form-header">
        <h1 className="admin-page-title">
          {mode === 'create' ? 'Create article' : 'Edit article'}
        </h1>
        <div className="admin-article-form-actions">
          <button
            type="button"
            className="admin-outline-btn"
            disabled={saving || uploading}
            onClick={handleSubmit('Draft')}
          >
            {saving ? 'Saving...' : 'Save as draft'}
          </button>
          <button
            type="button"
            className="admin-primary-btn"
            disabled={saving || uploading}
            onClick={handleSubmit('Published')}
          >
            {saving
              ? 'Saving...'
              : mode === 'create'
                ? 'Save and publish'
                : 'Save'}
          </button>
        </div>
      </div>

      <div className="admin-article-form-body">
        <div className="admin-form-field">
          <label>Thumbnail image</label>
          <div className="admin-article-thumbnail-row">
            <div className="admin-article-thumbnail">
              {thumbnailSrc ? (
                <img src={thumbnailSrc} alt="Article thumbnail preview" />
              ) : (
                <div className="admin-article-thumbnail-placeholder">
                  <ImageIcon size={32} aria-hidden="true" />
                </div>
              )}
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
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload thumbnail image'}
              </button>
            </div>
          </div>
          {fieldErrors.image && <p className="field-error">{fieldErrors.image}</p>}
        </div>

        <div className="admin-form-field">
          <label htmlFor="article-category">Category</label>
          <select
            id="article-category"
            className="admin-select admin-select--full"
            value={form.category}
            onChange={handleChange('category')}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {fieldErrors.category && <p className="field-error">{fieldErrors.category}</p>}
        </div>

        <div className="admin-form-field">
          <label htmlFor="article-author">Author name</label>
          <input
            id="article-author"
            type="text"
            placeholder="Author name"
            value={form.author}
            onChange={handleChange('author')}
          />
          {fieldErrors.author && <p className="field-error">{fieldErrors.author}</p>}
        </div>

        <div className="admin-form-field">
          <label htmlFor="article-title">Title</label>
          <input
            id="article-title"
            type="text"
            placeholder="Article title"
            value={form.title}
            onChange={handleChange('title')}
          />
          {fieldErrors.title && <p className="field-error">{fieldErrors.title}</p>}
        </div>

        <div className="admin-form-field">
          <label htmlFor="article-description">
            Introduction (max {INTRO_MAX_LENGTH} letters)
          </label>
          <textarea
            id="article-description"
            rows={3}
            placeholder="Introduction"
            value={form.description}
            onChange={handleChange('description')}
            maxLength={INTRO_MAX_LENGTH}
          />
          {fieldErrors.description && (
            <p className="field-error">{fieldErrors.description}</p>
          )}
        </div>

        <div className="admin-form-field">
          <label htmlFor="article-content">Content</label>
          <textarea
            id="article-content"
            rows={12}
            placeholder="Content"
            value={form.content}
            onChange={handleChange('content')}
          />
          {fieldErrors.content && <p className="field-error">{fieldErrors.content}</p>}
        </div>

        {mode === 'edit' && (
          <button
            type="button"
            className="admin-delete-article-btn"
            onClick={onDelete}
            disabled={saving}
          >
            Delete article
          </button>
        )}
      </div>
    </form>
  );
}

export default AdminArticleForm;
