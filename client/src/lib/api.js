// client/src/lib/api.js

import axios from 'axios';

// 1. Create a new Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend URL
});

// 2. Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. API definitions

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const userAPI = {
  getMe: () => api.get('/users/me'),
  getUser: (id) => api.get(`/users/${id}`),
  updateMe: (updatedData) => api.put('/users/me', updatedData),
  searchUsers: (params) => api.get('/users/search', { params }),
};

export const projectAPI = {
  getProjects: () => api.get('/projects'),
  createProject: (projectData) => api.post('/projects', projectData),
  joinProject: (id) => api.post(`/projects/${id}/join`),
};

export const skillAPI = {
  getAllSkillTags: () => api.get('/skills/tags'),
};

// --- MODIFIED SESSION API ---
export const sessionAPI = {
  createSession: (sessionData) => api.post('/sessions', sessionData),
  getSessionsForUser: () => api.get('/sessions/me'),
  // --- ADDED PUBLIC SESSIONS FUNCTION ---
  getAllPublicSessions: () => api.get('/sessions/public'),
  // ------------------------------------
  joinSession: (id) => api.post(`/sessions/${id}/join`),
};

export default api;