import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Calendar, MessageCircle, User, Clock, Flag, Edit3, Trash2, Tag, RefreshCw } from 'lucide-react'
import { tasksAPI, projectsAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { useRealtime } from '../../contexts/RealtimeContext'
import socketService from '../../services/socket'
import { toast } from 'react-hot-toast'

export default function KanbanView({ projectId }) {
  const { user } = useAuth()
  const { tasks, projects, loading, actions } = useRealtime()
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [draggedTask, setDraggedTask] = useState(null)
  const [localLoading, setLocalLoading] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    dueDate: '',
    tags: [],
    status: 'todo'
  })

  // Get current project from real-time context
  const currentProject = projects.find(p => p._id === projectId)
  
  // Filter tasks for current project from real-time context
  const projectTasks = tasks.filter(task => {
    if (!task.project) return false
    const taskProjectId = typeof task.project === 'object' ? task.project._id : task.project
    return taskProjectId === projectId
  })

  // Get project team from current project
  const projectTeam = currentProject?.team || []

  console.log('🎯 Kanban Debug:', {
    projectId,
    currentProject: currentProject?.name,
    totalTasks: tasks.length,
    projectTasks: projectTasks.length,
    projectTeam: projectTeam.length,
    loading: loading.tasks
  })

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
    { id: 'progress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'review', title: 'Review', color: 'bg-yellow-100' },
    { id: 'done', title: 'Done', color: 'bg-green-100' }
  ]

  const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    urgent: 'bg-red-500'
  }

  // Load tasks and project data on component mount
  useEffect(() => {
    if (projectId && (!currentProject || projectTasks.length === 0)) {
      console.log('🔄 Loading Kanban data for project:', projectId)
      loadInitialData()
    }
  }, [projectId])

  // Set up real-time listeners for this specific project
  useEffect(() => {
    if (!projectId || !socketService.isSocketConnected()) return

    console.log('🎧 Setting up Kanban real-time listeners for project:', projectId)

    const handleTaskCreated = (data) => {
      const taskProjectId = typeof data.task.project === 'object' ? data.task.project._id : data.task.project
      if (taskProjectId === projectId) {
        console.log('📋 Task created for this project:', data.task.title)
        toast.success(`New task "${data.task.title}" created`)
      }
    }

    const handleTaskUpdated = (data) => {
      const taskProjectId = typeof data.task.project === 'object' ? data.task.project._id : data.task.project
      if (taskProjectId === projectId) {
        console.log('📋 Task updated for this project:', data.task.title)
      }
    }

    const handleTaskDeleted = (data) => {
      console.log('📋 Task deleted:', data.taskId)
      toast.info('Task deleted')
    }

    const handleTasksReordered = (data) => {
      console.log('📋 Tasks reordered')
    }

    // Register listeners
    socketService.on('task_created', handleTaskCreated)
    socketService.on('task_updated', handleTaskUpdated)
    socketService.on('task_deleted', handleTaskDeleted)
    socketService.on('tasks_reordered', handleTasksReordered)

    return () => {
      socketService.off('task_created', handleTaskCreated)
      socketService.off('task_updated', handleTaskUpdated)
      socketService.off('task_deleted', handleTaskDeleted)
      socketService.off('tasks_reordered', handleTasksReordered)
    }
  }, [projectId])

  const loadInitialData = async () => {
    try {
      setLocalLoading(true)
      console.log('🔄 Loading tasks for project:', projectId)
      
      // Load tasks for this project
      const tasksResponse = await tasksAPI.getProjectTasks(projectId)
      const newProjectTasks = tasksResponse.tasks || []
      console.log('📋 Loaded tasks:', newProjectTasks.length)
      
      // Update tasks in real-time context (replace tasks for this project)
      const otherTasks = tasks.filter(t => {
        if (!t.project) return true
        const taskProjectId = typeof t.project === 'object' ? t.project._id : t.project
        return taskProjectId !== projectId
      })
      
      const updatedTasks = [...otherTasks, ...newProjectTasks]
      actions.setTasks(updatedTasks)
      
      // Load project details if not already in context
      if (!currentProject) {
        console.log('🔄 Loading project details:', projectId)
        const projectResponse = await projectsAPI.getProjectById(projectId)
        if (projectResponse.success && projectResponse.project) {
          const updatedProjects = [...projects, projectResponse.project]
          actions.setProjects(updatedProjects)
        }
      }
    } catch (error) {
      console.error('❌ Failed to load kanban data:', error)
      toast.error('Failed to load kanban data')
    } finally {
      setLocalLoading(false)
    }
  }

  // Get tasks by status from real-time context
  const getTasksByStatus = (status) => {
    return projectTasks.filter(task => task.status === status)
      .sort((a, b) => (a.position || 0) - (b.position || 0))
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    
    if (!newTask.title.trim()) {
      toast.error('Task title is required')
      return
    }

    try {
      console.log('📋 Creating task:', newTask.title)
      const taskData = {
        ...newTask,
        project: projectId,
        tags: newTask.tags.filter(tag => tag.trim() !== '')
      }

      const response = await tasksAPI.createTask(taskData)
      console.log('✅ Task created:', response)
      
      // Task will be added via real-time context
      setShowNewTaskModal(false)
      setNewTask({
        title: '',
        description: '',
        assignee: '',
        priority: 'medium',
        dueDate: '',
        tags: [],
        status: 'todo'
      })
      
      toast.success('Task created successfully!')
    } catch (error) {
      console.error('❌ Failed to create task:', error)
      toast.error('Failed to create task')
    }
  }

  const handleUpdateTask = async (taskId, updates) => {
    try {
      console.log('📋 Updating task:', taskId, updates)
      const response = await tasksAPI.updateTask(taskId, updates)
      console.log('✅ Task updated:', response)
      // Task will be updated via real-time context
    } catch (error) {
      console.error('❌ Failed to update task:', error)
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      console.log('📋 Deleting task:', taskId)
      await tasksAPI.deleteTask(taskId)
      console.log('✅ Task deleted')
      // Task will be removed via real-time context
    } catch (error) {
      console.error('❌ Failed to delete task:', error)
      toast.error('Failed to delete task')
    }
  }

  const handleDragStart = (e, task) => {
    console.log('🎯 Drag start:', task.title)
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, newStatus) => {
    e.preventDefault()
    
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null)
      return
    }

    console.log('🎯 Dropping task:', draggedTask.title, 'to status:', newStatus)

    try {
      // Update task status immediately for optimistic UI
      const optimisticUpdate = { ...draggedTask, status: newStatus }
      const updatedTasks = tasks.map(t => 
        t._id === draggedTask._id ? optimisticUpdate : t
      )
      actions.setTasks(updatedTasks)

      // Update task status on server
      await handleUpdateTask(draggedTask._id, { status: newStatus })
      
      // Update positions for all tasks in the new column
      const tasksInColumn = projectTasks.filter(t => t.status === newStatus)
      const bulkUpdates = tasksInColumn.map((task, index) => ({
        id: task._id,
        position: index,
        status: newStatus
      }))

      if (bulkUpdates.length > 0) {
        console.log('📋 Updating task positions:', bulkUpdates.length)
        await tasksAPI.bulkUpdatePositions(bulkUpdates)
      }

      toast.success(`Task moved to ${newStatus}`)
    } catch (error) {
      console.error('❌ Failed to move task:', error)
      toast.error('Failed to move task')
      // Revert optimistic update on error
      loadInitialData()
    }

    setDraggedTask(null)
  }

  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  if (loading.tasks || localLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading Kanban board...</p>
        </div>
      </div>
    )
  }

  if (!projectId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">Please select a project to view the Kanban board</p>
        </div>
      </div>
    )
  }

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">Project not found</p>
          <button 
            onClick={loadInitialData}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kanban Board</h2>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-sm text-gray-600">
              Project: {currentProject?.name || 'Loading...'}
            </p>
            <p className="text-sm text-gray-600">
              Tasks: {projectTasks.length}
            </p>
            <p className="text-sm text-gray-600">
              Team: {projectTeam.length} members
            </p>
            {loading.tasks && (
              <div className="flex items-center gap-1 text-blue-600">
                <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">Syncing...</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadInitialData}
            disabled={localLoading}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            title="Refresh tasks"
          >
            <RefreshCw className={`w-4 h-4 ${localLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 grid grid-cols-4 gap-6 overflow-hidden">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`${column.color} rounded-lg p-4 flex flex-col`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">{column.title}</h3>
              <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
                {getTasksByStatus(column.id).length}
              </span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
              <AnimatePresence>
                {getTasksByStatus(column.id).map((task) => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                  >
                    {/* Task Header */}
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm leading-tight">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Task Description */}
                    {task.description && (
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Tags */}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {task.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            <Tag className="w-2 h-2" />
                            {tag}
                          </span>
                        ))}
                        {task.tags.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{task.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Progress Bar */}
                    {task.progress > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Progress</span>
                          <span className="text-xs text-gray-600">{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Task Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Priority */}
                        <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`}></div>
                        
                        {/* Due Date */}
                        {task.dueDate && (
                          <div className={`flex items-center gap-1 text-xs ${
                            isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            {formatDate(task.dueDate)}
                          </div>
                        )}

                        {/* Comments */}
                        {task.comments && task.comments.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MessageCircle className="w-3 h-3" />
                            {task.comments.length}
                          </div>
                        )}
                      </div>

                      {/* Assignee */}
                      {task.assignee && (
                        <div className="flex items-center" title={
                          typeof task.assignee === 'object' 
                            ? task.assignee.name 
                            : projectTeam.find(m => m.user._id === task.assignee)?.user.name || 'Unknown'
                        }>
                          {typeof task.assignee === 'object' ? (
                            // Assignee is populated object
                            task.assignee.avatar ? (
                              <img
                                src={task.assignee.avatar}
                                alt={task.assignee.name}
                                className="w-6 h-6 rounded-full"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                {task.assignee.name?.charAt(0) || 'U'}
                              </div>
                            )
                          ) : (
                            // Assignee is just an ID, find in project team
                            (() => {
                              const teamMember = projectTeam.find(m => m.user._id === task.assignee)
                              return teamMember ? (
                                teamMember.user.avatar ? (
                                  <img
                                    src={teamMember.user.avatar}
                                    alt={teamMember.user.name}
                                    className="w-6 h-6 rounded-full"
                                  />
                                ) : (
                                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                    {teamMember.user.name?.charAt(0) || 'U'}
                                  </div>
                                )
                              ) : (
                                <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                  ?
                                </div>
                              )
                            })()
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Empty State */}
              {getTasksByStatus(column.id).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Plus className="w-6 h-6" />
                  </div>
                  <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
                  {column.id === 'todo' && (
                    <button
                      onClick={() => setShowNewTaskModal(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm mt-1"
                    >
                      Add your first task
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Task Modal */}
      <AnimatePresence>
        {showNewTaskModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowNewTaskModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
                <button
                  onClick={() => setShowNewTaskModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter task description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign To
                  </label>
                  <select
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Unassigned</option>
                    {projectTeam.map((member) => (
                      <option key={member.user._id} value={member.user._id}>
                        {member.user.name} ({member.role})
                      </option>
                    ))}
                  </select>
                  {projectTeam.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      No team members available. Add members to the project first.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={newTask.status}
                      onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="todo">To Do</option>
                      <option value="progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewTaskModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}