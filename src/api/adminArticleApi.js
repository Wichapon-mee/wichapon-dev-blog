import axios from 'axios';
import { getStoredToken } from '@/api/authApi';
import { fetchCategories } from '@/api/categoryApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ARTICLE_STATUSES = ['Published', 'Draft'];

const STATUS_TO_ID = {
  Draft: 1,
  Published: 2,
};

const STATUS_TO_QUERY = {
  Draft: 'draft',
  Published: 'publish',
};

function getErrorMessage(error) {
  return error.response?.data?.error
    || error.response?.data?.message
    || error.message
    || 'Request failed';
}

function getAuthHeaders() {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function normalizeArticleStatus(status) {
  if (!status) return 'Draft';

  const normalized = String(status).toLowerCase();

  if (normalized === 'publish' || normalized === 'published') {
    return 'Published';
  }

  if (normalized === 'draft') {
    return 'Draft';
  }

  return status;
}

export function getStatusClassName(status) {
  const label = normalizeArticleStatus(status);
  return label.toLowerCase();
}

function statusLabelToId(statusLabel) {
  return STATUS_TO_ID[statusLabel] ?? STATUS_TO_ID.Draft;
}

async function resolveCategoryId(categoryName, categories) {
  const list = categories || await fetchCategories();
  const match = list.find(
    (category) => category.name.toLowerCase() === categoryName.toLowerCase(),
  );

  if (!match) {
    throw new Error('Selected category was not found');
  }

  return match.id;
}

function mapPostToAdminArticle(post) {
  return {
    id: post.id,
    image: post.image,
    title: post.title,
    category: post.category,
    status: normalizeArticleStatus(post.status),
    author: post.author || '',
    description: post.description,
    content: post.content,
  };
}

export async function fetchAdminArticles({
  keyword,
  category,
  status,
  page = 1,
  limit = 100,
} = {}) {
  try {
    const params = { page, limit };

    if (keyword?.trim()) params.keyword = keyword.trim();
    if (category) params.category = category;
    if (status) params.status = STATUS_TO_QUERY[status] || status.toLowerCase();

    const { data } = await axios.get(`${API_BASE_URL}/posts`, { params });
    return (data.posts || []).map(mapPostToAdminArticle);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function fetchAdminArticleById(articleId) {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/posts/${articleId}`);
    return mapPostToAdminArticle(data);
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }

    throw new Error(getErrorMessage(error));
  }
}

export async function createAdminArticle(form, statusLabel, categories) {
  try {
    const categoryId = await resolveCategoryId(form.category, categories);

    await axios.post(
      `${API_BASE_URL}/posts`,
      {
        title: form.title.trim(),
        image: form.image,
        category_id: categoryId,
        description: form.description.trim(),
        content: form.content.trim(),
        status_id: statusLabelToId(statusLabel),
      },
      { headers: getAuthHeaders() },
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateAdminArticle(articleId, form, statusLabel, categories) {
  try {
    const categoryId = await resolveCategoryId(form.category, categories);

    await axios.put(
      `${API_BASE_URL}/posts/${articleId}`,
      {
        title: form.title.trim(),
        image: form.image,
        category_id: categoryId,
        description: form.description.trim(),
        content: form.content.trim(),
        status_id: statusLabelToId(statusLabel),
      },
      { headers: getAuthHeaders() },
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteAdminArticle(articleId) {
  try {
    await axios.delete(
      `${API_BASE_URL}/posts/${articleId}`,
      { headers: getAuthHeaders() },
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
