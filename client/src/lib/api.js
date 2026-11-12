const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const api = {
  list: (q = '') => req(`/tasks${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  create: (body) => req('/tasks', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => req(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  setStatus: (id, status) => req(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  remove: (id) => req(`/tasks/${id}`, { method: 'DELETE' }),
};
