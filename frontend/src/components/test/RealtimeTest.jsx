import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Square, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Zap,
  Database,
  Wifi
} from 'lucide-react'
import { useRealtime } from '../../contexts/RealtimeContext'
import { useAuth } from '../../contexts/AuthContext'
import { projectsAPI, tasksAPI } from '../../services/api'
import socketService from '../../services/socket'
import { toast } from 'react-hot-toast'

export default function RealtimeTest() {
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState([])
  const [currentTest, setCurrentTest] = useState('')
  const { user } = useAuth()
  const { 
    projects, 
    tasks, 
    users, 
    stats, 
    connected, 
    loading, 
    actions 
  } = useRealtime()

  const addTestResult = (test, status, message) => {
    const result = {
      id: Date.now(),
      test,
      status, // 'success', 'error', 'warning', 'info'
      message,
      timestamp: new Date().toLocaleTimeString()
    }
    setTestResults(prev => [...prev, result])
    console.log(`🧪 Test: ${test} - ${status.toUpperCase()}: ${message}`)
  }

  const runRealtimeTests = async () => {
    setIsRunning(true)
    setTestResults([])
    setCurrentTest('Starting tests...')

    try {
      // Test 1: Check socket connection
      setCurrentTest('Testing socket connection...')
      if (socketService.isSocketConnected()) {
        addTestResult('Socket Connection', 'success', 'Socket is connected')
      } else {
        addTestResult('Socket Connection', 'error', 'Socket is not connected')
      }

      // Test 2: Check real-time context data
      setCurrentTest('Checking real-time context data...')
      addTestResult('Projects Data', projects.length > 0 ? 'success' : 'warning', `${projects.length} projects loaded`)
      addTestResult('Tasks Data', tasks.length > 0 ? 'success' : 'warning', `${tasks.length} tasks loaded`)
      addTestResult('Users Data', users.length > 0 ? 'success' : 'warning', `${users.length} users loaded`)

      // Test 3: Check loading states
      setCurrentTest('Checking loading states...')
      const loadingStates = Object.entries(loading)
      loadingStates.forEach(([key, isLoading]) => {
        addTestResult('Loading State', isLoading ? 'info' : 'success', `${key}: ${isLoading ? 'Loading' : 'Ready'}`)
      })

      // Test 4: Test API connectivity
      setCurrentTest('Testing API connectivity...')
      try {
        const projectsResponse = await projectsAPI.getProjects({ limit: 1 })
        addTestResult('Projects API', 'success', `API responded with ${projectsResponse.projects?.length || 0} projects`)
      } catch (error) {
        addTestResult('Projects API', 'error', `API error: ${error.message}`)
      }

      try {
        const tasksResponse = await tasksAPI.getTasks({ limit: 1 })
        addTestResult('Tasks API', 'success', `API responded with ${tasksResponse.tasks?.length || 0} tasks`)
      } catch (error) {
        addTestResult('Tasks API', 'error', `API error: ${error.message}`)
      }

      // Test 5: Test real-time event simulation
      setCurrentTest('Testing real-time events...')
      if (socketService.isSocketConnected()) {
        // Simulate a project creation event
        const testProject = {
          _id: `test-${Date.now()}`,
          name: `Test Project ${new Date().toLocaleTimeString()}`,
          description: 'This is a test project for real-time verification',
          status: 'active',
          priority: 'medium',
          progress: 50,
          team: [],
          createdAt: new Date().toISOString()
        }

        // Listen for the event
        const handleTestEvent = (data) => {
          if (data.project._id === testProject._id) {
            addTestResult('Real-time Event', 'success', 'Project creation event received and processed')
            socketService.off('project_created', handleTestEvent)
          }
        }

        socketService.on('project_created', handleTestEvent)

        // Emit the test event
        setTimeout(() => {
          if (socketService.socket) {
            socketService.socket.emit('project_created', {
              project: testProject,
              createdBy: user
            })
            addTestResult('Real-time Event', 'info', 'Test project creation event sent')
          }
        }, 1000)

        // Clean up after 5 seconds if no response
        setTimeout(() => {
          socketService.off('project_created', handleTestEvent)
        }, 5000)
      } else {
        addTestResult('Real-time Event', 'error', 'Cannot test events - socket not connected')
      }

      // Test 6: Test data refresh
      setCurrentTest('Testing data refresh...')
      try {
        await actions.loadInitialData()
        addTestResult('Data Refresh', 'success', 'Initial data refresh completed')
      } catch (error) {
        addTestResult('Data Refresh', 'error', `Data refresh failed: ${error.message}`)
      }

      setCurrentTest('Tests completed!')
      addTestResult('Test Suite', 'success', 'All tests completed')

    } catch (error) {
      addTestResult('Test Suite', 'error', `Test suite failed: ${error.message}`)
    } finally {
      setIsRunning(false)
      setCurrentTest('')
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'info': return <AlertCircle className="w-4 h-4 text-blue-500" />
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800'
      case 'error': return 'bg-red-50 border-red-200 text-red-800'
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Real-time System Test</h2>
                <p className="text-gray-600">Verify that real-time functionality is working correctly</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <Wifi className="w-4 h-4" />
                {connected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Projects</p>
                <p className="font-semibold text-gray-900">{projects.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Tasks</p>
                <p className="font-semibold text-gray-900">{tasks.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Users</p>
                <p className="font-semibold text-gray-900">{users.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="font-semibold text-gray-900">{stats.activeProjects}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={runRealtimeTests}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Tests
                </>
              )}
            </motion.button>

            <button
              onClick={clearResults}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Square className="w-4 h-4" />
              Clear Results
            </button>

            {currentTest && (
              <div className="flex items-center gap-2 text-blue-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">{currentTest}</span>
              </div>
            )}
          </div>
        </div>

        {/* Test Results */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h3>
          
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No test results yet. Click "Run Tests" to start testing.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testResults.map((result) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{result.test}</p>
                        <span className="text-xs text-gray-500">{result.timestamp}</span>
                      </div>
                      <p className="text-sm mt-1">{result.message}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}