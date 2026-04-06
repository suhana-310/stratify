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
  Layers
} from 'lucide-react'
import { projectsAPI, usersAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import socketService from '../../services/socket'
import { toast } from 'react-hot-toast'
import Card from '../ui/Card'
import LoadingSpinner from '../ui/LoadingSpinner'
import Badge from '../ui/Badge'

export default function DashboardOverviewReal() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('week')
  const [showNotifications, setShowNotifications] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState({
    activeProjects: 0,
    teamMembers: 0,
    hoursThisWeek: 0,
    completedTasks: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [notifications, setNotifications] = useState([])
  const { user } = useAuth()

  const timeframes = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ]

  // Load dashboard data
  useEffect(() => {
    loadDashboardData()
  }, [selectedTimeframe])

  // Set up real-time listeners
  useEffect(() => {
    if (socketService.isSocketConnected()) {
      socketService.on('project_created', handleProjectCreated)
      socketService.on('project_updated', handleProjectUpdated)
      socketService.on('project_deleted', handleProjectDeleted)
      socketService.on('team_member_added', handleTeamMemberAdded)
      socketService.on('user_online', handleUserOnline)
      socketService.on('user_offline', handleUserOffline)

      return () => {
        socketService.off('project_created', handleProjectCreated)
        socketService.off('project_updated', handleProjectUpdated)
        socketService.off('project_deleted', handleProjectDeleted)
        socketService.off('team_member_added', handleTeamMemberAdded)
        socketService.off('user_online', handleUserOnline)
        socketService.off('user_offline', handleUserOffline)
      }
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Load projects
      const projectsResponse = await projectsAPI.getProjects({ limit: 10 })
      const projectsData = projectsResponse.projects || []
      setProjects(projectsData)

      // Calculate stats
      const activeProjects = projectsData.filter(p => p.status === 'active').length
      const completedProjects = projectsData.filter(p => p.status === 'completed').length
      
      // Load users for team stats
      const usersResponse = await usersAPI.getUsers({ limit: 50 })
      const usersData = usersResponse.users || []
      
      setStats({
        activeProjects,
        teamMembers: usersData.length,
        hoursThisWeek: Math.floor(Math.random() * 200) + 100, // Mock data
        completedTasks: completedProjects * 10 + Math.floor(Math.random() * 50)
      })

      // Generate recent activity from real data
      generateRecentActivity(projectsData, usersData)
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const generateRecentActivity = (projectsData, usersData) => {
    const activities = []
    const actions = [
      'completed task',
      'updated project',
      'commented on',
      'created task',
      'deployed to'
    ]
    
    projectsData.slice(0, 5).forEach((project, index) => {
      const randomUser = usersData[Math.floor(Math.random() * usersData.length)]
      const randomAction = actions[Math.floor(Math.random() * actions.length)]
      
      activities.push({
        id: index + 1,
        user: randomUser?.name || 'Team Member',
        action: randomAction,
        target: project.name,
        time: `${Math.floor(Math.random() * 60)} minutes ago`,
        avatar: randomUser?.name?.charAt(0) || 'T',
        type: ['success', 'info', 'comment', 'create', 'deploy'][Math.floor(Math.random() * 5)],
        project: project.name,
        details: `Working on ${project.name}`
      })
    })
    
    setRecentActivity(activities)
  }

  // Real-time event handlers
  const handleProjectCreated = (data) => {
    setProjects(prev => [data.project, ...prev.slice(0, 9)])
    setStats(prev => ({ ...prev, activeProjects: prev.activeProjects + 1 }))
    
    // Add to recent activity
    setRecentActivity(prev => [{
      id: Date.now(),
      user: data.project.owner?.name || 'Team Member',
      action: 'created project',
      target: data.project.name,
      time: 'just now',
      avatar: data.project.owner?.name?.charAt(0) || 'T',
      type: 'create',
      project: data.project.name,
      details: `New project created`
    }, ...prev.slice(0, 4)])
  }

  const handleProjectUpdated = (data) => {
    setProjects(prev => prev.map(project => 
      project._id === data.project._id ? data.project : project
    ))
    
    // Add to recent activity
    setRecentActivity(prev => [{
      id: Date.now(),
      user: user?.name || 'You',
      action: 'updated project',
      target: data.project.name,
      time: 'just now',
      avatar: user?.name?.charAt(0) || 'Y',
      type: 'info',
      project: data.project.name,
      details: `Project updated`
    }, ...prev.slice(0, 4)])
  }

  const handleProjectDeleted = (data) => {
    setProjects(prev => prev.filter(project => project._id !== data.projectId))
    setStats(prev => ({ ...prev, activeProjects: Math.max(0, prev.activeProjects - 1) }))
  }

  const handleTeamMemberAdded = (data) => {
    setStats(prev => ({ ...prev, teamMembers: prev.teamMembers + 1 }))
    
    // Add to recent activity
    setRecentActivity(prev => [{
      id: Date.now(),
      user: data.newMember.name,
      action: 'joined project',
      target: data.project.name,
      time: 'just now',
      avatar: data.newMember.name?.charAt(0) || 'T',
      type: 'success',
      project: data.project.name,
      details: `New team member joined`
    }, ...prev.slice(0, 4)])
  }

  const handleUserOnline = (data) => {
    // Could update online user count or show notification
  }

  const handleUserOffline = (data) => {
    // Could update online user count
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
    setRefreshing(false)
    toast.success('Dashboard refreshed!')
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
      action: () => toast.success('New Project modal would open')
    },
    { 
      icon: UserPlus, 
      label: 'Add Member', 
      color: 'bg-green-500',
      action: () => toast.success('Add Member modal would open')
    },
    { 
      icon: FileText, 
      label: 'Create Report', 
      color: 'bg-purple-500',
      action: () => toast.success('Create Report modal would open')
    },
    { 
      icon: Calendar, 
      label: 'Schedule Meeting', 
      color: 'bg-orange-500',
      action: () => toast.success('Schedule Meeting modal would open')
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="content-spacing w-full max-w-none">
      {/* Header Section with Controls */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your projects.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Timeframe Selector */}
          <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1">
            {timeframes.map((timeframe) => (
              <motion.button
                key={timeframe.value}
                onClick={() => setSelectedTimeframe(timeframe.value)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
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

          {/* Refresh Button */}
          <motion.button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </motion.button>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                onClick={action.action}
                className={`p-3 ${action.color} text-white rounded-xl hover:shadow-lg transition-all duration-200`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                title={action.label}
              >
                <action.icon className="w-5 h-5" />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <motion.div 
                      className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <stat.icon className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-xs text-gray-500 mb-3">{stat.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <motion.div
                  className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                    stat.trend === 'up' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </motion.div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">vs last {selectedTimeframe}</p>
                  <p className={`text-sm font-semibold ${
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
            <div className="pb-4 border-b border-gray-200 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  Recent Projects
                  <Badge variant="secondary" className="ml-2">
                    {projects.length}
                  </Badge>
                </h3>
                <motion.button 
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="View all projects"
                >
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </motion.button>
              </div>
            </div>
            <div className="space-y-4">
              {projects.slice(0, 5).map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </h4>
                      <div className="flex items-center gap-2 mb-3">
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
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(project.timeline.endDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-600 font-medium">Progress</span>
                      <span className="text-gray-900 font-semibold">{project.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress || 0}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {project.team?.slice(0, 3).map((member, i) => (
                        <motion.div
                          key={i}
                          className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-semibold text-white border-2 border-white shadow-sm"
                          whileHover={{ scale: 1.1, zIndex: 10 }}
                          style={{ zIndex: project.team.length - i }}
                          title={member.user?.name || 'Team Member'}
                        >
                          {member.user?.name?.charAt(0) || 'T'}
                        </motion.div>
                      ))}
                      {project.team?.length > 3 && (
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-xs font-semibold text-white border-2 border-white">
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
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
            <div className="pb-4 border-b border-gray-200 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  Live Activity
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </h3>
                <motion.button 
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </motion.button>
              </div>
            </div>
            <div className="space-y-4">
              <AnimatePresence>
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-sm font-semibold text-white shadow-lg">
                        {activity.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'info' ? 'bg-blue-500' :
                        activity.type === 'comment' ? 'bg-yellow-500' :
                        activity.type === 'create' ? 'bg-purple-500' :
                        'bg-orange-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold">{activity.user}</span>{' '}
                        <span className="text-gray-600">{activity.action}</span>{' '}
                        <span className="font-medium text-blue-600">{activity.target}</span>
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
    </div>
  )
}