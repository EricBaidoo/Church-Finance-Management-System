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

export const offeringTypeService = {
  listActive: () => api.get('/offering-types/active'),
  
  list: (page = 1, limit = 50) =>
    api.get('/offering-types', { params: { page, limit } }),
  
  get: (id: number) => api.get(`/offering-types/${id}`),
  
  create: (data: any) => api.post('/offering-types', data),
  
  update: (id: number, data: any) => api.put(`/offering-types/${id}`, data),
  
  delete: (id: number) => api.delete(`/offering-types/${id}`),
};

export const reportService = {
  list: (page = 1, limit = 15) =>
    api.get('/reports', { params: { page, limit } }),
  
  get: (id: number) => api.get(`/reports/${id}`),
  
  generate: (data: any) => api.post('/reports/generate', data),
  
  dashboard: () => api.get('/reports/dashboard'),
};

// Default export with all methods
const apiService = {
  login: (email: string, password: string) => authService.login(email, password),
  logout: () => authService.logout(),
  getMe: () => authService.getMe(),
  
  listDonations: (page?: number, limit?: number) => donationService.list(page, limit),
  getDonation: (id: number) => donationService.get(id),
  createDonation: (data: any) => donationService.create(data),
  updateDonation: (id: number, data: any) => donationService.update(id, data),
  deleteDonation: (id: number) => donationService.delete(id),
  
  listExpenses: (page?: number, limit?: number) => expenseService.list(page, limit),
  getExpense: (id: number) => expenseService.get(id),
  createExpense: (data: any) => expenseService.create(data),
  updateExpense: (id: number, data: any) => expenseService.update(id, data),
  approveExpense: (id: number) => expenseService.approve(id),
  rejectExpense: (id: number) => expenseService.reject(id),
  deleteExpense: (id: number) => expenseService.delete(id),
  
  listBudgets: (page?: number, limit?: number) => budgetService.list(page, limit),
  getBudget: (id: number) => budgetService.get(id),
  createBudget: (data: any) => budgetService.create(data),
  updateBudget: (id: number, data: any) => budgetService.update(id, data),
  deleteBudget: (id: number) => budgetService.delete(id),
  
  listReports: (page?: number, limit?: number) => reportService.list(page, limit),
  getReport: (id: number) => reportService.get(id),
  generateReport: (data: any) => reportService.generate(data),
  getDashboard: () => reportService.dashboard(),
  
  listActiveOfferingTypes: () => offeringTypeService.listActive(),
  listOfferingTypes: (page?: number, limit?: number) => offeringTypeService.list(page, limit),
  getOfferingType: (id: number) => offeringTypeService.get(id),
  createOfferingType: (data: any) => offeringTypeService.create(data),
  updateOfferingType: (id: number, data: any) => offeringTypeService.update(id, data),
  deleteOfferingType: (id: number) => offeringTypeService.delete(id),
};

export default apiService;
