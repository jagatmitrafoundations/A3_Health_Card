import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Unified authentication (simple)
export const auth = {
  // Direct unified login - no OTP, no sessions
  unifiedLogin: (credentials) => api.post('/auth/unified-login', credentials),
  
  // Simple logout
  logout: () => {
    localStorage.removeItem('user');
    return Promise.resolve();
  }
};

// Keep other APIs as they are
export const userApi = {
  register: (formData) => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    return api.post('/signup', formData, config);
  }
};

export const hospitalApi = {
  register: (formData) => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    return api.post('/auth/hospital/signup', formData, config);
  },
  login: (credentials) => api.post('/auth/hospital/login', credentials)
};

export const doctorApi = {
  register: (formData) => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    return api.post('/auth/doctor/signup', formData, config);
  },
  login: (credentials) => api.post('/auth/doctor/login', credentials)
};

export const pharmacyApi = {
  register: (formData) => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    return api.post('/auth/pharmacy/register', formData, config);
  },
  login: (credentials) => api.post('/auth/pharmacy/login', credentials)
};

export const insuranceApi = {
  register: (formData) => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    return api.post('/auth/insurance/register', formData, config);
  },
  login: (credentials) => api.post('/auth/insurance/login', credentials)
};

export const mncApi = {
  register: (formData) => api.post('/auth/mnc/register', formData),
  login: (credentials) => api.post('/auth/mnc/login', credentials)
};

export const adminApi = {
  register: (formData) => api.post('/auth/admin/register', formData),
  login: (credentials) => api.post('/auth/admin/login', credentials)
};

export const superAdminApi = {
  register: (formData) => api.post('/auth/superadmin/register', formData),
  login: (credentials) => api.post('/auth/superadmin/login', credentials)
};

export const healthAuthorityApi = {
  register: (formData) => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    return api.post('/auth/healthauthority/register', formData, config);
  },
  login: (credentials) => api.post('/auth/healthauthority/login', credentials)
};

export const medicalApi = {
  getRecord: (userId) => api.get(`/medical/${userId}`),
  updateRecord: (userId, data) => api.put(`/medical/${userId}`, data),
  createRecord: (data) => api.post('/medical', data)
};

export default api;