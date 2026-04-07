import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Link as LinkIcon,
  Globe,
  Github,
  Figma,
  BookOpen,
  Monitor,
  Save
} from 'lucide-react'
import { projectsAPI } from '../../services/api'
import { toast } from 'react-hot-toast'

const ProjectLinksModal = ({ isOpen, onClose, project }) => {
  const [links, setLinks] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingLink, setEditingLink] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    type: 'other'
  })
  const [loading, setLoading] = useState(false)

  const linkTypes = [
    { value: 'repository', label: 'Repository', icon: Github, color: 'text-gray-700' },
    { value: 'deployment', label: 'Live Site', icon: Globe, color: 'text-green-600' },
    { value: 'documentation', label: 'Documentation', icon: BookOpen, color: 'text-blue-600' },
    { value: 'design', label: 'Design Files', icon: Figma, color: 'text-purple-600' },
    { value: 'other', label: 'Other', icon: LinkIcon, color: 'text-gray-600' }
  ]

  // Update links when project changes
  useEffect(() => {
    if (project && project.links) {
      setLinks(project.links)
    } else {
      setLinks([])
    }
  }, [project])

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setShowAddForm(false)
      setEditingLink(null)
      resetForm()
    }
  }, [isOpen])

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      description: '',
      type: 'other'
    })
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Link title is required')
      return false
    }
    if (!formData.url.trim()) {
      toast.error('Link URL is required')
      return false
    }
    
    // Basic URL validation
    try {
      new URL(formData.url)
    } catch {
      toast.error('Please enter a valid URL')
      return false
    }
    
    return true
  }

  const handleAddLink = async () => {
    if (!validateForm()) return

    try {
      setLoading(true)
      await projectsAPI.addProjectLink(project._id, {
        title: formData.title.trim(),
        url: formData.url.trim(),
        description: formData.description.trim(),
        type: formData.type
      })
      
      toast.success('Link added successfully!')
      setShowAddForm(false)
      resetForm()
    } catch (error) {
      console.error('Failed to add link:', error)
      toast.error('Failed to add link')
    } finally {
      setLoading(false)
    }
  }

  const handleEditLink = (link) => {
    setEditingLink(link._id)
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description || '',
      type: link.type
    })
  }

  const handleUpdateLink = async () => {
    if (!validateForm()) return

    try {
      setLoading(true)
      await projectsAPI.updateProjectLink(project._id, editingLink, {
        title: formData.title.trim(),
        url: formData.url.trim(),
        description: formData.description.trim(),
        type: formData.type
      })
      
      toast.success('Link updated successfully!')
      setEditingLink(null)
      resetForm()
    } catch (error) {
      console.error('Failed to update link:', error)
      toast.error('Failed to update link')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLink = async (linkId) => {
    if (!confirm('Are you sure you want to delete this link?')) return

    try {
      setLoading(true)
      await projectsAPI.removeProjectLink(project._id, linkId)
      toast.success('Link deleted successfully!')
    } catch (error) {
      console.error('Failed to delete link:', error)
      toast.error('Failed to delete link')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const getLinkTypeInfo = (type) => {
    return linkTypes.find(t => t.value === type) || linkTypes[linkTypes.length - 1]
  }

  if (!isOpen || !project) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Project Links</h2>
              <p className="text-sm text-gray-600">{project.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Add Link Button */}
            {!showAddForm && !editingLink && (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
              >
                <Plus className="w-5 h-5" />
                Add New Link
              </button>
            )}

            {/* Add/Edit Form */}
            {(showAddForm || editingLink) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-lg p-4 mb-6"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingLink ? 'Edit Link' : 'Add New Link'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., GitHub Repository, Live Demo, Figma Design"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL *
                    </label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => handleInputChange('url', e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {linkTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Brief description of this link"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        if (editingLink) {
                          setEditingLink(null)
                        } else {
                          setShowAddForm(false)
                        }
                        resetForm()
                      }}
                      className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={editingLink ? handleUpdateLink : handleAddLink}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {editingLink ? 'Update' : 'Add'} Link
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Links List */}
            <div className="space-y-3">
              {links.length === 0 ? (
                <div className="text-center py-8">
                  <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No links added yet</p>
                  <p className="text-sm text-gray-400">Add links to help team members access project resources</p>
                </div>
              ) : (
                <AnimatePresence>
                  {links.map((link, index) => {
                    const typeInfo = getLinkTypeInfo(link.type)
                    const IconComponent = typeInfo.icon
                    
                    return (
                      <motion.div
                        key={link._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2 rounded-lg bg-gray-100 ${typeInfo.color}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">{link.title}</h4>
                              <p className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer truncate" 
                                 onClick={() => handleOpenLink(link.url)}>
                                {link.url}
                              </p>
                              {link.description && (
                                <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-gray-500">{typeInfo.label}</span>
                                {link.addedAt && (
                                  <span className="text-xs text-gray-400">
                                    • Added {new Date(link.addedAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-3">
                            <motion.button
                              onClick={() => handleOpenLink(link.url)}
                              className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              title="Open link"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleEditLink(link)}
                              className="p-2 text-gray-400 hover:text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              title="Edit link"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDeleteLink(link._id)}
                              className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              title="Delete link"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              {links.length} link{links.length !== 1 ? 's' : ''} added
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ProjectLinksModal