import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Zap,
  Target,
  Calendar,
  Plus,
  Activity,
  Folder,
  MessageCircle,
  GitCommit,
  UserPlus,
  FileText,
  AlertCircle,
  ExternalLink,
  BarChart3,
  PieChart,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Star,
  Bookmark,
  Eye,
  Settings,
  ChevronRight,
  Sparkles,
  Award,
  Timer,
  Layers,
  Search,
  Edit,
  Trash2,
  Share2,
  Copy,
  Archive
} from 'lucide-react'
import { projectsAPI, usersAPI, tasksAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { useRealtime } from '../../contexts/RealtimeContext'
import socketService from '../../services/socket'
import { toast } from 'react-hot-toast'
import Card from '../ui/Card'
import LoadingSpinner from '../ui/LoadingSpinner'
import Badge from '../ui/Badge'
import AddMemberModal from './AddMemberModal'
import ProjectSelectionModal from './ProjectSelectionModal'
import NewProjectModal from './NewProjectModal'

export default function DashboardOverviewReal({ onProjectSelect }) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState('week')
  const [showNotifications, setShowNotifications] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [showProjectSelectionModal, setShowProjectSelectionModal] = useState(false)
  const [selectedProjectForMember, setSelectedProjectForMember] = useState(null)
  const [showCreateReportModal, setShowCreateReportModal] = useState(false)
  const [showScheduleMeetingModal, setShowScheduleMeetingModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showProjectActions, setShowProjectActions] = useState(null)
  const { user } = useAuth()
  const { 
    projects, 
    tasks, 
    users, 
    activities, 
    stats, 
    loading, 
    connected, 
    actions 
  } = useRealtime()

  const timeframes = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ]

  // Load initial data when component mounts (only if not already loaded)
  useEffect(() => {
    if (projects.length === 0 && !loading.projects) {
      console.log('📊 Dashboard: Loading initial data...')
      loadDashboardData()
    }
  }, [])

  // Refresh data when timeframe changes
  useEffect(() => {
    if (selectedTimeframe) {
      console.log('📊 Dashboard: Timeframe changed, refreshing stats...')
      // Only refresh stats, not all data
      refreshStats()
    }
  }, [selectedTimeframe])

  const refreshStats = () => {
    // Update stats based on current data and timeframe
    const activeProjects = projects.filter(p => p.status === 'active').length
    const completedTasks = tasks.filter(t => t.status === 'done').length
    const teamMembers = users.length
    
    actions.updateStats({
      activeProjects,
      completedTasks,
      teamMembers,
      hoursThisWeek: Math.floor(Math.random() * 200) + 100 // Mock data for now
    })
  }

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      console.log('🔄 Loading dashboard data...')
      
      // Use the RealtimeContext's loadInitialData function
      await actions.loadInitialData()
      
      console.log('✅ Dashboard data loaded successfully')
      
    } catch (error) {
      console.error('❌ Failed to load dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  // Click outside handler for project actions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProjectActions && !event.target.closest('.project-actions')) {
        setShowProjectActions(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showProjectActions])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
    setRefreshing(false)
    toast.success('Dashboard refreshed!')
  }

  // Handle new project creation or editing
  const handleCreateProject = async (projectData) => {
    try {
      let response
      
      if (projectData._id) {
        // Editing existing project
        const { _id, ...updateData } = projectData
        response = await projectsAPI.updateProject(_id, updateData)
        
        if (response.success) {
          toast.success('Project updated successfully!')
        } else {
          toast.error(response.message || 'Failed to update project')
        }
      } else {
        // Creating new project
        response = await projectsAPI.createProject(projectData)
        
        if (response.success) {
          toast.success('Project created successfully!')
        } else {
          toast.error(response.message || 'Failed to create project')
        }
      }
      
      setShowNewProjectModal(false)
      setSelectedProject(null)
    } catch (error) {
      console.error('Failed to save project:', error)
      toast.error('Failed to save project. Please try again.')
    }
  }

  const handleProjectSelectionForMember = (project) => {
    setSelectedProjectForMember(project)
    setShowProjectSelectionModal(false)
    setShowAddMemberModal(true)
  }

  // Handle project actions
  const handleProjectAction = async (action, project) => {
    try {
      switch (action) {
        case 'edit':
          setSelectedProject(project)
          setShowNewProjectModal(true)
          break
        case 'delete':
          if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
            await projectsAPI.deleteProject(project._id)
            toast.success('Project deleted successfully!')
          }
          break
        case 'archive':
          await projectsAPI.updateProject(project._id, { status: 'archived' })
          toast.success('Project archived successfully!')
          break
        case 'duplicate':
          const duplicateData = {
            ...project,
            name: `${project.name} (Copy)`,
            _id: undefined,
            createdAt: undefined,
            updatedAt: undefined
          }
          await projectsAPI.createProject(duplicateData)
          toast.success('Project duplicated successfully!')
          break
        case 'share':
          navigator.clipboard.writeText(`${window.location.origin}/projects/${project._id}`)
          toast.success('Project link copied to clipboard!')
          break
        default:
          break
      }
    } catch (error) {
      console.error(`Failed to ${action} project:`, error)
      toast.error(`Failed to ${action} project. Please try again.`)
    }
    setShowProjectActions(null)
  }

  // Quick action handlers
  const handleQuickAction = (actionType) => {
    switch (actionType) {
      case 'new-project':
        setSelectedProject(null)
        setShowNewProjectModal(true)
        break
      case 'add-member':
        // Show project selection modal first
        setShowProjectSelectionModal(true)
        break
      case 'create-report':
        setShowCreateReportModal(true)
        break
      case 'schedule-meeting':
        setShowScheduleMeetingModal(true)
        break
      default:
        toast.info(`${actionType} feature coming soon!`)
    }
  }

  const statsData = [
    {
      title: 'Active Projects',
      value: stats.activeProjects.toString(),
      change: '+2',
      trend: 'up',
      icon: Target,
      gradient: 'from-primary-500 to-primary-600',
      bgGradient: 'from-primary-50 to-primary-100',
      description: 'Projects in progress',
      percentage: 15.8
    },
    {
      title: 'Team Members',
      value: stats.teamMembers.toString(),
      change: '+3',
      trend: 'up',
      icon: Users,
      gradient: 'from-success-500 to-success-600',
      bgGradient: 'from-success-50 to-success-100',
      description: 'Active team members',
      percentage: 12.5
    },
    {
      title: 'Hours This Week',
      value: stats.hoursThisWeek.toString(),
      change: '-12',
      trend: 'down',
      icon: Clock,
      gradient: 'from-accent-500 to-accent-600',
      bgGradient: 'from-accent-50 to-accent-100',
      description: 'Total logged hours',
      percentage: -7.7
    },
    {
      title: 'Completed Tasks',
      value: stats.completedTasks.toString(),
      change: '+15',
      trend: 'up',
      icon: CheckCircle,
      gradient: 'from-warning-500 to-warning-600',
      bgGradient: 'from-warning-50 to-warning-100',
      description: 'Tasks completed',
      percentage: 16.9
    }
  ]

  const quickActions = [
    { 
      icon: Plus, 
      label: 'New Project', 
      color: 'bg-blue-500',
      action: () => handleQuickAction('new-project')
    },
    { 
      icon: UserPlus, 
      label: 'Add Member', 
      color: 'bg-green-500',
      action: () => handleQuickAction('add-member')
    },
    { 
      icon: FileText, 
      label: 'Create Report', 
      color: 'bg-purple-500',
      action: () => handleQuickAction('create-report')
    },
    { 
      icon: Calendar, 
      label: 'Schedule Meeting', 
      color: 'bg-orange-500',
      action: () => handleQuickAction('schedule-meeting')
    }
  ]

  if (isLoading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="content-spacing w-full max-w-none p-responsive">
      {/* Header Section with Controls */}
      <motion.div 
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6 mb-6 lg:mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Here's what's happening with your projects.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Timeframe Selector */}
          <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1 overflow-x-auto">
            {timeframes.map((timeframe) => (
              <motion.button
                key={timeframe.value}
                onClick={() => setSelectedTimeframe(timeframe.value)}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap touch-target ${
                  selectedTimeframe === timeframe.value
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {timeframe.label}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh Button */}
            <motion.button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 sm:p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 touch-target"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Refresh dashboard"
            >
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </motion.button>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.label}
                  onClick={action.action}
                  className={`p-2 sm:p-3 ${action.color} text-white rounded-xl hover:shadow-lg transition-all duration-200 touch-target`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  title={action.label}
                >
                  <action.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                    <motion.div 
                      className={`p-2 sm:p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg flex-shrink-0`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </motion.div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.value}</p>
                  <p className="text-xs text-gray-500 mb-2 sm:mb-3 truncate">{stat.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <motion.div
                  className={`flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${
                    stat.trend === 'up' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  ) : (
                    <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  )}
                  {stat.change}
                </motion.div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">vs last {selectedTimeframe}</p>
                  <p className={`text-xs sm:text-sm font-semibold ${
                    stat.percentage > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.percentage > 0 ? '+' : ''}{stat.percentage}%
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 h-full">
            <div className="pb-3 sm:pb-4 border-b border-gray-200 mb-4 sm:mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  <span className="truncate">Recent Projects</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {projects.length}
                  </Badge>
                </h3>
                <motion.button 
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 touch-target"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="View all projects"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                </motion.button>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
              {projects.slice(0, 5).map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-3 sm:p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer group relative"
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={() => onProjectSelect && onProjectSelect(project._id)}
                >
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-blue-600 transition-colors truncate pr-2">
                          {project.name}
                        </h4>
                        <div className="relative project-actions flex-shrink-0">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowProjectActions(showProjectActions === project._id ? null : project._id)
                            }}
                            className="p-1 hover:bg-gray-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100 touch-target"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          </motion.button>
                          
                          {/* Project Actions Dropdown */}
                          <AnimatePresence>
                            {showProjectActions === project._id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 min-w-[160px]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => handleProjectAction('edit', project)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 touch-target"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit Project
                                </button>
                                <button
                                  onClick={() => handleProjectAction('duplicate', project)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 touch-target"
                                >
                                  <Copy className="w-4 h-4" />
                                  Duplicate
                                </button>
                                <button
                                  onClick={() => handleProjectAction('share', project)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 touch-target"
                                >
                                  <Share2 className="w-4 h-4" />
                                  Share Link
                                </button>
                                <button
                                  onClick={() => handleProjectAction('archive', project)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 touch-target"
                                >
                                  <Archive className="w-4 h-4" />
                                  Archive
                                </button>
                                <hr className="my-1" />
                                <button
                                  onClick={() => handleProjectAction('delete', project)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 touch-target"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          project.status === 'completed' ? 'bg-green-100 text-green-700' :
                          project.status === 'active' ? 'bg-blue-100 text-blue-700' :
                          project.status === 'planning' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {project.status === 'on-hold' ? 'ON HOLD' : project.status?.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          project.priority === 'high' ? 'bg-red-100 text-red-700' :
                          project.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {project.priority?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    {project.timeline?.endDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0 ml-2">
                        <Calendar className="w-3 h-3" />
                        <span className="hidden sm:inline">
                          {new Date(project.timeline.endDate).toLocaleDateString()}
                        </span>
                        <span className="sm:hidden">
                          {new Date(project.timeline.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-2 sm:mb-3">
                    <div className="flex justify-between text-xs mb-1 sm:mb-2">
                      <span className="text-gray-600 font-medium">Progress</span>
                      <span className="text-gray-900 font-semibold">{project.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 sm:h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress || 0}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-1 sm:-space-x-2">
                      {project.team?.slice(0, 3).map((member, i) => (
                        <motion.div
                          key={i}
                          className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-semibold text-white border-2 border-white shadow-sm"
                          whileHover={{ scale: 1.1, zIndex: 10 }}
                          style={{ zIndex: project.team.length - i }}
                          title={member.user?.name || 'Team Member'}
                        >
                          {member.user?.name?.charAt(0) || 'T'}
                        </motion.div>
                      ))}
                      {project.team?.length > 3 && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-400 rounded-full flex items-center justify-center text-xs font-semibold text-white border-2 border-white">
                          +{project.team.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {project.team?.length || 0} member{(project.team?.length || 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 h-full">
            <div className="pb-3 sm:pb-4 border-b border-gray-200 mb-4 sm:mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  <span className="truncate">Live Activity</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </h3>
                <motion.button 
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 touch-target"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                </motion.button>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {activities.slice(0, 5).map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold text-white shadow-lg">
                        {activity.user?.charAt(0) || 'U'}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'info' ? 'bg-blue-500' :
                        activity.type === 'comment' ? 'bg-yellow-500' :
                        activity.type === 'create' ? 'bg-purple-500' :
                        activity.type === 'team' ? 'bg-green-500' :
                        'bg-orange-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-900 leading-relaxed">
                        <span className="font-semibold">{activity.user}</span>{' '}
                        <span className="text-gray-600">{activity.action}</span>{' '}
                        <span className="font-medium text-blue-600 truncate">{activity.target}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => {
          setShowNewProjectModal(false)
          setSelectedProject(null)
        }}
        onSubmit={handleCreateProject}
        initialData={selectedProject}
      />

      {/* Project Selection Modal */}
      <ProjectSelectionModal
        isOpen={showProjectSelectionModal}
        onClose={() => setShowProjectSelectionModal(false)}
        onProjectSelect={handleProjectSelectionForMember}
        title="Select Project for Team Management"
      />

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => {
          setShowAddMemberModal(false)
          setSelectedProjectForMember(null)
        }}
        projectId={selectedProjectForMember?._id}
        currentTeam={selectedProjectForMember?.team || []}
      />

      {/* Create Report Modal */}
      <AnimatePresence>
        {showCreateReportModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowCreateReportModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Create Report</h3>
                  <button
                    onClick={() => setShowCreateReportModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Type
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="weekly">Weekly Summary</option>
                      <option value="monthly">Monthly Report</option>
                      <option value="project">Project Status</option>
                      <option value="team">Team Performance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="date"
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowCreateReportModal(false)}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        toast.success('Report generation started!')
                        setShowCreateReportModal(false)
                      }}
                      className="flex-1 px-4 py-2 text-white bg-purple-500 rounded-xl hover:bg-purple-600 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Schedule Meeting Modal */}
      <AnimatePresence>
        {showScheduleMeetingModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowScheduleMeetingModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Schedule Meeting</h3>
                  <button
                    onClick={() => setShowScheduleMeetingModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meeting Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter meeting title"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowScheduleMeetingModal(false)}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        toast.success('Meeting scheduled successfully!')
                        setShowScheduleMeetingModal(false)
                      }}
                      className="flex-1 px-4 py-2 text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors"
                    >
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}