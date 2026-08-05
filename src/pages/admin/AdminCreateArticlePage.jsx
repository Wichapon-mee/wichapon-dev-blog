import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminArticleForm from '@/components/admin/AdminArticleForm';
import { createAdminArticle } from '@/api/adminArticleApi';

function AdminCreateArticlePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const saveArticle = async (form, status, categories) => {
    setSaving(true);
    setFormError('');

    try {
      await createAdminArticle(form, status, categories);

      navigate('/admin/articles', {
        replace: true,
        state: {
          toast:
            status === 'Draft'
              ? {
                  title: 'Create article and saved as draft',
                  message: 'You can publish article later',
                }
              : {
                  title: 'Create article and published',
                  message: 'Your article has been successfully published',
                },
        },
      });
    } catch (err) {
      setFormError(err.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page admin-article-editor-page">
      {formError && <p className="auth-error-message">{formError}</p>}
      <AdminArticleForm
        mode="create"
        saving={saving}
        onSaveDraft={(form, categories) => saveArticle(form, 'Draft', categories)}
        onSavePublish={(form, categories) => saveArticle(form, 'Published', categories)}
      />
    </div>
  );
}

export default AdminCreateArticlePage;
