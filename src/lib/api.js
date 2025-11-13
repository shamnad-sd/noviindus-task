import axios from 'axios';

// Create axios instance that points to Next.js API routes
const api = axios.create({
  baseURL: '/api',
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

      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth/login';
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
    const response = await fetch('/api/auth/send-otp', {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  verifyOTP: async (mobile, otp) => {
    const formData = new FormData();
    formData.append('mobile', mobile);
    formData.append('otp', otp);
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  createProfile: async (mobile, name, email, qualification, profileImage) => {
    const formData = new FormData();
    formData.append('mobile', mobile);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('qualification', qualification);
    formData.append('profile_image', profileImage);
    
    const response = await fetch('/api/auth/create-profile', {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  logout: async () => {
    const token = localStorage.getItem('access_token');
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    return response.json();
  },
};

// Exam API calls
export const examAPI = {
  getQuestions: async () => {
    const response = await fetch('/api/exam/questions');
    return response.json();
  },

  submitAnswers: async (answers) => {
    const response = await fetch('/api/exam/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });
    return response.json();
  },

  getResults: async (examHistoryId) => {
    const response = await fetch(`/api/exam/results/${examHistoryId}`);
    return response.json();
  }
};

export default api;