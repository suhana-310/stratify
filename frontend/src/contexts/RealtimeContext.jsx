import React, { createContext, useContext, useReducer, useEffect } from 'react'
import socketService from '../services/socket'
import { toast } from 'react-hot-toast'

// Initial state
const initialState = {
  projects: [],
  tasks: [],
  users: [],
  activities: [],
  stats: {
    activeProjects: 0,
    teamMembers: 0,
    completedTasks: 0,
    hoursThisWeek: 0
  },
  loading: {
    projects: false,
    tasks: false,
    users: false
  },
  connected: false,
  lastUpdate: null
}

// Action types
const ACTIONS = {
  SET_CONNECTED: 'SET_CONNECTED',
  SET_LOADING: 'SET_LOADING',
  SET_PROJECTS: 'SET_PROJECTS',
  ADD_PROJECT: 'ADD_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  SET_TASKS: 'SET_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  REORDER_TASKS: 'REORDER_TASKS',
  SET_USERS: 'SET_USERS',
  ADD_USER: 'ADD_USER',
  UPDATE_USER: 'UPDATE_USER',
  ADD_ACTIVITY: 'ADD_ACTIVITY',
  UPDATE_STATS: 'UPDATE_STATS',
  TEAM_MEMBER_ADDED: 'TEAM_MEMBER_ADDED',
  TEAM_MEMBER_REMOVED: 'TEAM_MEMBER_REMOVED',
  TEAM_MEMBER_UPDATED: 'TEAM_MEMBER_UPDATED',
  PROJECT_LINK_ADDED: 'PROJECT_LINK_ADDED',
  PROJECT_LINK_UPDATED: 'PROJECT_LINK_UPDATED',
  PROJECT_LINK_REMOVED: 'PROJECT_LINK_REMOVED'
}

// Reducer function
function realtimeReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_CONNECTED:
      return {
        ...state,
        connected: action.payload
      }

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.type]: action.payload.loading
        }
      }

    case ACTIONS.SET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
        stats: {
          ...state.stats,
          activeProjects: action.payload.filter(p => p.status === 'active').length
        },
        lastUpdate: new Date()
      }

    case ACTIONS.ADD_PROJECT:
      const newProjects = [action.payload, ...state.projects]
      return {
        ...state,
        projects: newProjects,
        stats: {
          ...state.stats,
          activeProjects: newProjects.filter(p => p.status === 'active').length
        },
        lastUpdate: new Date()
      }

    case ACTIONS.UPDATE_PROJECT:
      const updatedProjects = state.projects.map(project =>
        project._id === action.payload._id ? action.payload : project
      )
      return {
        ...state,
        projects: updatedProjects,
        stats: {
          ...state.stats,
          activeProjects: updatedProjects.filter(p => p.status === 'active').length
        },
        lastUpdate: new Date()
      }

    case ACTIONS.DELETE_PROJECT:
      const filteredProjects = state.projects.filter(project => project._id !== action.payload)
      return {
        ...state,
        projects: filteredProjects,
        tasks: state.tasks.filter(task => task.project._id !== action.payload),
        stats: {
          ...state.stats,
          activeProjects: filteredProjects.filter(p => p.status === 'active').length
        },
        lastUpdate: new Date()
      }

    case ACTIONS.SET_TASKS:
      return {
        ...state,
        tasks: action.payload,
        stats: {
          ...state.stats,
          completedTasks: action.payload.filter(t => t.status === 'done').length
        },
        lastUpdate: new Date()
      }

    case ACTIONS.ADD_TASK:
      const newTasks = [...state.tasks, action.payload]
      return {
        ...state,
        tasks: newTasks,
        stats: {
          ...state.stats,
          completedTasks: newTasks.filter(t => t.status === 'done').length
        },
        lastUpdate: new Date()
      }

    case ACTIONS.UPDATE_TASK:
      const updatedTasks = state.tasks.map(task =>
        task._id === action.payload._id ? action.payload : task
      )
      return {
        ...state,
        tasks: updatedTasks,
        stats: {
          ...state.stats,
          completedTasks: updatedTasks.filter(t => t.status === 'done').length
        },
        lastUpdate: new Date()
      }

    case ACTIONS.DELETE_TASK:
      const remainingTasks = state.tasks.filter(task => task._id !== action.payload)
      return {
        ...state,
        tasks: remainingTasks,
        stats: {
          ...state.stats,
          completedTasks: remainingTasks.filter(t => t.status === 'done').length
        },
        lastUpdate: new Date()
      }

    case ACTIONS.REORDER_TASKS:
      const reorderedTasks = [...state.tasks]
      action.payload.forEach(updatedTask => {
        const index = reorderedTasks.findIndex(t => t._id === updatedTask._id)
        if (index !== -1) {
          reorderedTasks[index] = updatedTask
        }
      })
      return {
        ...state,
        tasks: reorderedTasks,
        lastUpdate: new Date()
      }

    case ACTIONS.SET_USERS:
      return {
        ...state,
        users: action.payload,
        stats: {
          ...state.stats,
          teamMembers: action.payload.length
        },
        lastUpdate: new Date()
      }

    case ACTIONS.ADD_USER:
      const newUsers = [...state.users, action.payload]
      return {
        ...state,
        users: newUsers,
        stats: {
          ...state.stats,
          teamMembers: newUsers.length
        },
        lastUpdate: new Date()
      }

    case ACTIONS.UPDATE_USER:
      return {
        ...state,
        users: state.users.map(user =>
          user._id === action.payload._id ? action.payload : user
        ),
        lastUpdate: new Date()
      }

    case ACTIONS.ADD_ACTIVITY:
      return {
        ...state,
        activities: [action.payload, ...state.activities.slice(0, 49)], // Keep last 50 activities
        lastUpdate: new Date()
      }

    case ACTIONS.UPDATE_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          ...action.payload
        },
        lastUpdate: new Date()
      }

    case ACTIONS.TEAM_MEMBER_ADDED:
      return {
        ...state,
        projects: state.projects.map(project =>
          project._id === action.payload.project._id ? action.payload.project : project
        ),
        lastUpdate: new Date()
      }

    case ACTIONS.TEAM_MEMBER_REMOVED:
      return {
        ...state,
        projects: state.projects.map(project =>
          project._id === action.payload.project._id ? action.payload.project : project
        ),
        lastUpdate: new Date()
      }

    case ACTIONS.TEAM_MEMBER_UPDATED:
      return {
        ...state,
        projects: state.projects.map(project =>
          project._id === action.payload.project._id ? action.payload.project : project
        ),
        lastUpdate: new Date()
      }

    case ACTIONS.PROJECT_LINK_ADDED:
    case ACTIONS.PROJECT_LINK_UPDATED:
    case ACTIONS.PROJECT_LINK_REMOVED:
      return {
        ...state,
        projects: state.projects.map(project =>
          project._id === action.payload.project._id ? action.payload.project : project
        ),
        lastUpdate: new Date()
      }

    default:
      return state
  }
}

// Create context
const RealtimeContext = createContext()

// Provider component
export function RealtimeProvider({ children }) {
  const [state, dispatch] = useReducer(realtimeReducer, initialState)

  // Socket connection management
  useEffect(() => {
    const handleConnect = () => {
      dispatch({ type: ACTIONS.SET_CONNECTED, payload: true })
      console.log('🔗 Real-time connection established')
    }

    const handleDisconnect = () => {
      dispatch({ type: ACTIONS.SET_CONNECTED, payload: false })
      console.log('🔌 Real-time connection lost')
    }

    const handleReconnect = () => {
      dispatch({ type: ACTIONS.SET_CONNECTED, payload: true })
      console.log('🔄 Real-time connection restored')
      toast.success('Connection restored!')
    }

    // Check if socket is already connected
    if (socketService.isSocketConnected()) {
      console.log('🔗 Socket already connected')
      handleConnect()
    } else {
      console.log('🔌 Socket not connected, waiting for connection...')
    }

    // Socket event listeners
    socketService.on('connect', handleConnect)
    socketService.on('disconnect', handleDisconnect)
    socketService.on('reconnect', handleReconnect)

    return () => {
      socketService.off('connect', handleConnect)
      socketService.off('disconnect', handleDisconnect)
      socketService.off('reconnect', handleReconnect)
    }
  }, [])

  // Load initial data when context is created
  useEffect(() => {
    // Only load if we don't have data yet and socket is connected
    if (state.projects.length === 0 && state.tasks.length === 0 && state.users.length === 0) {
      console.log('🚀 RealtimeContext initialized, loading initial data...')
      actions.loadInitialData()
    }
  }, [state.connected])

  // Real-time event handlers
  useEffect(() => {
    console.log('🎧 Setting up real-time event listeners...', { connected: state.connected })
    
    if (!socketService.isSocketConnected()) {
      console.log('⚠️ Socket not connected, skipping event listeners setup')
      return
    }

    console.log('🎧 Socket is connected, setting up event listeners...')

    // Project events
    const handleProjectCreated = (data) => {
      console.log('📊 Project created event received:', data.project.name)
      dispatch({ type: ACTIONS.ADD_PROJECT, payload: data.project })
      dispatch({ 
        type: ACTIONS.ADD_ACTIVITY, 
        payload: {
          id: Date.now(),
          user: data.createdBy?.name || 'Someone',
          action: 'created project',
          target: data.project.name,
          time: 'just now',
          type: 'create',
          timestamp: new Date()
        }
      })
      toast.success(`New project "${data.project.name}" created!`)
    }

    const handleProjectUpdated = (data) => {
      console.log('📊 Project updated event:', data.project.name)
      dispatch({ type: ACTIONS.UPDATE_PROJECT, payload: data.project })
      dispatch({ 
        type: ACTIONS.ADD_ACTIVITY, 
        payload: {
          id: Date.now(),
          user: data.updatedBy?.name || 'Someone',
          action: 'updated project',
          target: data.project.name,
          time: 'just now',
          type: 'update',
          timestamp: new Date()
        }
      })
    }

    const handleProjectDeleted = (data) => {
      console.log('📊 Project deleted event:', data.projectName)
      dispatch({ type: ACTIONS.DELETE_PROJECT, payload: data.projectId })
      dispatch({ 
        type: ACTIONS.ADD_ACTIVITY, 
        payload: {
          id: Date.now(),
          user: data.deletedBy?.name || 'Someone',
          action: 'deleted project',
          target: data.projectName,
          time: 'just now',
          type: 'delete',
          timestamp: new Date()
        }
      })
      toast.info(`Project "${data.projectName}" was deleted`)
    }

    // Task events
    const handleTaskCreated = (data) => {
      console.log('📋 Task created event:', data.task.title)
      dispatch({ type: ACTIONS.ADD_TASK, payload: data.task })
      dispatch({ 
        type: ACTIONS.ADD_ACTIVITY, 
        payload: {
          id: Date.now(),
          user: data.createdBy?.name || 'Someone',
          action: 'created task',
          target: data.task.title,
          time: 'just now',
          type: 'create',
          timestamp: new Date()
        }
      })
    }

    const handleTaskUpdated = (data) => {
      console.log('📋 Task updated event:', data.task.title)
      dispatch({ type: ACTIONS.UPDATE_TASK, payload: data.task })
      dispatch({ 
        type: ACTIONS.ADD_ACTIVITY, 
        payload: {
          id: Date.now(),
          user: data.updatedBy?.name || 'Someone',
          action: 'updated task',
          target: data.task.title,
          time: 'just now',
          type: 'update',
          timestamp: new Date()
        }
      })
    }

    const handleTaskDeleted = (data) => {
      console.log('📋 Task deleted event:', data.taskId)
      dispatch({ type: ACTIONS.DELETE_TASK, payload: data.taskId })
      dispatch({ 
        type: ACTIONS.ADD_ACTIVITY, 
        payload: {
          id: Date.now(),
          user: data.deletedBy?.name || 'Someone',
          action: 'deleted task',
          target: 'a task',
          time: 'just now',
          type: 'delete',
          timestamp: new Date()
        }
      })
    }

    const handleTasksReordered = (data) => {
      console.log('📋 Tasks reordered event')
      dispatch({ type: ACTIONS.REORDER_TASKS, payload: data.tasks })
    }

    // Team events
    const handleTeamMemberAdded = (data) => {
      console.log('👥 Team member added event:', data.newMember?.name)
      dispatch({ type: ACTIONS.TEAM_MEMBER_ADDED, payload: data })
      dispatch({ 
        type: ACTIONS.ADD_ACTIVITY, 
        payload: {
          id: Date.now(),
          user: data.newMember?.name || 'Someone',
          action: 'joined project',
          target: data.project.name,
          time: 'just now',
          type: 'team',
          timestamp: new Date()
        }
      })
      toast.success(`${data.newMember?.name} joined "${data.project.name}"`)
    }

    const handleTeamMemberRemoved = (data) => {
      console.log('👥 Team member removed event:', data.removedMember?.name)
      dispatch({ type: ACTIONS.TEAM_MEMBER_REMOVED, payload: data })
      dispatch({ 
        type: ACTIONS.ADD_ACTIVITY, 
        payload: {
          id: Date.now(),
          user: data.removedMember?.name || 'Someone',
          action: 'left project',
          target: data.project.name,
          time: 'just now',
          type: 'team',
          timestamp: new Date()
        }
      })
      toast.info(`${data.removedMember?.name} left "${data.project.name}"`)
    }

    const handleTeamMemberUpdated = (data) => {
      console.log('👥 Team member updated event:', data.updatedMember?.name)
      dispatch({ type: ACTIONS.TEAM_MEMBER_UPDATED, payload: data })
      dispatch({ 
        type: ACTIONS.ADD_ACTIVITY, 
        payload: {
          id: Date.now(),
          user: data.updatedMember?.name || 'Someone',
          action: 'role updated in',
          target: data.project.name,
          time: 'just now',
          type: 'team',
          timestamp: new Date()
        }
      })
    }

    // Project link events
    const handleProjectLinkAdded = (data) => {
      dispatch({ type: ACTIONS.PROJECT_LINK_ADDED, payload: data })
      toast.success(`Link "${data.link.title}" added to project`)
    }

    const handleProjectLinkUpdated = (data) => {
      dispatch({ type: ACTIONS.PROJECT_LINK_UPDATED, payload: data })
    }

    const handleProjectLinkRemoved = (data) => {
      dispatch({ type: ACTIONS.PROJECT_LINK_REMOVED, payload: data })
    }

    // User events
    const handleUserUpdated = (data) => {
      dispatch({ type: ACTIONS.UPDATE_USER, payload: data.user })
    }

    // Register all event listeners
    console.log('🎧 Registering socket event listeners...')
    socketService.on('project_created', handleProjectCreated)
    socketService.on('project_updated', handleProjectUpdated)
    socketService.on('project_deleted', handleProjectDeleted)
    socketService.on('task_created', handleTaskCreated)
    socketService.on('task_updated', handleTaskUpdated)
    socketService.on('task_deleted', handleTaskDeleted)
    socketService.on('tasks_reordered', handleTasksReordered)
    socketService.on('team_member_added', handleTeamMemberAdded)
    socketService.on('team_member_removed', handleTeamMemberRemoved)
    socketService.on('team_member_updated', handleTeamMemberUpdated)
    socketService.on('project_link_added', handleProjectLinkAdded)
    socketService.on('project_link_updated', handleProjectLinkUpdated)
    socketService.on('project_link_removed', handleProjectLinkRemoved)
    socketService.on('user_updated', handleUserUpdated)
    
    console.log('✅ All socket event listeners registered')

    return () => {
      console.log('🧹 Cleaning up socket event listeners...')
      socketService.off('project_created', handleProjectCreated)
      socketService.off('project_updated', handleProjectUpdated)
      socketService.off('project_deleted', handleProjectDeleted)
      socketService.off('task_created', handleTaskCreated)
      socketService.off('task_updated', handleTaskUpdated)
      socketService.off('task_deleted', handleTaskDeleted)
      socketService.off('tasks_reordered', handleTasksReordered)
      socketService.off('team_member_added', handleTeamMemberAdded)
      socketService.off('team_member_removed', handleTeamMemberRemoved)
      socketService.off('team_member_updated', handleTeamMemberUpdated)
      socketService.off('project_link_added', handleProjectLinkAdded)
      socketService.off('project_link_updated', handleProjectLinkUpdated)
      socketService.off('project_link_removed', handleProjectLinkRemoved)
      socketService.off('user_updated', handleUserUpdated)
    }
  }, [state.connected])

  // Action creators
  const actions = {
    setLoading: (type, loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: { type, loading } }),
    setProjects: (projects) => dispatch({ type: ACTIONS.SET_PROJECTS, payload: projects }),
    setTasks: (tasks) => dispatch({ type: ACTIONS.SET_TASKS, payload: tasks }),
    setUsers: (users) => dispatch({ type: ACTIONS.SET_USERS, payload: users }),
    updateStats: (stats) => dispatch({ type: ACTIONS.UPDATE_STATS, payload: stats }),
    addActivity: (activity) => dispatch({ type: ACTIONS.ADD_ACTIVITY, payload: activity }),
    
    // Load initial data function
    loadInitialData: async () => {
      console.log('🔄 Loading initial real-time data...')
      
      try {
        // Import API services dynamically to avoid circular imports
        const { projectsAPI, tasksAPI, usersAPI } = await import('../services/api')
        
        // Load projects
        dispatch({ type: ACTIONS.SET_LOADING, payload: { type: 'projects', loading: true } })
        const projectsResponse = await projectsAPI.getProjects({ limit: 100 })
        const projectsData = projectsResponse.projects || []
        console.log('📊 Loaded projects for real-time context:', projectsData.length)
        dispatch({ type: ACTIONS.SET_PROJECTS, payload: projectsData })
        dispatch({ type: ACTIONS.SET_LOADING, payload: { type: 'projects', loading: false } })

        // Load tasks
        dispatch({ type: ACTIONS.SET_LOADING, payload: { type: 'tasks', loading: true } })
        const tasksResponse = await tasksAPI.getTasks({ limit: 200 })
        const tasksData = tasksResponse.tasks || []
        console.log('📋 Loaded tasks for real-time context:', tasksData.length)
        dispatch({ type: ACTIONS.SET_TASKS, payload: tasksData })
        dispatch({ type: ACTIONS.SET_LOADING, payload: { type: 'tasks', loading: false } })

        // Load users
        dispatch({ type: ACTIONS.SET_LOADING, payload: { type: 'users', loading: true } })
        const usersResponse = await usersAPI.getUsers({ limit: 100 })
        const usersData = usersResponse.users || []
        console.log('👥 Loaded users for real-time context:', usersData.length)
        dispatch({ type: ACTIONS.SET_USERS, payload: usersData })
        dispatch({ type: ACTIONS.SET_LOADING, payload: { type: 'users', loading: false } })

        // Update stats based on loaded data
        const activeProjects = projectsData.filter(p => p.status === 'active').length
        const completedTasks = tasksData.filter(t => t.status === 'done').length
        const teamMembers = usersData.length
        
        dispatch({ 
          type: ACTIONS.UPDATE_STATS, 
          payload: {
            activeProjects,
            completedTasks,
            teamMembers,
            hoursThisWeek: Math.floor(Math.random() * 200) + 100 // Mock data
          }
        })

        console.log('✅ Initial real-time data loaded successfully')
        
      } catch (error) {
        console.error('❌ Failed to load initial real-time data:', error)
      }
    }
  }

  const value = {
    ...state,
    actions
  }

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  )
}

// Custom hook to use the context
export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
}

export default RealtimeContext