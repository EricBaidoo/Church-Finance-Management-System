import api from './api';

export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  getMe: () => api.get('/auth/me'),
  
  logout: () => api.post('/auth/logout'),
};

export const donationService = {
  list: (page = 1, limit = 15) =>
    api.get('/donations', { params: { page, limit } }),
  
  get: (id: number) => api.get(`/donations/${id}`),
  
  create: (data: any) => api.post('/donations', data),
  
  update: (id: number, data: any) => api.put(`/donations/${id}`, data),
  
  delete: (id: number) => api.delete(`/donations/${id}`),
};

export const expenseService = {
  list: (page = 1, limit = 15) =>
    api.get('/expenses', { params: { page, limit } }),
  
  get: (id: number) => api.get(`/expenses/${id}`),
  
  create: (data: any) => api.post('/expenses', data),
  
  update: (id: number, data: any) => api.put(`/expenses/${id}`, data),
  
  approve: (id: number) => api.put(`/expenses/${id}/approve`),
  
  reject: (id: number) => api.put(`/expenses/${id}/reject`),
  
  delete: (id: number) => api.delete(`/expenses/${id}`),
};

export const budgetService = {
  list: (page = 1, limit = 15) =>
    api.get('/budgets', { params: { page, limit } }),
  
  get: (id: number) => api.get(`/budgets/${id}`),
  
  create: (data: any) => api.post('/budgets', data),
  
  update: (id: number, data: any) => api.put(`/budgets/${id}`, data),
  
  delete: (id: number) => api.delete(`/budgets/${id}`),
};

export const reportService = {
  list: (page = 1, limit = 15) =>
    api.get('/reports', { params: { page, limit } }),
  
  get: (id: number) => api.get(`/reports/${id}`),
  
  generate: (data: any) => api.post('/reports/generate', data),
  
  dashboard: () => api.get('/reports/dashboard'),
};
