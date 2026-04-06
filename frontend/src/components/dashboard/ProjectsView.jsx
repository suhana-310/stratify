import React, { useState } from 'react'
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
  Play
} from 'lucide-react'

export default function ProjectsView() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedProject, setSelectedProject] = useState(null)

  // Essential shortcuts data
  const shortcuts = [
    {
      id: 1,
      title: 'Sticky notes',
      description: 'Keep important notes handy',
      icon: StickyNote,
      color: 'bg-yellow-100 border-yellow-200',
      iconColor: 'text-yellow-600'
    },
    {
      id: 2,
      title: 'Lines',
      description: 'Draw connecting lines',
      icon: Minus,
      color: 'bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      id: 3,
      title: 'Shapes',
      description: 'Add geometric shapes',
      icon: Circle,
      color: 'bg-green-100 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      id: 4,
      title: 'Magic commands',
      description: 'Quick actions and shortcuts',
      icon: Zap,
      color: 'bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600'
    }
  ]

  // Helpful features data
  const features = [
    {
      id: 1,
      title: 'Elements tab',
      description: 'Access design elements quickly',
      icon: Square,
      color: 'bg-orange-100 border-orange-200',
      iconColor: 'text-orange-600'
    },
    {
      id: 2,
      title: 'Draw tool',
      description: 'Sketch and draw freely',
      icon: Edit,
      color: 'bg-red-100 border-red-200',
      iconColor: 'text-red-600'
    },
    {
      id: 3,
      title: 'Embedded content',
      description: 'Embed external content',
      icon: FileText,
      color: 'bg-indigo-100 border-indigo-200',
      iconColor: 'text-indigo-600'
    },
    {
      id: 4,
      title: 'Real-time collaboration',
      description: 'Work together seamlessly',
      icon: Users,
      color: 'bg-pink-100 border-pink-200',
      iconColor: 'text-pink-600'
    }
  ]

  // Project data
  const projects = [
    {
      id: 1,
      name: 'Project Name: Website project redesign',
      description: 'DESCRIPTION: Redesign of main website',
      status: 'Completed',
      priority: 'High',
      progress: 100,
      team: ['Team 1'],
      phase: 'Phase',
      tasks: 'Tasks',
      deadline: 'Deadline',
      progressValue: 'Progress',
      color: 'bg-teal-500'
    },
    {
      id: 2,
      name: 'Best Tasks: Project status',
      description: 'Task management and tracking',
      status: 'In Progress',
      priority: 'Medium',
      progress: 75,
      team: ['Team 2'],
      phase: 'Phase',
      tasks: 'Tasks',
      deadline: 'Deadline',
      progressValue: 'Progress',
      color: 'bg-teal-600'
    },
    {
      id: 3,
      name: 'Important files',
      description: 'File management system',
      status: 'Planning',
      priority: 'Low',
      progress: 25,
      team: ['Team 3'],
      phase: 'Phase',
      tasks: 'Tasks',
      deadline: 'Deadline',
      progressValue: 'Progress',
      color: 'bg-teal-700'
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Project Overview', color: 'bg-teal-600' },
    { id: 'timeline', label: 'Project Timeline', color: 'bg-teal-700' },
    { id: 'files', label: 'Important files', color: 'bg-teal-800' }
  ]

  return (
    <div className="w-full min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Left Sidebar - Essential shortcuts and Helpful features */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Essential shortcuts */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Essential shortcuts</h2>
              <div className="grid grid-cols-2 gap-3">
                {shortcuts.map((shortcut) => (
                  <motion.div
                    key={shortcut.id}
                    whileHover={{ scale: 1.02 }}
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
              <h2 className="text-lg font-bold text-gray-900 mb-4">Helpful features</h2>
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
              <div className="bg-teal-800 rounded-2xl p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Team 1 Section */}
                  <div className="bg-teal-900 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Team 1</h3>
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-700 rounded-full"></div>
                        <div className="w-10 h-10 bg-teal-700 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Project Cards */}
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-white rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-sm text-gray-900 leading-tight">
                          {project.name}
                        </h4>
                        <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                          High
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 mb-4">
                        {project.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-bold text-gray-900">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-teal-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Backend
                        </span>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Security
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            ER
                          </div>
                          <span className="text-xs text-gray-600">ER</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Mar 25</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional sections for other tabs */}
            {activeTab === 'timeline' && (
              <div className="bg-teal-700 rounded-2xl p-6 shadow-lg">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-4">Project Timeline</h3>
                  <p>Timeline view content goes here...</p>
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="bg-teal-800 rounded-2xl p-6 shadow-lg">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-4">Important Files</h3>
                  <p>Files view content goes here...</p>
                </div>
              </div>
            )}

            {/* Bottom sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              
              {/* Downloads section */}
              <div className="bg-teal-600 rounded-2xl p-6 shadow-lg">
                <h3 className="text-white font-bold text-lg mb-4">Downloads</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-teal-500 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-teal-400 rounded-lg mx-auto mb-2"></div>
                  </div>
                  <div className="bg-teal-500 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-teal-400 rounded-lg mx-auto mb-2"></div>
                  </div>
                  <div className="bg-teal-400 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-teal-300 rounded-lg mx-auto mb-2"></div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-teal-700 rounded-full"></div>
                    <div className="w-6 h-6 bg-teal-800 rounded-full"></div>
                    <div className="w-6 h-6 bg-teal-900 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-teal-600 rounded-full"></div>
                    <div className="w-6 h-6 bg-teal-700 rounded-full"></div>
                    <div className="w-6 h-6 bg-teal-800 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Next Steps for Each Team */}
              <div className="bg-teal-700 rounded-2xl p-6 shadow-lg">
                <h3 className="text-white font-bold text-lg mb-4">Next Steps for Each Team</h3>
                
                <div className="space-y-4">
                  <div className="bg-teal-800 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-teal-600 rounded-full"></div>
                      <div className="w-8 h-8 bg-teal-600 rounded-full"></div>
                      <span className="text-white font-semibold">Team 1</span>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-900">Next action items and deliverables</p>
                    </div>
                  </div>
                  
                  <div className="bg-teal-800 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-teal-600 rounded-full"></div>
                      <div className="w-8 h-8 bg-teal-600 rounded-full"></div>
                      <span className="text-white font-semibold">Team 2</span>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-900">Upcoming tasks and milestones</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}