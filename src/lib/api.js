// lib/api.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nexlearn.noviindusdemosites.in';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Implement token refresh logic here if API provides refresh endpoint
        // For now, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/auth/login';
        }
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  sendOTP: async (mobile) => {
    const formData = new FormData();
    formData.append('mobile', mobile);
    const response = await api.post('/auth/send-otp', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  verifyOTP: async (mobile, otp) => {
    const formData = new FormData();
    formData.append('mobile', mobile);
    formData.append('otp', otp);
    const response = await api.post('/auth/verify-otp', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  createProfile: async (mobile, name, email, qualification, profileImage) => {
    const formData = new FormData();
    formData.append('mobile', mobile);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('qualification', qualification);
    formData.append('profile_image', profileImage);
    
    const response = await api.post('/auth/create-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// Exam API calls
export const examAPI = {
  getQuestions: async () => {
    const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
    const data = await response.json();
    if (data.results && data.results.length) {
      return {
        success: true,
        questions: data.results.map((q, idx) => ({
          id: idx + 1,
          question: q.question,
          options: [
            ...q.incorrect_answers.map((o, i) => ({
              id: i + 1,
              option: o,
            })),
            { id: 99, option: q.correct_answer }
          ].sort(() => Math.random() - 0.5),
        })),
      };
    }
    return { success: false, message: 'No questions loaded' };
  },
};


export default api;