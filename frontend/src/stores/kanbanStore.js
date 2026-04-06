import { create } from 'zustand';
import { mockTasks } from '../data/mockData';

const useKanbanStore = create((set, get) => ({
  tasks: mockTasks,
  loading: false,
  error: null,

  // Actions
  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: Date.now().toString() }]
  })),

  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    )
  })),

  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),

  moveTask: (taskId, newStatus) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    )
  })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));

export default useKanbanStore;