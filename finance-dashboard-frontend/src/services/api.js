import axios from 'axios';

const BASE_URL = (process.env.REACT_APP_API_URL || 'https://financialdashboardfullstackapp-production.up.railway.app') + '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.post('/users/change-password', data),
};

// Records APIs
export const recordsAPI = {
  getAll: (params) => api.get('/records', { params }),
  getById: (id) => api.get(`/records/${id}`),
  create: (data) => api.post('/records', data),
  update: (id, data) => api.put(`/records/${id}`, data),
  delete: (id) => api.delete(`/records/${id}`),
};

// Dashboard APIs
export const dashboardAPI = {
  getSummary: (params) => api.get('/records/dashboard/summary', { params }),
  getMonthlyTrends: (params) => api.get('/records/dashboard/monthly-trends', { params }),
  getCategoryBreakdown: (params) => api.get('/records/dashboard/category-breakdown', { params }),
  getInsights: (params) => api.get('/records/dashboard/insights', { params }),
};

export default api;
