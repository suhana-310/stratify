import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  Database, 
  Users, 
  FolderOpen, 
  CheckSquare,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  Zap
} from 'lucide-react'
import { useRealtime } from '../../contexts/RealtimeContext'
import socketService from '../../services/socket'
import { toast } from 'react-hot-toast'

export default function RealtimeDebug() {
  const [isVisible, setIsVisible] = useState(false)
  const { 
    projects, 
    tasks, 
    users, 
    activities, 
    stats, 
    loading, 
    connected, 
    lastUpdate 
  } = useRealtime()

  const testRealTimeConnection = () => {
    if (socketService.isSocketConnected()) {
      // Emit a test event
      socketService.emit('test_connection', { timestamp: new Date().toISOString() })
      toast.success('Test event sent!')
    } else {
      toast.error('Socket not connected!')
    }
  }

  const simulateProjectCreation = () => {
    // Simulate a project creation event for testing
    const testProject = {
      _id: `test-${Date.now()}`,
      name: `Test Project ${new Date().toLocaleTimeString()}`,
      description: 'This is a test project for real-time sync',
      status: 'active',
      priority: 'medium',
      progress: Math.floor(Math.random() * 100),
      team: [],
      createdAt: new Date().toISOString()
    }

    // Emit the event as if it came from the server
    if (socketService.socket) {
      socketService.socket.emit('project_created', {
        project: testProject,
        createdBy: { name: 'Test User' }
      })
      toast.success('Simulated project creation!')
    }
  }

  const simulateTaskUpdate = () => {
    if (tasks.length > 0) {
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)]
      const statuses = ['todo', 'progress', 'review', 'done']
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
      
      const updatedTask = {
        ...randomTask,
        status: newStatus,
        progress: Math.floor(Math.random() * 100),
        updatedAt: new Date().toISOString()
      }

      if (socketService.socket) {
        socketService.socket.emit('task_updated', {
          task: updatedTask,
          updatedBy: { name: 'Test User' }
        })
        toast.success('Simulated task update!')
      }
    } else {
      toast.error('No tasks available to update')
    }
  }

  if (!isVisible) {
    return (
      <motion.button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Show Real-time Debug Panel"
      >
        <Activity className="w-5 h-5" />
      </motion.button>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        className="fixed top-4 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <h3 className="font-semibold">Real-time Debug</h3>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
          
          {/* Connection Status */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              {connected ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              Connection Status
            </h4>
            <div className={`p-3 rounded-lg ${connected ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="text-sm font-medium">
                {connected ? '✅ Connected' : '❌ Disconnected'}
              </p>
              <p className="text-xs mt-1">
                Socket: {socketService.isSocketConnected() ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>

          {/* Data Statistics */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-500" />
              Live Data
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-1">
                  <FolderOpen className="w-3 h-3 text-blue-600" />
                  <span className="text-xs text-blue-800">Projects</span>
                </div>
                <p className="text-lg font-bold text-blue-900">{projects.length}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <div className="flex items-center gap-1">
                  <CheckSquare className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-800">Tasks</span>
                </div>
                <p className="text-lg font-bold text-green-900">{tasks.length}</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-purple-600" />
                  <span className="text-xs text-purple-800">Users</span>
                </div>
                <p className="text-lg font-bold text-purple-900">{users.length}</p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-orange-600" />
                  <span className="text-xs text-orange-800">Activities</span>
                </div>
                <p className="text-lg font-bold text-orange-900">{activities.length}</p>
              </div>
            </div>
          </div>

          {/* Loading States */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-gray-500" />
              Loading States
            </h4>
            <div className="space-y-1">
              {Object.entries(loading).map(([key, isLoading]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-gray-600">{key}:</span>
                  <span className={`font-medium ${isLoading ? 'text-orange-600' : 'text-green-600'}`}>
                    {isLoading ? 'Loading...' : 'Ready'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Last Update */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              Last Update
            </h4>
            <p className="text-sm text-gray-600">
              {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'Never'}
            </p>
          </div>

          {/* Recent Activities */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Recent Activities</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {activities.slice(0, 5).map((activity, index) => (
                <div key={activity.id || index} className="text-xs p-2 bg-gray-50 rounded">
                  <span className="font-medium">{activity.user}</span>{' '}
                  <span className="text-gray-600">{activity.action}</span>{' '}
                  <span className="font-medium text-blue-600">{activity.target}</span>
                  <div className="text-gray-500 mt-1">{activity.time}</div>
                </div>
              ))}
              {activities.length === 0 && (
                <p className="text-xs text-gray-500 italic">No activities yet</p>
              )}
            </div>
          </div>

          {/* Test Controls */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Test Controls</h4>
            <div className="space-y-2">
              <button
                onClick={testRealTimeConnection}
                className="w-full p-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                Test Connection
              </button>
              <button
                onClick={simulateProjectCreation}
                className="w-full p-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm"
              >
                Simulate Project Creation
              </button>
              <button
                onClick={simulateTaskUpdate}
                className="w-full p-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors text-sm"
              >
                Simulate Task Update
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Live Stats</h4>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Active Projects:</span>
                <span className="font-medium">{stats.activeProjects}</span>
              </div>
              <div className="flex justify-between">
                <span>Team Members:</span>
                <span className="font-medium">{stats.teamMembers}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed Tasks:</span>
                <span className="font-medium">{stats.completedTasks}</span>
              </div>
              <div className="flex justify-between">
                <span>Hours This Week:</span>
                <span className="font-medium">{stats.hoursThisWeek}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}