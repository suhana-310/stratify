// Mock API Service Layer
import { mockUsers, mockProjects, mockTasks, mockNotifications } from '../data/mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication API
export const authAPI = {
  async login(credentials) {
    await delay();
    const { email, password } = credentials;
    
    // Mock authentication logic
    if (email === 'admin@company.com' && password === 'admin123') {
      const user = mockUsers.find(u => u.email === email) || mockUsers[0];
      return {
        success: true,
        user,
        token: 'mock-jwt-token-' + Date.now()
      };
    }
    
    throw new Error('Invalid credentials');
  },

  async register(userData) {
    await delay();
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      role: 'member',
      status: 'active',
      joinedAt: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString()
    };
    
    return {
      success: true,
      user: newUser,
      token: 'mock-jwt-token-' + Date.now()
    };
  },

  async logout() {
    await delay();
    return { success: true };
  }
};

// Projects API
export const projectsAPI = {
  async getProjects() {
    await delay();
    return mockProjects;
  },

  async createProject(projectData) {
    await delay();
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockProjects.push(newProject);
    return newProject;
  }
};

// Tasks API
export const tasksAPI = {
  async getTasks(projectId = null) {
    await delay();
    return projectId 
      ? mockTasks.filter(t => t.projectId === projectId)
      : mockTasks;
  },

  async createTask(taskData) {
    await delay();
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: 0,
      checklist: [],
      attachments: []
    };
    
    mockTasks.push(newTask);
    return newTask;
  }
};