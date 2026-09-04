import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('clauseguard_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me')
};

export const documentAPI = {
  upload: (formData, onProgress) => API.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        const percent = Math.round((e.loaded * 100) / e.total);
        onProgress(percent);
      }
    }
  }),
  getAll: () => API.get('/documents'),
  getById: (id) => API.get(`/documents/${id}`),
  getClauses: (id) => API.get(`/documents/${id}/clauses`),
  delete: (id) => API.delete(`/documents/${id}`)
};

export const analysisAPI = {
  compare: (documentIds) => API.post('/analysis/compare', { documentIds }),
  getAll: () => API.get('/analysis'),
  getById: (id) => API.get(`/analysis/${id}`)
};

export const chatAPI = {
  ask: (question, documentIds) => API.post('/chat', { question, documentIds })
};

export const demoAPI = {
  seed: () => API.post('/demo/seed')
};

export default API;
