import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';
import AdminArticleToast from '@/components/admin/AdminArticleToast';
import {
  ARTICLE_STATUSES,
  deleteAdminArticle,
  fetchAdminArticles,
  getStatusClassName,
} from '@/api/adminArticleApi';
import { fetchCategories } from '@/api/categoryApi';

function AdminArticlesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [toast, setToast] = useState(null);

  const loadArticles = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchAdminArticles({
        keyword: searchKeyword,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
      });
      setArticles(data);
    } catch (err) {
      setError(err.message);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      loadArticles();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchKeyword, statusFilter, categoryFilter]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleteError('');

    try {
      await deleteAdminArticle(deleteTarget.id);
      setDeleteTarget(null);
      await loadArticles();
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  return (
    <>
      <div className="admin-page">
        <header className="admin-page-header">
          <h1 className="admin-page-title">Article management</h1>
          <Link to="/admin/articles/create" className="admin-primary-btn admin-primary-btn--compact">
            <Plus size={16} aria-hidden="true" />
            Create article
          </Link>
        </header>

        <div className="admin-toolbar">
          <div className="admin-search">
            <Search size={16} className="admin-search-icon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search..."
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              aria-label="Search articles"
            />
          </div>
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="">Status</option>
            {ARTICLE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            className="admin-select"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            aria-label="Filter by category"
          >
            <option value="">Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="auth-error-message">{error}</p>}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Article title</th>
                <th>Category</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="admin-table-empty">
                    Loading articles...
                  </td>
                </tr>
              )}
              {!loading && articles.length === 0 && (
                <tr>
                  <td colSpan={4} className="admin-table-empty">
                    No articles found
                  </td>
                </tr>
              )}
              {!loading && articles.map((article) => (
                <tr key={article.id}>
                  <td className="admin-table-title">{article.title}</td>
                  <td>{article.category}</td>
                  <td>
                    <span
                      className={`admin-status admin-status--${getStatusClassName(article.status)}`}
                    >
                      <span className="admin-status-dot" aria-hidden="true" />
                      {article.status}
                    </span>
                  </td>
                  <td className="admin-table-actions">
                    <button
                      type="button"
                      className="admin-icon-btn"
                      aria-label="Edit article"
                      onClick={() => navigate(`/admin/articles/${article.id}/edit`)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn"
                      aria-label="Delete article"
                      onClick={() => {
                        setDeleteError('');
                        setDeleteTarget(article);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete article"
        message={deleteError || 'Do you want to delete this article?'}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteError('');
        }}
      />

      <AdminArticleToast
        open={Boolean(toast)}
        title={toast?.title}
        message={toast?.message}
        onClose={() => setToast(null)}
      />
    </>
  );
}

export default AdminArticlesPage;
