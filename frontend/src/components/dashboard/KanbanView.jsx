import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Calendar, MessageCircle } from 'lucide-react'

export default function KanbanView() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Design new landing page',
      description: 'Create a modern responsive design',
      assignee: { name: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', initials: 'SJ' },
      priority: 'High',
      status: 'todo',
      progress: 0,
      tags: ['Design', 'Frontend']
    },
    {
      id: 2,
      title: 'Setup CI/CD pipeline',
      description: 'Configure automated deployment',
      assignee: { name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', initials: 'MC' },
      priority: 'Medium',
      status: 'todo',
      progress: 0,
      tags: ['DevOps']
    },
    {
      id: 3,
      title: 'Implement user authentication',
      description: 'Add JWT-based authentication',
      assignee: { name: 'Emily Rodriguez', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', initials: 'ER' },
      priority: 'High',
      status: 'progress',
      progress: 65,
      tags: ['Backend', 'Security']
    },
    {
      id: 4,
      title: 'Create API documentation',
      description: 'Document all REST API endpoints',
      assignee: { name: 'David Kim', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', initials: 'DK' },
      priority: 'Low',
      status: 'progress',
      progress: 30,
      tags: ['Documentation']
    },
    {
      id: 5,
      title: 'Code review for payment module',
      description: 'Review and test payment system',
      assignee: { name: 'Lisa Wang', avatar: 'https://randomuser.me/api/portraits/women/5.jpg', initials: 'LW' },
      priority: 'High',
      status: 'review',
      progress: 90,
      tags: ['Review', 'Payment']
    },
    {
      id: 6,
      title: 'Database schema optimization',
      description: 'Optimize database performance',
      assignee: { name: 'James Wilson', avatar: 'https://randomuser.me/api/portraits/men/6.jpg', initials: 'JW' },
      priority: 'Medium',
      status: 'done',
      progress: 100,
      tags: ['Database', 'Performance']
    }
  ])
  const [draggedTask, setDraggedTask] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState('')

  const teamMembers = [
    { id: 1, name: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', initials: 'SJ' },
    { id: 2, name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', initials: 'MC' },
    { id: 3, name: 'Emily Rodriguez', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', initials: 'ER' },
    { id: 4, name: 'David Kim', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', initials: 'DK' }
  ]
  const columns = [
    { 
      id: 'todo', 
      title: 'TO-DO LIST', 
      color: '#EF4444',
      bgColor: '#FEF2F2',
      borderColor: '#FECACA'
    },
    { 
      id: 'progress', 
      title: 'IN PROGRESS', 
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      borderColor: '#BFDBFE'
    },
    { 
      id: 'review', 
      title: 'IN REVIEW', 
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A'
    },
    { 
      id: 'done', 
      title: 'DONE', 
      color: '#10B981',
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0'
    }
  ]

  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, newStatus) => {
    e.preventDefault()
    if (draggedTask) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === draggedTask.id
            ? { 
                ...task, 
                status: newStatus,
                progress: newStatus === 'done' ? 100 : task.progress
              }
            : task
        )
      )
      setDraggedTask(null)
    }
  }
  
  const updateTaskProgress = (taskId, newProgress) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { 
              ...task, 
              progress: newProgress,
              status: newProgress === 100 ? 'done' : task.status
            }
          : task
      )
    )
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-500 text-white'
      case 'Medium': return 'bg-yellow-500 text-white'
      case 'Low': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getTasksByStatus = (status) => tasks.filter(task => task.status === status)

  const calculateOverallProgress = () => {
    const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0)
    return Math.round(totalProgress / tasks.length)
  }

  return (
    <div className="w-full h-full">
      <div className="max-w-full mx-auto h-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Task Overview</h1>
        </div>

        {/* Top Section - Team and Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Team Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-2">TEAM</h2>
            <h3 className="text-sm font-semibold text-gray-600 mb-4">IN-CHARGE</h3>
            
            <div className="grid grid-cols-3 gap-3">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-teal-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                    {member.initials}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Task Statistics */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="space-y-4">
              {columns.map((column) => {
                const columnTasks = getTasksByStatus(column.id)
                const totalTasks = tasks.length
                const percentage = totalTasks > 0 ? Math.round((columnTasks.length / totalTasks) * 100) : 0
                
                return (
                  <div key={column.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: column.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">{column.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-900">{columnTasks.length}</span>
                      <span className="text-sm text-gray-500">{percentage}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Overall Progress Circle */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold text-gray-600 mb-4">Overall Progress</h3>
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                  fill="none"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10B981"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ 
                    strokeDashoffset: 2 * Math.PI * 40 * (1 - calculateOverallProgress() / 100)
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{calculateOverallProgress()}%</span>
              </div>
            </div>
          </div>
        </div>
        {/* Kanban Board */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-teal-700 rounded-3xl p-6 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((column, index) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex flex-col h-full"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div 
                  className="rounded-lg px-4 py-3 mb-4 border-2 flex items-center justify-between"
                  style={{ 
                    backgroundColor: column.bgColor,
                    borderColor: column.borderColor
                  }}
                >
                  <h3 className="text-xs font-bold text-gray-700 flex-1 text-center tracking-wide">
                    {column.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-white text-gray-700 px-2 py-1 rounded-full font-bold min-w-[24px] text-center">
                      {getTasksByStatus(column.id).length}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedColumn(column.id)
                        setShowAddModal(true)
                      }}
                      className="text-gray-600 hover:text-gray-800 transition-colors p-1 hover:bg-white/50 rounded"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                {/* Tasks Container */}
                <div className="flex-1 space-y-3 min-h-[400px]">
                  <AnimatePresence>
                    {getTasksByStatus(column.id).map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        className="bg-white rounded-xl p-4 shadow-sm cursor-move hover:shadow-md transition-all duration-200 group"
                      >
                        {/* Task Header */}
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-sm font-bold text-gray-900 leading-tight flex-1 pr-2">
                            {task.title}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full font-bold flex-shrink-0 ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>

                        {/* Task Description */}
                        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                          {task.description}
                        </p>

                        {/* Progress Section */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 font-medium">Progress</span>
                            <span className="text-xs font-bold text-gray-700">{task.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="h-2 rounded-full"
                              style={{ 
                                backgroundColor: task.progress === 100 
                                  ? '#10B981' 
                                  : task.progress >= 50 
                                    ? '#3B82F6' 
                                    : '#F59E0B'
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${task.progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {task.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Task Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-semibold">
                              {task.assignee.initials}
                            </div>
                            <span className="text-xs text-gray-600 font-medium">{task.assignee.initials}</span>
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              <span>2</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Mar 25</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Add New Task</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter task title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows="3"
                    placeholder="Enter task description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                      <option value="">Select assignee</option>
                      {teamMembers.map(member => (
                        <option key={member.id} value={member.name}>{member.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-lg">
                    Add Task
                  </button>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}