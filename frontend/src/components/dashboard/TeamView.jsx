import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Mail, 
  Phone, 
  MoreHorizontal, 
  Users, 
  Search, 
  Filter,
  UserPlus,
  Settings,
  Crown,
  Shield,
  User,
  Clock,
  Calendar,
  Activity,
  MessageCircle,
  Video,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX
} from 'lucide-react'
import { usersAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import socketService from '../../services/socket'
import { toast } from 'react-hot-toast'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function TeamViewReal() {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const { user } = useAuth()

  // Load team members
  useEffect(() => {
    loadTeamMembers()
  }, [])

  // Set up real-time listeners
  useEffect(() => {
    if (socketService.isSocketConnected()) {
      socketService.on('user_online', handleUserOnline)
      socketService.on('user_offline', handleUserOffline)
      socketService.on('user_registered', handleUserRegistered)
      socketService.on('user_role_changed', handleUserRoleChanged)
      socketService.on('user_status_changed', handleUserStatusChanged)

      return () => {
        socketService.off('user_online', handleUserOnline)
        socketService.off('user_offline', handleUserOffline)
        socketService.off('user_registered', handleUserRegistered)
        socketService.off('user_role_changed', handleUserRoleChanged)
        socketService.off('user_status_changed', handleUserStatusChanged)
      }
    }
  }, [])

  const loadTeamMembers = async () => {
    try {
      setLoading(true)
      const response = await usersAPI.getUsers()
      setTeamMembers(response.users || [])
    } catch (error) {
      console.error('Failed to load team members:', error)
      toast.error('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }

  // Real-time event handlers
  const handleUserOnline = (data) => {
    setOnlineUsers(prev => new Set([...prev, data.user.id]))
    setTeamMembers(prev => prev.map(member => 
      member._id === data.user.id 
        ? { ...member, lastActive: new Date(), isOnline: true }
        : member
    ))
  }

  const handleUserOffline = (data) => {
    setOnlineUsers(prev => {
      const newSet = new Set(prev)
      newSet.delete(data.userId)
      return newSet
    })
    setTeamMembers(prev => prev.map(member => 
      member._id === data.userId 
        ? { ...member, isOnline: false }
        : member
    ))
  }

  const handleUserRegistered = (data) => {
    setTeamMembers(prev => [data.user, ...prev])
    toast.success(`${data.user.name} joined the team!`)
  }

  const handleUserRoleChanged = (data) => {
    setTeamMembers(prev => prev.map(member => 
      member._id === data.userId 
        ? { ...member, role: data.newRole }
        : member
    ))
    toast.info('User role has been updated')
  }

  const handleUserStatusChanged = (data) => {
    setTeamMembers(prev => prev.map(member => 
      member._id === data.userId 
        ? { ...member, status: data.newStatus }
        : member
    ))
  }

  // Filter team members
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || member.role === filterRole
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'online' && onlineUsers.has(member._id)) ||
                         (filterStatus === 'offline' && !onlineUsers.has(member._id)) ||
                         member.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await usersAPI.updateUserRole(userId, newRole)
      toast.success('User role updated successfully!')
    } catch (error) {
      console.error('Failed to update user role:', error)
      toast.error('Failed to update user role')
    }
  }

  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      await usersAPI.updateUserStatus(userId, newStatus)
      toast.success('User status updated successfully!')
    } catch (error) {
      console.error('Failed to update user status:', error)
      toast.error('Failed to update user status')
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return Crown
      case 'manager': return Shield
      case 'member': return User
      default: return User
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-200'
      case 'manager': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'member': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200'
      case 'inactive': return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getOnlineStatus = (memberId) => {
    return onlineUsers.has(memberId) ? 'online' : 'offline'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            Team Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your team members, roles, and permissions
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="member">Member</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Online Now</p>
              <p className="text-2xl font-bold text-gray-900">{onlineUsers.size}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.filter(m => m.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.filter(m => m.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredMembers.map((member, index) => {
            const RoleIcon = getRoleIcon(member.role)
            const isOnline = onlineUsers.has(member._id)
            
            return (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-lg font-semibold text-white">
                        {member.name?.charAt(0) || 'U'}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                        {isOnline && <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.department || 'No department'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <MessageCircle className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Role and Status Badges */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium border flex items-center gap-1 ${getRoleColor(member.role)}`}>
                    <RoleIcon className="w-3 h-3" />
                    {member.role?.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getStatusColor(member.status)}`}>
                    {member.status?.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>

                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>

                {/* Activity Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    <span>
                      {member.lastActive 
                        ? `Active ${new Date(member.lastActive).toLocaleDateString()}`
                        : 'Never active'
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Joined {new Date(member.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{member.projects?.length || 0}</p>
                    <p className="text-xs text-gray-600">Projects</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      {Math.floor(Math.random() * 20) + 5}
                    </p>
                    <p className="text-xs text-gray-600">Tasks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      {Math.floor(Math.random() * 40) + 10}h
                    </p>
                    <p className="text-xs text-gray-600">This week</p>
                  </div>
                </div>

                {/* Actions */}
                {(user?.role === 'admin' || user?.role === 'manager') && user?._id !== member._id && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <select
                      value={member.role}
                      onChange={(e) => handleUpdateUserRole(member._id, e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="member">Member</option>
                      <option value="manager">Manager</option>
                      {user?.role === 'admin' && <option value="admin">Admin</option>}
                    </select>
                    <select
                      value={member.status}
                      onChange={(e) => handleUpdateUserStatus(member._id, e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Invite your first team member to get started'
            }
          </p>
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Invite Team Member
          </button>
        </div>
      )}
    </div>
  )
}