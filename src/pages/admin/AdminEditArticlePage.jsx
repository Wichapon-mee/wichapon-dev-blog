import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminArticleForm from '@/components/admin/AdminArticleForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import {
  deleteAdminArticle,
  fetchAdminArticleById,
  updateAdminArticle,
} from '@/api/adminArticleApi';

function AdminEditArticlePage() {
  const { articleId } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      setLoadError('');

      try {
        const data = await fetchAdminArticleById(articleId);
        setArticle(data);
      } catch (err) {
        setLoadError(err.message);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);

  if (loading) {
    return (
      <div className="admin-page">
        <p>Loading article...</p>
      </div>
    );
  }

  if (loadError || !article) {
    return (
      <div className="admin-page">
        <p className="auth-error-message">{loadError || 'Article not found.'}</p>
      </div>
    );
  }

  const saveArticle = async (form, status, categories) => {
    setSaving(true);
    setFormError('');

    try {
      await updateAdminArticle(article.id, form, status, categories);

      navigate('/admin/articles', {
        replace: true,
        state: {
          toast:
            status === 'Draft'
              ? {
                  title: 'Saved as draft',
                  message: 'Your article has been saved as draft',
                }
              : {
                  title: 'Article published',
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

  const handleConfirmDelete = async () => {
    setDeleteError('');

    try {
      await deleteAdminArticle(article.id);
      setShowDeleteConfirm(false);
      navigate('/admin/articles', { replace: true });
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  return (
    <>
      <div className="admin-page admin-article-editor-page">
        {formError && <p className="auth-error-message">{formError}</p>}
        <AdminArticleForm
          key={article.id}
          mode="edit"
          initialValues={{
            image: article.image,
            category: article.category,
            author: article.author,
            title: article.title,
            description: article.description,
            content: article.content,
          }}
          saving={saving}
          onSaveDraft={(form, categories) => saveArticle(form, 'Draft', categories)}
          onSavePublish={(form, categories) => saveArticle(form, 'Published', categories)}
          onDelete={() => {
            setDeleteError('');
            setShowDeleteConfirm(true);
          }}
        />
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete article"
        message={deleteError || 'Do you want to delete this article?'}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeleteError('');
        }}
      />
    </>
  );
}

export default AdminEditArticlePage;
