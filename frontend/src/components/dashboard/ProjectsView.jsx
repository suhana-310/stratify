import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  StickyNote,
  Minus,
  Circle,
  Square,
  Zap,
  Edit,
  Users,
  Calendar,
  BarChart3,
  FileText,
  Settings,
  Eye,
  Download,
  Share2,
  Archive,
  Trash2,
  Star,
  Clock,
  Target,
  Activity,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Pause,
  Play,
  UserPlus,
  Send,
  X
} from 'lucide-react'
import { projectsAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import socketService from '../../services/socket'
import { toast } from 'react-hot-toast'
import NewProjectModal from './NewProjectModal'

export default function ProjectsViewReal() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedProject, setSelectedProject] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedProjectForInvite, setSelectedProjectForInvite] = useState(null)
  const { user } = useAuth()

  // Load projects on component mount
  useEffect(() => {
    loadProjects()
  }, [])

  // Set up real-time listeners
  useEffect(() => {
    if (socketService.isSocketConnected()) {
      // Listen for project updates
      socketService.on('project_created', handleProjectCreated)
      socketService.on('project_updated', handleProjectUpdated)
      socketService.on('project_deleted', handleProjectDeleted)
      socketService.on('team_member_added', handleTeamMemberAdded)
      socketService.on('project_invitation', handleProjectInvitation)

      return () => {
        socketService.off('project_created', handleProjectCreated)
        socketService.off('project_updated', handleProjectUpdated)
        socketService.off('project_deleted', handleProjectDeleted)
        socketService.off('team_member_added', handleTeamMemberAdded)
        socketService.off('project_invitation', handleProjectInvitation)
      }
    }
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const response = await projectsAPI.getProjects({
        search: searchTerm,
        status: filterStatus !== 'all' ? filterStatus : undefined
      })
      setProjects(response.projects || [])
    } catch (error) {
      console.error('Failed to load projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  // Real-time event handlers
  const handleProjectCreated = (data) => {
    setProjects(prev => [data.project, ...prev])
    toast.success(`New project "${data.project.name}" created!`)
  }

  const handleProjectUpdated = (data) => {
    setProjects(prev => prev.map(project => 
      project._id === data.project._id ? data.project : project
    ))
    if (selectedProject?._id === data.project._id) {
      setSelectedProject(data.project)
    }
  }

  const handleProjectDeleted = (data) => {
    setProjects(prev => prev.filter(project => project._id !== data.projectId))
    if (selectedProject?._id === data.projectId) {
      setSelectedProject(null)
    }
    toast.info(`Project "${data.projectName}" was deleted`)
  }

  const handleTeamMemberAdded = (data) => {
    setProjects(prev => prev.map(project => 
      project._id === data.project._id ? data.project : project
    ))
    toast.success(`${data.newMember.name} joined "${data.project.name}"`)
  }

  const handleProjectInvitation = (data) => {
    toast.success(`You've been invited to "${data.project.name}" by ${data.invitedBy.name}!`)
    loadProjects() // Refresh to show new project
  }

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleCreateProject = async (projectData) => {
    try {
      const response = await projectsAPI.createProject(projectData)
      setShowNewProjectModal(false)
      toast.success('Project created successfully!')
      // Real-time update will handle adding to list
    } catch (error) {
      console.error('Failed to create project:', error)
      toast.error('Failed to create project')
    }
  }

  const handleUpdateProject = async (projectId, updates) => {
    try {
      await projectsAPI.updateProject(projectId, updates)
      toast.success('Project updated successfully!')
      // Real-time update will handle the UI update
    } catch (error) {
      console.error('Failed to update project:', error)
      toast.error('Failed to update project')
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      await projectsAPI.deleteProject(projectId)
      toast.success('Project deleted successfully!')
      // Real-time update will handle removing from list
    } catch (error) {
      console.error('Failed to delete project:', error)
      toast.error('Failed to delete project')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'on-hold': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  // Essential shortcuts data
  const shortcuts = [
    {
      id: 1,
      title: 'New Project',
      description: 'Create a new project',
      icon: Plus,
      color: 'bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600',
      action: () => setShowNewProjectModal(true)
    },
    {
      id: 2,
      title: 'Search Projects',
      description: 'Find projects quickly',
      icon: Search,
      color: 'bg-green-100 border-green-200',
      iconColor: 'text-green-600',
      action: () => document.getElementById('search-input')?.focus()
    },
    {
      id: 3,
      title: 'Filter Projects',
      description: 'Filter by status',
      icon: Filter,
      color: 'bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600',
      action: () => {}
    },
    {
      id: 4,
      title: 'Project Analytics',
      description: 'View project insights',
      icon: BarChart3,
      color: 'bg-orange-100 border-orange-200',
      iconColor: 'text-orange-600',
      action: () => setActiveTab('analytics')
    }
  ]

  // Helpful features data
  const features = [
    {
      id: 1,
      title: 'Team Management',
      description: 'Manage project teams',
      icon: Users,
      color: 'bg-pink-100 border-pink-200',
      iconColor: 'text-pink-600'
    },
    {
      id: 2,
      title: 'Task Tracking',
      description: 'Track project tasks',
      icon: CheckCircle2,
      color: 'bg-indigo-100 border-indigo-200',
      iconColor: 'text-indigo-600'
    },
    {
      id: 3,
      title: 'File Sharing',
      description: 'Share project files',
      icon: FileText,
      color: 'bg-teal-100 border-teal-200',
      iconColor: 'text-teal-600'
    },
    {
      id: 4,
      title: 'Real-time Updates',
      description: 'Live collaboration',
      icon: Activity,
      color: 'bg-red-100 border-red-200',
      iconColor: 'text-red-600'
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Project Overview', color: 'bg-teal-600' },
    { id: 'timeline', label: 'Project Timeline', color: 'bg-teal-700' },
    { id: 'analytics', label: 'Analytics', color: 'bg-teal-800' }
  ]

  return (
    <div className="w-full min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600">Manage your projects and collaborate with your team</p>
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Panel - Shortcuts and Features */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Essential shortcuts */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {shortcuts.map((shortcut) => (
                  <motion.div
                    key={shortcut.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={shortcut.action}
                    className={`${shortcut.color} border-2 rounded-xl p-4 cursor-pointer transition-all duration-200`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <shortcut.icon className={`w-8 h-8 ${shortcut.iconColor} mb-2`} />
                      <h3 className="font-semibold text-sm text-gray-900 mb-1">{shortcut.title}</h3>
                      <p className="text-xs text-gray-600">{shortcut.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Helpful features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Features</h2>
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature) => (
                  <motion.div
                    key={feature.id}
                    whileHover={{ scale: 1.02 }}
                    className={`${feature.color} border-2 rounded-xl p-4 cursor-pointer transition-all duration-200`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <feature.icon className={`w-8 h-8 ${feature.iconColor} mb-2`} />
                      <h3 className="font-semibold text-sm text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-xs text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                    activeTab === tab.id ? tab.color : 'bg-gray-400 hover:bg-gray-500'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Project Overview Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-4"></div>
                        <div className="h-2 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || filterStatus !== 'all' 
                        ? 'Try adjusting your search or filters' 
                        : 'Create your first project to get started'
                      }
                    </p>
                    <button
                      onClick={() => setShowNewProjectModal(true)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Project
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {filteredProjects.map((project, index) => (
                        <motion.div
                          key={project._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setSelectedProject(project)}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                                {project.name}
                              </h4>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {project.description || 'No description provided'}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                                {project.status === 'on-hold' ? 'ON HOLD' : project.status?.replace('_', ' ').toUpperCase()}
                              </span>
                              <div className={`w-3 h-3 rounded-full ${getPriorityColor(project.priority)}`}></div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-semibold text-gray-900">{project.progress || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                className="bg-blue-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${project.progress || 0}%` }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                              />
                            </div>
                          </div>

                          {/* Tags */}
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {project.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {project.tags.length > 3 && (
                                <span className="text-xs text-gray-500">+{project.tags.length - 3} more</span>
                              )}
                            </div>
                          )}

                          {/* Team and Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                {project.team?.slice(0, 3).map((member, memberIndex) => (
                                  <div
                                    key={memberIndex}
                                    className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                                    title={member.user?.name || 'Team Member'}
                                  >
                                    {member.user?.name?.charAt(0) || 'T'}
                                  </div>
                                ))}
                                {project.team?.length > 3 && (
                                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white">
                                    +{project.team.length - 3}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {project.timeline?.endDate && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(project.timeline.endDate).toLocaleDateString()}</span>
                                </div>
                              )}
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedProjectForInvite(project)
                                  setShowInviteModal(true)
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Invite team member"
                              >
                                <UserPlus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Project Timeline</h3>
                <div className="space-y-4">
                  {filteredProjects.map((project) => (
                    <div key={project._id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className={`w-4 h-4 rounded-full ${getPriorityColor(project.priority)}`}></div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{project.name}</h4>
                        <p className="text-sm text-gray-600">
                          {project.timeline?.startDate && project.timeline?.endDate && (
                            <>
                              {new Date(project.timeline.startDate).toLocaleDateString()} - {new Date(project.timeline.endDate).toLocaleDateString()}
                            </>
                          )}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status === 'on-hold' ? 'ON HOLD' : project.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Total Projects</h3>
                      <p className="text-2xl font-bold text-blue-600">{projects.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Completed</h3>
                      <p className="text-2xl font-bold text-green-600">
                        {projects.filter(p => p.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Active</h3>
                      <p className="text-2xl font-bold text-yellow-600">
                        {projects.filter(p => p.status === 'active').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  )
}