import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';
import AdminCategoryToast from '@/components/admin/AdminCategoryToast';
import { deleteCategory, fetchCategories } from '@/api/categoryApi';

function AdminCategoriesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [toast, setToast] = useState(null);

  const loadCategories = async (keyword = searchKeyword) => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchCategories(keyword.trim() || undefined);
      setCategories(data);
    } catch (err) {
      setError(err.message);
      setCategories([]);
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
    const timer = setTimeout(() => {
      loadCategories(searchKeyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const displayedCategories = useMemo(() => categories, [categories]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleteError('');

    try {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      await loadCategories();
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  return (
    <>
      <div className="admin-page">
        <header className="admin-page-header">
          <h1 className="admin-page-title">Category management</h1>
          <Link
            to="/admin/categories/create"
            className="admin-primary-btn admin-primary-btn--compact"
          >
            <Plus size={16} aria-hidden="true" />
            Create category
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
              aria-label="Search categories"
            />
          </div>
        </div>

        {error && <p className="auth-error-message">{error}</p>}

        <div className="admin-table-wrap">
          <table className="admin-table admin-table--single-column">
            <thead>
              <tr>
                <th>Category</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={2} className="admin-table-empty">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && displayedCategories.length === 0 && (
                <tr>
                  <td colSpan={2} className="admin-table-empty">
                    No categories found
                  </td>
                </tr>
              )}

              {!loading &&
                displayedCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="admin-table-title">{category.name}</td>
                    <td className="admin-table-actions">
                      <button
                        type="button"
                        className="admin-icon-btn"
                        aria-label="Edit category"
                        onClick={() => navigate(`/admin/categories/${category.id}/edit`)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className="admin-icon-btn"
                        aria-label="Delete category"
                        onClick={() => {
                          setDeleteError('');
                          setDeleteTarget(category);
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
        title="Delete category"
        message={
          deleteError
            ? deleteError
            : 'Do you want to delete this category?'
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteError('');
        }}
      />

      <AdminCategoryToast
        open={Boolean(toast)}
        title={toast?.title}
        message={toast?.message}
        onClose={() => setToast(null)}
      />
    </>
  );
}

export default AdminCategoriesPage;
