import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const customerApi = {
  getAll: (params) => api.get('/api/customers', { params }),
  getById: (id) => api.get(`/api/customers/${id}`),
  getBookings: (id) => api.get(`/api/customers/${id}/bookings`),
  lockCashPayment: (id) => api.patch(`/api/customers/${id}/lock-cash-payment`),
  unlockCashPayment: (id) => api.patch(`/api/customers/${id}/unlock-cash-payment`),
  blockCustomer: (id, payload) => api.patch(`/api/customers/${id}/block`, payload),
  unblockCustomer: (id) => api.patch(`/api/customers/${id}/unblock`),
  delete: (id) => api.delete(`/api/customers/${id}`),
};

export const bookingApi = {
  getAll: (params) => api.get('/api/bookings', { params }),
  getById: (id) => api.get(`/api/bookings/${id}`),
  updateStatus: (id, status) => api.put(`/api/bookings/${id}/status`, { status }),
  cancelBooking: (id, payload) => api.post(`/api/bookings/${id}/cancel`, payload),
};

export const productApi = {
  getAll: (params) => api.get('/api/products', { params }),
  getById: (id) => api.get(`/api/products/${id}`),
  create: (data) => api.post('/api/products', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  delete: (id) => api.delete(`/api/products/${id}`),
  reorder: (data) => api.patch('/api/products/reorder', data),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/upload/product-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const categoryApi = {
  getAll: () => api.get('/api/categories'),
  create: (data) => api.post('/api/categories', data),
};

export const orderApi = {
  getAll: (params) => api.get('/api/orders', { params }),
  getById: (id) => api.get(`/api/orders/${id}`),
  confirm: (id) => api.put(`/api/orders/${id}/confirm`),
  cancel: (id, reason) => api.put(`/api/orders/${id}/cancel`, { reason }),
  deliver: (id) => api.put(`/api/orders/${id}/deliver`),
};

export const staffApi = {
  getAll: (params) => api.get('/api/staff/all', { params }),
  getById: (id) => api.get(`/api/staff/${id}`),
  create: (data) => api.post('/api/staff', data),
  update: (id, data) => api.put(`/api/staff/${id}`, data),
  delete: (id) => api.delete(`/api/staff/${id}`),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/upload/staff-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const serviceApi = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/upload/service-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const serviceGroupApi = {
  getAll: () => api.get('/api/service-groups/all'),
  getActive: () => api.get('/api/service-groups'),
  getById: (id) => api.get(`/api/service-groups/${id}`),
  create: (data) => api.post('/api/service-groups', data),
  update: (id, data) => api.put(`/api/service-groups/${id}`, data),
  delete: (id) => api.delete(`/api/service-groups/${id}`),
};

export const adminAccountApi = {
  getAll: () => api.get('/api/admin/accounts'),
  create: (data) => api.post('/api/admin/accounts', data),
  update: (id, data) => api.put(`/api/admin/accounts/${id}`, data),
  delete: (id) => api.delete(`/api/admin/accounts/${id}`),
  resetSystemData: () => api.post('/api/admin/accounts/reset-system-data'),
};

export const authApi = {
  login: (data) => api.post('/api/auth/login', data),
};

export const voucherApi = {
  getAll: () => api.get('/api/vouchers'),
  getById: (id) => api.get(`/api/vouchers/${id}`),
  create: (data) => api.post('/api/vouchers', data),
  update: (id, data) => api.put(`/api/vouchers/${id}`, data),
  delete: (id) => api.delete(`/api/vouchers/${id}`),
  toggleStatus: (id) => api.post(`/api/vouchers/${id}/toggle`),
  giftManually: (payload) => api.post('/api/customer-vouchers/gift', payload),
  giftBirthday: (payload) => api.post('/api/customer-vouchers/gift-birthday', payload),
};

export const newsApi = {
  getAll: (params) => api.get('/api/news', { params }),
  getById: (id) => api.get(`/api/news/${id}`),
  getByType: (type) => api.get(`/api/news/type/${type}`),
  getByCategory: (slug) => api.get(`/api/news/category/${slug}`),
  create: (data) => api.post('/api/news', data),
  update: (id, data) => api.put(`/api/news/${id}`, data),
  delete: (id) => api.delete(`/api/news/${id}`),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/upload/news-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const workScheduleApi = {
  getMySchedule: () => api.get('/api/work-schedules/my-schedule'),
  getBranchSchedule: () => api.get('/api/work-schedules/branch'),
  getAllSchedules: () => api.get('/api/work-schedules'),
};

export const notificationApi = {
  getAll: () => api.get('/api/notifications'),
  getUnreadCount: () => api.get('/api/notifications/unread-count'),
  markAllAsRead: () => api.post('/api/notifications/read-all'),
  markAsRead: (id) => api.post(`/api/notifications/${id}/read`),
};

export default api;
