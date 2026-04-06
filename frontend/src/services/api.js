// Real API Service Layer
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API client with interceptors
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        // Handle specific HTTP status codes
        if (response.status === 401) {
          // Unauthorized - clear auth data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          localStorage.removeItem('refresh_token');
          sessionStorage.removeItem('auth_token');
          sessionStorage.removeItem('auth_user');
          sessionStorage.removeItem('refresh_token');
        }
        
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', {
        url,
        method: config.method || 'GET',
        error: error.message
      });
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

const apiClient = new ApiClient();

// Authentication API
export const authAPI = {
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    
    // Store tokens based on rememberMe preference
    if (credentials.rememberMe) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      if (response.refreshToken) {
        localStorage.setItem('refresh_token', response.refreshToken);
      }
    } else {
      sessionStorage.setItem('auth_token', response.token);
      sessionStorage.setItem('auth_user', JSON.stringify(response.user));
      if (response.refreshToken) {
        sessionStorage.setItem('refresh_token', response.refreshToken);
      }
    }
    
    return response;
  },

  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    
    // Store tokens after successful registration
    sessionStorage.setItem('auth_token', response.token);
    sessionStorage.setItem('auth_user', JSON.stringify(response.user));
    if (response.refreshToken) {
      sessionStorage.setItem('refresh_token', response.refreshToken);
    }
    
    return response;
  },

  async logout() {
    const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
    
    try {
      await apiClient.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
    
    // Clear all stored auth data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    sessionStorage.removeItem('refresh_token');
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post('/auth/refresh', { refreshToken });
    
    // Update stored tokens
    const isLocalStorage = localStorage.getItem('refresh_token');
    if (isLocalStorage) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('refresh_token', response.refreshToken);
    } else {
      sessionStorage.setItem('auth_token', response.token);
      sessionStorage.setItem('refresh_token', response.refreshToken);
    }
    
    return response;
  },

  async getCurrentUser() {
    return await apiClient.get('/auth/me');
  },

  async forgotPassword(email) {
    return await apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(token, password, confirmPassword) {
    return await apiClient.put(`/auth/reset-password/${token}`, {
      password,
      confirmPassword
    });
  },

  async changePassword(currentPassword, newPassword, confirmNewPassword) {
    return await apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
      confirmNewPassword
    });
  },

  async verifyEmail(token) {
    return await apiClient.get(`/auth/verify-email/${token}`);
  }
};

// Users API
export const usersAPI = {
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/users${queryString ? `?${queryString}` : ''}`);
  },

  async getUserById(id) {
    return await apiClient.get(`/users/${id}`);
  },

  async updateUser(id, userData) {
    return await apiClient.put(`/users/${id}`, userData);
  },

  async updateUserRole(id, role) {
    return await apiClient.put(`/users/${id}/role`, { role });
  },

  async updateUserStatus(id, status) {
    return await apiClient.put(`/users/${id}/status`, { status });
  },

  async deleteUser(id) {
    return await apiClient.delete(`/users/${id}`);
  },

  async getUserStats() {
    return await apiClient.get('/users/stats/overview');
  }
};

// Projects API
export const projectsAPI = {
  async getProjects(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/projects${queryString ? `?${queryString}` : ''}`);
  },

  async getProjectById(id) {
    return await apiClient.get(`/projects/${id}`);
  },

  async createProject(projectData) {
    return await apiClient.post('/projects', projectData);
  },

  async updateProject(id, projectData) {
    return await apiClient.put(`/projects/${id}`, projectData);
  },

  async deleteProject(id) {
    return await apiClient.delete(`/projects/${id}`);
  },

  async addTeamMember(projectId, userId, role, permissions) {
    return await apiClient.post(`/projects/${projectId}/team`, {
      userId,
      role,
      permissions
    });
  },

  async removeTeamMember(projectId, userId) {
    return await apiClient.delete(`/projects/${projectId}/team/${userId}`);
  },

  async updateTeamMember(projectId, userId, role, permissions) {
    return await apiClient.put(`/projects/${projectId}/team/${userId}`, {
      role,
      permissions
    });
  }
};

// Tasks API (placeholder for future implementation)
export const tasksAPI = {
  async getTasks() {
    // TODO: Implement real tasks API
    return { success: true, tasks: [] };
  },

  async createTask(taskData) {
    // TODO: Implement real task creation
    return { success: true, task: taskData };
  },

  async updateTask(id, taskData) {
    // TODO: Implement real task update
    return { success: true, task: { id, ...taskData } };
  },

  async deleteTask(id) {
    // TODO: Implement real task deletion
    return { success: true };
  }
};