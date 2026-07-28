import type { Note, Blog } from '@platform/shared';

const API_BASE = '/api';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const res = await fetch(url, { ...options, credentials: 'include' });
  if (!res.ok) {
    if (res.status === 401 && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('API request failed');
  }
  return res.json();
}

export const api = {
  // Auth
  login: async (credentials: any) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },
  logout: () => fetchWithAuth(`${API_BASE}/auth/logout`, { method: 'POST' }),
  me: () => fetchWithAuth(`${API_BASE}/auth/me`),

  // Notes
  getNotes: () => fetchWithAuth(`${API_BASE}/admin/notes`),
  createNote: (data: Partial<Note>) => fetchWithAuth(`${API_BASE}/admin/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  updateNote: (id: string, data: Partial<Note>) => fetchWithAuth(`${API_BASE}/admin/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  deleteNote: (id: string) => fetchWithAuth(`${API_BASE}/admin/notes/${id}`, { method: 'DELETE' }),
  publishNote: (id: string) => fetchWithAuth(`${API_BASE}/admin/notes/${id}/publish`, { method: 'POST' }),
  unpublishNote: (id: string) => fetchWithAuth(`${API_BASE}/admin/notes/${id}/unpublish`, { method: 'POST' }),
  getCategories: () => fetchWithAuth(`${API_BASE}/admin/categories`),

  // Blogs
  getBlogs: () => fetchWithAuth(`${API_BASE}/admin/blogs`),
  createBlog: (data: Partial<Blog>) => fetchWithAuth(`${API_BASE}/admin/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  updateBlog: (id: string, data: Partial<Blog>) => fetchWithAuth(`${API_BASE}/admin/blogs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  deleteBlog: (id: string) => fetchWithAuth(`${API_BASE}/admin/blogs/${id}`, { method: 'DELETE' }),
  publishBlog: (id: string) => fetchWithAuth(`${API_BASE}/admin/blogs/${id}/publish`, { method: 'POST' }),
  unpublishBlog: (id: string) => fetchWithAuth(`${API_BASE}/admin/blogs/${id}/unpublish`, { method: 'POST' }),
};
