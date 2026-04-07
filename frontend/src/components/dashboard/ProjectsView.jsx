import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit,
  Users,
  Calendar,
  BarChart3,
  FileText,
  Eye,
  Share2,
  Archive,
  Trash2,
  Clock,
  Target,
  Activity,
  CheckCircle2,
  UserPlus,
  X,
  ExternalLink,
  Link as LinkIcon,
  Globe,
  Github,
  Figma,
  Monitor,
  BookOpen,
  RefreshCw
} from 'lucide-react'
import { projectsAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { useRealtime } from '../../contexts/RealtimeContext'
import socketService from '../../services/socket'
import { toast } from 'react-hot-toast'
import NewProjectModal from './NewProjectModal'
import ProjectLinksModal from './ProjectLinksModal'

export default function ProjectsViewReal({ onProjectSelect }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedProject, setSelectedProject] = useState(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showProjectLinksModal, setShowProjectLinksModal] = useState(false)
  const [selectedProjectForLinks, setSelectedProjectForLinks] = useState(null)
  const [showProjectActions, setShowProjectActions] = useState(null)
  const { user } = useAuth()
  const { projects, actions } = useRealtime()

  // Load projects on component mount (only if not already loaded)
  useEffect(() => {
    if (projects.length === 0) {
      console.log('📊 Projects: Loading initial data...')
      loadProjects()
    }
  }, [])

  // Reload when search or filter changes
  useEffect(() => {
    if (searchTerm || filterStatus !== 'all') {
      console.log('📊 Projects: Search/filter changed, reloading...')
      loadProjects()
    }
  }, [searchTerm, filterStatus])

  // Set up real-time listeners
  useEffect(() => {
    // Click outside handler for project actions
    const handleClickOutside = (event) => {
      if (showProjectActions && !event.target.closest('.project-actions')) {
        setShowProjectActions(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showProjectActions])

  const loadProjects = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading projects...', { searchTerm, filterStatus })
      
      const response = await projectsAPI.getProjects({
        search: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        limit: 100
      })
      
      const projectsData = response.projects || []
      console.log('📊 Loaded projects:', projectsData.length)
      
      // Update the real-time context with filtered data
      if (!searchTerm && filterStatus === 'all') {
        // Only update context if we're loading all projects (no filters)
        actions.setProjects(projectsData)
      }
      
    } catch (error) {
      console.error('❌ Failed to load projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadProjects()
    setRefreshing(false)
    toast.success('Projects refreshed!')
  }

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const handleEditProject = (project) => {
    setSelectedProject(project)
    setShowNewProjectModal(true)
  }

  const handleUpdateProject = async (projectId, updates) => {
    try {
      await projectsAPI.updateProject(projectId, updates)
      setShowNewProjectModal(false)
      setSelectedProject(null)
      toast.success('Project updated successfully!')
      // Real-time update will handle the UI update
    } catch (error) {
      console.error('Failed to update project:', error)
      toast.error('Failed to update project')
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return
    
    try {
      await projectsAPI.deleteProject(projectId)
      toast.success('Project deleted successfully!')
      // Real-time update will handle removing from list
    } catch (error) {
      console.error('Failed to delete project:', error)
      toast.error('Failed to delete project')
    }
  }

  const handleArchiveProject = async (projectId) => {
    try {
      await projectsAPI.updateProject(projectId, { status: 'archived' })
      toast.success('Project archived successfully!')
    } catch (error) {
      console.error('Failed to archive project:', error)
      toast.error('Failed to archive project')
    }
  }

  const handleDuplicateProject = async (project) => {
    try {
      const duplicateData = {
        name: `${project.name} (Copy)`,
        description: project.description,
        priority: project.priority,
        timeline: project.timeline,
        budget: project.budget,
        tags: project.tags,
        color: project.color
      }
      await projectsAPI.createProject(duplicateData)
      toast.success('Project duplicated successfully!')
    } catch (error) {
      console.error('Failed to duplicate project:', error)
      toast.error('Failed to duplicate project')
    }
  }

  const handleShareProject = (project) => {
    const projectUrl = `${window.location.origin}/projects/${project._id}`
    navigator.clipboard.writeText(projectUrl)
    toast.success('Project link copied to clipboard!')
  }

  const handleManageLinks = (project) => {
    setSelectedProjectForLinks(project)
    setShowProjectLinksModal(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'on-hold': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      case 'archived': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600'
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getLinkIcon = (type) => {
    switch (type) {
      case 'repository': return Github
      case 'deployment': return Globe
      case 'documentation': return BookOpen
      case 'design': return Figma
      default: return LinkIcon
    }
  }

  return (
    <div className="w-full min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600">Manage your projects and collaborate with your team in real-time</p>
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
                <option value="archived">Archived</option>
              </select>
              
              <motion.button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Refresh projects"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </motion.button>
              
              <button
                onClick={() => {
                  setSelectedProject(null)
                  setShowNewProjectModal(true)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                onClick={() => {
                  setSelectedProject(null)
                  setShowNewProjectModal(true)
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group relative"
                    onClick={() => onProjectSelect && onProjectSelect(project._id)}
                  >
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {project.name}
                          </h4>
                          {project.links && project.links.length > 0 && (
                            <div className="flex items-center gap-1">
                              {project.links.slice(0, 2).map((link, linkIndex) => {
                                const IconComponent = getLinkIcon(link.type)
                                return (
                                  <motion.button
                                    key={linkIndex}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      window.open(link.url, '_blank')
                                    }}
                                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title={link.title}
                                  >
                                    <IconComponent className="w-3 h-3" />
                                  </motion.button>
                                )
                              })}
                              {project.links.length > 2 && (
                                <span className="text-xs text-gray-500">+{project.links.length - 2}</span>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {project.description || 'No description provided'}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                          {project.status === 'on-hold' ? 'ON HOLD' : project.status?.replace('_', ' ').toUpperCase()}
                        </span>
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(project.priority)}`}></div>
                        
                        {/* Project Actions */}
                        <div className="relative project-actions">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowProjectActions(showProjectActions === project._id ? null : project._id)
                            }}
                            className="p-1 hover:bg-gray-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                          </motion.button>
                          
                          {/* Actions Dropdown */}
                          <AnimatePresence>
                            {showProjectActions === project._id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 min-w-[180px]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => {
                                    handleEditProject(project)
                                    setShowProjectActions(null)
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit Project
                                </button>
                                <button
                                  onClick={() => {
                                    handleManageLinks(project)
                                    setShowProjectActions(null)
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <LinkIcon className="w-4 h-4" />
                                  Manage Links
                                </button>
                                <button
                                  onClick={() => {
                                    handleDuplicateProject(project)
                                    setShowProjectActions(null)
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <FileText className="w-4 h-4" />
                                  Duplicate
                                </button>
                                <button
                                  onClick={() => {
                                    handleShareProject(project)
                                    setShowProjectActions(null)
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Share2 className="w-4 h-4" />
                                  Share Link
                                </button>
                                {project.status !== 'archived' && (
                                  <button
                                    onClick={() => {
                                      handleArchiveProject(project._id)
                                      setShowProjectActions(null)
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Archive className="w-4 h-4" />
                                    Archive
                                  </button>
                                )}
                                <hr className="my-1" />
                                <button
                                  onClick={() => {
                                    handleDeleteProject(project._id)
                                    setShowProjectActions(null)
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
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
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress || 0}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
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

                    {/* Team and Timeline */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {project.team?.slice(0, 3).map((member, memberIndex) => (
                            <motion.div
                              key={memberIndex}
                              className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                              title={member.user?.name || 'Team Member'}
                              whileHover={{ scale: 1.1, zIndex: 10 }}
                            >
                              {member.user?.name?.charAt(0) || 'T'}
                            </motion.div>
                          ))}
                          {project.team?.length > 3 && (
                            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white">
                              +{project.team.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {project.team?.length || 0} member{(project.team?.length || 0) !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {project.timeline?.endDate && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(project.timeline.endDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => {
          setShowNewProjectModal(false)
          setSelectedProject(null)
        }}
        onSubmit={selectedProject ? 
          (data) => handleUpdateProject(selectedProject._id, data) : 
          handleCreateProject
        }
        initialData={selectedProject}
      />

      <ProjectLinksModal
        isOpen={showProjectLinksModal}
        onClose={() => {
          setShowProjectLinksModal(false)
          setSelectedProjectForLinks(null)
        }}
        project={selectedProjectForLinks}
      />
    </div>
  )
}