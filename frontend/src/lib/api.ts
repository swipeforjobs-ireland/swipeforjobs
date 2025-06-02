import axios from 'axios';
import { useAuthStore } from './authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  signup: async (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    const response = await api.post('/api/v1/auth/signup', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/api/v1/auth/login', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/api/v1/auth/profile');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/api/v1/auth/profile', data);
    return response.data;
  },
};