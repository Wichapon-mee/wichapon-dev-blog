import axios from 'axios';
import { getStoredToken } from '@/api/authApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

export async function fetchCategories(keyword) {
  try {
    const params = keyword ? { keyword } : undefined;
    const { data } = await axios.get(`${API_BASE_URL}/categories`, { params });
    return data.categories || [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function fetchCategoryById(categoryId) {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/categories/${categoryId}`);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createCategory(name) {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/categories`,
      { name },
      { headers: getAuthHeaders() },
    );
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateCategory(categoryId, name) {
  try {
    const { data } = await axios.put(
      `${API_BASE_URL}/categories/${categoryId}`,
      { name },
      { headers: getAuthHeaders() },
    );
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteCategory(categoryId) {
  try {
    const { data } = await axios.delete(
      `${API_BASE_URL}/categories/${categoryId}`,
      { headers: getAuthHeaders() },
    );
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
