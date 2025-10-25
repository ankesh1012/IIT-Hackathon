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

// 3. Update your existing API definitions to use the new `api` instance

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const userAPI = {
  getMe: () => api.get('/users/me'),
  getUser: (id) => api.get(`/users/${id}`),
  
  // --- ADD THIS FUNCTION ---
  /**
   * Updates the currently authenticated user's profile.
   * @param {object} updatedData - An object with fields to update (e.g., { username, bio, skills })
   */
  updateMe: (updatedData) => api.put('/users/me', updatedData),
};

export const projectAPI = {
  getProjects: () => api.get('/projects'),
  createProject: (projectData) => api.post('/projects', projectData),
  joinProject: (id) => api.post(`/projects/${id}/join`),
};

export default api;