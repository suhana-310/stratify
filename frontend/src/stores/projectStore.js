import { create } from 'zustand';
import { mockProjects } from '../data/mockData';

const useProjectStore = create((set, get) => ({
  projects: mockProjects,
  loading: false,
  error: null,

  // Actions
  setProjects: (projects) => set({ projects }),
  
  addProject: (project) => set((state) => ({
    projects: [...state.projects, { ...project, id: Date.now().toString() }]
  })),

  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(project =>
      project.id === id ? { ...project, ...updates } : project
    )
  })),

  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(project => project.id !== id)
  })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));

export default useProjectStore;