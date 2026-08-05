import api from './api';

const TOKEN_KEY = 'tripflow_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY),
};

export async function login(credentials) {
  const response = await api.post('/auth/login', credentials);
  return response.data;
}

export async function register(userData) {
  const response = await api.post('/auth/register', userData);
  return response.data;
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } finally {
    tokenStorage.remove();
  }
}

export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data;
}

export async function forgotPassword(email) {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
}
