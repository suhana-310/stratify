import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Folder, Users, Calendar, Target } from 'lucide-react'
import { projectsAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-hot-toast'

const ProjectSelectionModal = ({ isOpen, onClose, onProjectSelect, title = "Select Project" }) => {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  // Load projects when modal opens
  useEffect(() => {
    if (isOpen) {
      loadProjects()
    }
  }, [isOpen])

  // Filter projects based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProjects(projects)
    } else {
      const filtered = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredProjects(filtered)
    }
  }, [searchTerm, projects])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const response = await projectsAPI.getProjects({ limit: 50 })
      
      // Filter projects where user can manage team (owner or has invite permissions)
      const managableProjects = response.projects.filter(project => {
        if (project.owner._id === user.id) return true
        
        const userMember = project.team?.find(member => member.user._id === user.id)
        return userMember?.permissions?.canInvite
      })
      
      setProjects(managableProjects)
      setFilteredProjects(managableProjects)
    } catch (error) {
      console.error('Failed to load projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleProjectSelect = (project) => {
    setSelectedProject(project)
  }

  const handleConfirmSelection = () => {
    if (selectedProject) {
      onProjectSelect(selectedProject)
      handleClose()
    }
  }

  const handleClose = () => {
    setSelectedProject(null)
    setSearchTerm('')
    onClose()
  }

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      planning: 'bg-blue-100 text-blue-800',
      'on-hold': 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      urgent: 'bg-red-500'
    }
    return colors[priority] || 'bg-gray-500'
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Folder className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-600">Choose a project to manage team members</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Projects List */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-8">
                <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">
                  {searchTerm ? 'No projects found matching your search' : 'No projects available for team management'}
                </p>
                {!searchTerm && (
                  <p className="text-sm text-gray-400 mt-2">
                    You need to be a project owner or have invite permissions
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project._id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedProject?._id === project._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleProjectSelect(project)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: project.color }}
                          ></div>
                          <h3 className="font-semibold text-gray-900">{project.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        {project.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`}></div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{project.team?.length || 0} members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {project.timeline?.endDate 
                              ? new Date(project.timeline.endDate).toLocaleDateString()
                              : 'No deadline'
                            }
                          </span>
                        </div>
                        {project.progress !== undefined && (
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            <span>{project.progress}% complete</span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {project.owner._id === user.id ? 'Owner' : 'Manager'}
                      </div>
                    </div>

                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{project.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              {selectedProject && (
                <span>Selected: {selectedProject.name}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSelection}
                disabled={!selectedProject}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Manage Team
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ProjectSelectionModal