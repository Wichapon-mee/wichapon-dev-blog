import React from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';

// ข้อมูล mock — รอเชื่อม API ในอนาคต
const mockArticles = [
  {
    id: 1,
    title: 'Understanding Cat Behavior: Why Your Feline Friend Acts the Way They Do',
    category: 'Cat',
    status: 'Published',
  },
  {
    id: 2,
    title: 'The Art of Mindfulness: Finding Peace in a Busy World',
    category: 'General',
    status: 'Published',
  },
  {
    id: 3,
    title: 'The Secret Language of Cats: Decoding Feline Communication',
    category: 'Cat',
    status: 'Published',
  },
  {
    id: 4,
    title: 'Embracing Change: How to Thrive in Times of Transition',
    category: 'Inspiration',
    status: 'Published',
  },
  {
    id: 5,
    title: 'The Future of Work: Adapting to a Digital-First Economy',
    category: 'General',
    status: 'Published',
  },
  {
    id: 6,
    title: 'The Power of Habits: Small Changes, Big Results',
    category: 'Inspiration',
    status: 'Published',
  },
];

function AdminArticlesPage() {
  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-page-title">Article management</h1>
        <button type="button" className="admin-primary-btn admin-primary-btn--compact">
          <Plus size={16} aria-hidden="true" />
          Create article
        </button>
      </header>

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} className="admin-search-icon" aria-hidden="true" />
          <input type="text" placeholder="Search..." disabled />
        </div>
        <select className="admin-select" disabled defaultValue="">
          <option value="" disabled>Status</option>
        </select>
        <select className="admin-select" disabled defaultValue="">
          <option value="" disabled>Category</option>
        </select>
      </div>

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
            {mockArticles.map((article) => (
              <tr key={article.id}>
                <td className="admin-table-title">{article.title}</td>
                <td>{article.category}</td>
                <td>
                  <span className="admin-status">
                    <span className="admin-status-dot" aria-hidden="true" />
                    {article.status}
                  </span>
                </td>
                <td className="admin-table-actions">
                  <button type="button" className="admin-icon-btn" aria-label="Edit article">
                    <Pencil size={16} />
                  </button>
                  <button type="button" className="admin-icon-btn" aria-label="Delete article">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminArticlesPage;
