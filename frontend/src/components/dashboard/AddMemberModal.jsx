import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, UserPlus, Mail, Shield, User, CheckCircle, AlertCircle } from 'lucide-react'
import { usersAPI, projectsAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-hot-toast'

const AddMemberModal = ({ isOpen, onClose, projectId, currentTeam = [] }) => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [availableUsers, setAvailableUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)

  const roles = [
    { value: 'developer', label: 'Developer', description: 'Can manage tasks and contribute to project' },
    { value: 'designer', label: 'Designer', description: 'Can manage design tasks and assets' },
    { value: 'manager', label: 'Manager', description: 'Can manage project and team members' },
    { value: 'viewer', label: 'Viewer', description: 'Can view project but not make changes' }
  ]

  const permissions = {
    developer: {
      canEdit: true,
      canDelete: false,
      canInvite: false,
      canManageTasks: true
    },
    designer: {
      canEdit: true,
      canDelete: false,
      canInvite: false,
      canManageTasks: true
    },
    manager: {
      canEdit: true,
      canDelete: true,
      canInvite: true,
      canManageTasks: true
    },
    viewer: {
      canEdit: false,
      canDelete: false,
      canInvite: false,
      canManageTasks: false
    }
  }

  // Load available users when modal opens
  useEffect(() => {
    if (isOpen) {
      loadAvailableUsers()
    }
  }, [isOpen, projectId])

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(availableUsers)
    } else {
      const filtered = availableUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, availableUsers])

  const loadAvailableUsers = async () => {
    try {
      setLoading(true)
      const response = await usersAPI.getUsers({ limit: 100 })
      
      // Filter out users who are already team members
      const currentTeamIds = currentTeam.map(member => member.user._id || member.user)
      const available = response.users.filter(user => 
        !currentTeamIds.includes(user._id) && 
        user.status === 'active' &&
        user._id !== projectId // Don't include project owner if they're not in team yet
      )
      
      setAvailableUsers(available)
      setFilteredUsers(available)
    } catch (error) {
      console.error('Failed to load users:', error)
      toast.error('Failed to load available users')
    } finally {
      setLoading(false)
    }
  }

  const handleUserSelect = (selectedUser) => {
    const isSelected = selectedUsers.find(u => u.user._id === selectedUser._id)
    
    if (isSelected) {
      // Remove user
      setSelectedUsers(prev => prev.filter(u => u.user._id !== selectedUser._id))
    } else {
      // Add user with default role
      setSelectedUsers(prev => [...prev, {
        user: selectedUser,
        role: 'developer',
        permissions: permissions.developer
      }])
    }
  }

  const handleRoleChange = (userId, newRole) => {
    setSelectedUsers(prev => prev.map(member => 
      member.user._id === userId 
        ? { ...member, role: newRole, permissions: permissions[newRole] }
        : member
    ))
  }

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user to add')
      return
    }

    try {
      setAdding(true)
      
      // Add each selected user to the project
      const addPromises = selectedUsers.map(member =>
        projectsAPI.addTeamMember(projectId, member.user._id, member.role, member.permissions)
      )

      await Promise.all(addPromises)
      
      toast.success(`Successfully added ${selectedUsers.length} team member${selectedUsers.length > 1 ? 's' : ''}!`)
      
      // Reset and close
      setSelectedUsers([])
      setSearchTerm('')
      onClose()
      
    } catch (error) {
      console.error('Failed to add team members:', error)
      toast.error('Failed to add team members. Please try again.')
    } finally {
      setAdding(false)
    }
  }

  const handleClose = () => {
    setSelectedUsers([])
    setSearchTerm('')
    onClose()
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
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserPlus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add Team Members</h2>
                <p className="text-sm text-gray-600">Invite users to collaborate on this project</p>
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
                placeholder="Search users by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Available Users */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Available Users ({filteredUsers.length})
              </h3>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {searchTerm ? 'No users found matching your search' : 'No available users to add'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredUsers.map((availableUser) => {
                    const isSelected = selectedUsers.find(u => u.user._id === availableUser._id)
                    
                    return (
                      <motion.div
                        key={availableUser._id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleUserSelect(availableUser)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {availableUser.avatar ? (
                              <img
                                src={availableUser.avatar}
                                alt={availableUser.name}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {availableUser.name?.charAt(0) || 'U'}
                                </span>
                              </div>
                            )}
                            <div>
                              <h4 className="font-medium text-gray-900">{availableUser.name}</h4>
                              <p className="text-sm text-gray-600">{availableUser.email}</p>
                              {availableUser.department && (
                                <p className="text-xs text-gray-500">{availableUser.department}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {availableUser.status === 'active' && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                            {isSelected && (
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Selected Users */}
            <div className="w-80 border-l border-gray-200 p-6 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Selected Members ({selectedUsers.length})
              </h3>
              
              {selectedUsers.length === 0 ? (
                <div className="text-center py-8">
                  <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    Select users from the left to add them to the project
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedUsers.map((member) => (
                    <div key={member.user._id} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        {member.user.avatar ? (
                          <img
                            src={member.user.avatar}
                            alt={member.user.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-700">
                              {member.user.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{member.user.name}</h4>
                          <p className="text-xs text-gray-600">{member.user.email}</p>
                        </div>
                        <button
                          onClick={() => handleUserSelect(member.user)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.user._id, e.target.value)}
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        >
                          {roles.map(role => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          {roles.find(r => r.value === member.role)?.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              {selectedUsers.length > 0 && (
                <span>{selectedUsers.length} member{selectedUsers.length > 1 ? 's' : ''} selected</span>
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
                onClick={handleAddMembers}
                disabled={selectedUsers.length === 0 || adding}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {adding ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Add {selectedUsers.length > 0 ? selectedUsers.length : ''} Member{selectedUsers.length !== 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AddMemberModal