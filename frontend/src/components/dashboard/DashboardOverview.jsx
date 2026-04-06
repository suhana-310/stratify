import React, { useState, useEffect, useMemo, useCallback } from 'react'
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
import Card from '../ui/Card'
import LoadingSpinner from '../ui/LoadingSpinner'
import Badge from '../ui/Badge'

export default function DashboardOverview() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState('week')
  const [showNotifications, setShowNotifications] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const timeframes = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ]

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setRefreshing(false)
  }, [])

  const stats = [
    {
      title: 'Active Projects',
      value: '12',
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
      value: '24',
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
      value: '156',
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
      value: '89',
      change: '+15',
      trend: 'up',
      icon: CheckCircle,
      gradient: 'from-warning-500 to-warning-600',
      bgGradient: 'from-warning-50 to-warning-100',
      description: 'Tasks completed',
      percentage: 16.9
    }
  ]

  const recentProjects = [
    {
      id: 1,
      name: 'Website Redesign',
      progress: 75,
      status: 'In Progress',
      team: ['SJ', 'MK', 'AL'],
      dueDate: '2024-04-15',
      priority: 'High',
      tasksCompleted: 18,
      totalTasks: 24,
      category: 'Design',
      isStarred: true,
      lastActivity: '2 hours ago'
    },
    {
      id: 2,
      name: 'Mobile App Development',
      progress: 90,
      status: 'Review',
      team: ['JD', 'EM', 'RW'],
      dueDate: '2024-04-10',
      priority: 'Medium',
      tasksCompleted: 27,
      totalTasks: 30,
      category: 'Development',
      isStarred: false,
      lastActivity: '1 day ago'
    },
    {
      id: 3,
      name: 'API Integration',
      progress: 45,
      status: 'In Progress',
      team: ['TH', 'NK', 'LP'],
      dueDate: '2024-04-20',
      priority: 'Medium',
      tasksCompleted: 9,
      totalTasks: 20,
      category: 'Backend',
      isStarred: true,
      lastActivity: '3 hours ago'
    },
    {
      id: 4,
      name: 'Database Migration',
      progress: 100,
      status: 'Completed',
      team: ['SJ', 'MK'],
      dueDate: '2024-04-05',
      priority: 'Low',
      tasksCompleted: 15,
      totalTasks: 15,
      category: 'Infrastructure',
      isStarred: false,
      lastActivity: '1 week ago'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      user: 'John Doe',
      action: 'completed task',
      target: 'User Authentication',
      time: '2 minutes ago',
      avatar: 'JD',
      type: 'success',
      project: 'Website Redesign',
      details: 'Implemented OAuth 2.0 integration'
    },
    {
      id: 2,
      user: 'Sarah Johnson',
      action: 'updated project',
      target: 'Website Redesign',
      time: '15 minutes ago',
      avatar: 'SJ',
      type: 'info',
      project: 'Website Redesign',
      details: 'Updated project timeline and milestones'
    },
    {
      id: 3,
      user: 'Mike Kim',
      action: 'commented on',
      target: 'API Endpoints',
      time: '1 hour ago',
      avatar: 'MK',
      type: 'comment',
      project: 'API Integration',
      details: 'Suggested improvements to error handling'
    },
    {
      id: 4,
      user: 'Emily Rodriguez',
      action: 'created task',
      target: 'UI Components',
      time: '2 hours ago',
      avatar: 'ER',
      type: 'create',
      project: 'Mobile App Development',
      details: 'Added new component library tasks'
    },
    {
      id: 5,
      user: 'Alex Thompson',
      action: 'deployed to',
      target: 'Staging Environment',
      time: '4 hours ago',
      avatar: 'AT',
      type: 'deploy',
      project: 'API Integration',
      details: 'Successfully deployed v2.1.0'
    }
  ]

  const notifications = [
    {
      id: 1,
      title: 'Project deadline approaching',
      message: 'Website Redesign is due in 3 days',
      type: 'warning',
      time: '1 hour ago',
      isRead: false
    },
    {
      id: 2,
      title: 'New team member joined',
      message: 'Alex Thompson joined the Mobile App team',
      type: 'info',
      time: '2 hours ago',
      isRead: false
    },
    {
      id: 3,
      title: 'Task completed',
      message: 'Database Migration has been completed',
      type: 'success',
      time: '1 day ago',
      isRead: true
    }
  ]

  const quickActions = [
    { icon: Plus, label: 'New Project', color: 'bg-blue-500' },
    { icon: UserPlus, label: 'Add Member', color: 'bg-green-500' },
    { icon: FileText, label: 'Create Report', color: 'bg-purple-500' },
    { icon: Calendar, label: 'Schedule Meeting', color: 'bg-orange-500' }
  ]

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Completed': return 'success'
      case 'Review': return 'warning'
      case 'In Progress': return 'primary'
      default: return 'secondary'
    }
  }

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'High': return 'error'
      case 'Medium': return 'warning'
      case 'Low': return 'success'
      default: return 'secondary'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Design': return 'bg-pink-100 text-pink-700'
      case 'Development': return 'bg-blue-100 text-blue-700'
      case 'Backend': return 'bg-green-100 text-green-700'
      case 'Infrastructure': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'success': return CheckCircle
      case 'info': return FileText
      case 'comment': return MessageCircle
      case 'create': return Plus
      case 'deploy': return GitCommit
      default: return Activity
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
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

          {/* Notifications */}
          <div className="relative">
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200 relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                          !notification.isRead ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'warning' ? 'bg-yellow-500' :
                            notification.type === 'success' ? 'bg-green-500' :
                            'bg-blue-500'
                          }`} />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                            <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                            <p className="text-gray-400 text-xs mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
      <div className="dashboard-grid dashboard-grid-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="card-base relative overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer">
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
              
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <motion.div 
                        className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300`}
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
            </div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-grid dashboard-grid-2">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="card-base h-full">
            <div className="pb-4 border-b border-gray-200 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  Recent Projects
                  <Badge variant="secondary" className="ml-2">
                    {recentProjects.length}
                  </Badge>
                </h3>
                <div className="flex items-center gap-2">
                  <motion.button 
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Filter projects"
                  >
                    <Filter className="w-4 h-4 text-gray-500" />
                  </motion.button>
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
            </div>
            <div className="space-y-4">
              {recentProjects.map((project, index) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glass-subtle rounded-xl p-4 hover:bg-white/20 transition-all duration-200 cursor-pointer group border border-white/10"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </h4>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          project.status === 'Review' ? 'bg-yellow-100 text-yellow-700' :
                          project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {project.status}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          project.priority === 'High' ? 'bg-red-100 text-red-700' :
                          project.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {project.priority}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {project.dueDate}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-600 font-medium">Progress</span>
                      <span className="text-gray-900 font-semibold">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {project.team.map((member, i) => (
                        <motion.div
                          key={i}
                          className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-semibold text-white border-2 border-white shadow-sm"
                          whileHover={{ scale: 1.1, zIndex: 10 }}
                          style={{ zIndex: project.team.length - i }}
                        >
                          {member}
                        </motion.div>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {project.team.length} member{project.team.length > 1 ? 's' : ''}
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
          <div className="card-base h-full">
            <div className="pb-4 border-b border-gray-200 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Recent Activity
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
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
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
                      'bg-purple-500'
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
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8"
      >
        <div className="card-base">
          <div className="pb-4 border-b border-gray-200 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Performance Insights
              </h3>
              <div className="flex items-center gap-2">
                <motion.button 
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4" />
                  Export Report
                </motion.button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Team Efficiency</h4>
              <p className="text-2xl font-bold text-blue-600 mb-1">94%</p>
              <p className="text-sm text-gray-600">Above average</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Timer className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Avg. Completion Time</h4>
              <p className="text-2xl font-bold text-green-600 mb-1">2.3 days</p>
              <p className="text-sm text-gray-600">15% faster</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Project Success Rate</h4>
              <p className="text-2xl font-bold text-purple-600 mb-1">98%</p>
              <p className="text-sm text-gray-600">Excellent</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}