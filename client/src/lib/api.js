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

// --- MODIFIED PROJECT API ---
export const projectAPI = {
  getProjects: () => api.get('/projects'), // Get all open projects
  // --- ADDED FUNCTION ---
  getProjectsForUser: () => api.get('/projects/me'), 
  // ----------------------
  createProject: (projectData) => api.post('/projects', projectData),
  joinProject: (id) => api.post(`/projects/${id}/join`),
};

export const skillAPI = {
  getAllSkillTags: () => api.get('/skills/tags'),
};

export const sessionAPI = {
  createSession: (sessionData) => api.post('/sessions', sessionData),
  getSessionsForUser: () => api.get('/sessions/me'),
  getAllPublicSessions: () => api.get('/sessions/public'),
  joinSession: (id) => api.post(`/sessions/${id}/join`),
};

export const serviceAPI = {
    getAllServices: () => api.get('/services'),
    createService: (data) => api.post('/services', data),
    purchaseService: (id) => api.post(`/services/${id}/purchase`),
    getServiceById: (id) => api.get(`/services/${id}`),
};

export default api;