import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const TOKEN_KEY = 'access_token';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function getErrorMessage(error) {
  return error.response?.data?.error || error.message || 'Request failed';
}

export async function registerUser(body) {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/register`, body);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function loginUser(body) {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/login`, body);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getCurrentUser(token) {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/auth/get-user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function resetPassword(token, body) {
  try {
    const { data } = await axios.put(`${API_BASE_URL}/auth/reset-password`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
