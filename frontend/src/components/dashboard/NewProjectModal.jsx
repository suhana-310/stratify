import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, DollarSign, Tag } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'

const NewProjectModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    priority: 'medium',
    status: 'active',
    tags: '',
    links: [],
    teamMembers: []
  })

  const [errors, setErrors] = useState({})
  const [isEditing, setIsEditing] = useState(false)

  // Update form data when initialData changes (for editing)
  useEffect(() => {
    if (initialData && isOpen) {
      setIsEditing(true)
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        startDate: initialData.timeline?.startDate ? new Date(initialData.timeline.startDate).toISOString().split('T')[0] : '',
        endDate: initialData.timeline?.endDate ? new Date(initialData.timeline.endDate).toISOString().split('T')[0] : '',
        budget: initialData.budget?.allocated?.toString() || '',
        priority: initialData.priority || 'medium',
        status: initialData.status || 'active',
        tags: initialData.tags?.join(', ') || '',
        links: initialData.links || [],
        teamMembers: initialData.team || []
      })
    } else if (isOpen) {
      setIsEditing(false)
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: '',
        priority: 'medium',
        status: 'active',
        tags: '',
        links: [],
        teamMembers: []
      })
    }
  }, [initialData, isOpen])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required'
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date'
    }
    
    if (formData.budget && isNaN(formData.budget)) {
      newErrors.budget = 'Budget must be a valid number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
        timeline: {
          startDate: formData.startDate,
          endDate: formData.endDate
        },
        budget: {
          allocated: formData.budget ? parseFloat(formData.budget) : 0,
          spent: 0,
          currency: 'USD'
        },
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        links: (formData.links || []).filter(link => link.title && link.url).map(link => ({
          title: link.title.trim(),
          url: link.url.trim(),
          type: link.type || 'other'
        })),
        color: getRandomProjectColor()
      }
      
      // If editing, include the project ID
      if (isEditing && initialData) {
        projectData._id = initialData._id
      }
      
      onSubmit(projectData)
      handleClose()
    }
  }

  const getRandomProjectColor = () => {
    const colors = [
      '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', 
      '#f59e0b', '#10b981', '#06b6d4', '#84cc16'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      budget: '',
      priority: 'medium',
      status: 'active',
      tags: '',
      links: [],
      teamMembers: []
    })
    setErrors({})
    onClose()
  }

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' }
  ]

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'planning', label: 'Planning' },
    { value: 'on-hold', label: 'On Hold' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
              {/* Fixed Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Edit Project' : 'Create New Project'}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 modal-content-scroll">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Project Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter project name"
                      error={errors.name}
                      className="w-full"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your project..."
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                        errors.description ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Start Date *
                      </label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        error={errors.startDate}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        End Date *
                      </label>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        error={errors.endDate}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Budget (Optional)
                    </label>
                    <Input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      error={errors.budget}
                      className="w-full"
                    />
                  </div>

                  {/* Priority and Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        {priorityOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Tag className="w-4 h-4 inline mr-1" />
                      Tags (Optional)
                    </label>
                    <Input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      placeholder="React, Node.js, E-commerce (comma separated)"
                      className="w-full"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Separate tags with commas
                    </p>
                  </div>

                  {/* Project Links */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Links (Optional)
                    </label>
                    <div className="space-y-3">
                      {formData.links && formData.links.map((link, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="text"
                            value={link.title}
                            onChange={(e) => {
                              const newLinks = [...formData.links]
                              newLinks[index].title = e.target.value
                              handleInputChange('links', newLinks)
                            }}
                            placeholder="Link title"
                            className="flex-1"
                          />
                          <Input
                            type="url"
                            value={link.url}
                            onChange={(e) => {
                              const newLinks = [...formData.links]
                              newLinks[index].url = e.target.value
                              handleInputChange('links', newLinks)
                            }}
                            placeholder="https://example.com"
                            className="flex-1"
                          />
                          <select
                            value={link.type}
                            onChange={(e) => {
                              const newLinks = [...formData.links]
                              newLinks[index].type = e.target.value
                              handleInputChange('links', newLinks)
                            }}
                            className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="repository">Repository</option>
                            <option value="deployment">Live Site</option>
                            <option value="documentation">Docs</option>
                            <option value="design">Design</option>
                            <option value="other">Other</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              const newLinks = formData.links.filter((_, i) => i !== index)
                              handleInputChange('links', newLinks)
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newLinks = [...(formData.links || []), { title: '', url: '', type: 'other' }]
                          handleInputChange('links', newLinks)
                        }}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                      >
                        + Add Link
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Add links to repositories, live demos, documentation, etc.
                    </p>
                  </div>

                  {/* Extra spacing for better scrolling */}
                  <div className="h-6"></div>
                </form>
              </div>

              {/* Fixed Footer */}
              <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex-shrink-0">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="min-w-[120px]"
                >
                  {isEditing ? 'Update Project' : 'Create Project'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NewProjectModal