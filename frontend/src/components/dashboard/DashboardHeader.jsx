/*
 * Stratify 2026 - Advanced 3D Project Management System
 * Copyright (c) 2026 Stratify. All rights reserved.
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Bell, 
  Plus, 
  Menu,
  Filter,
  Calendar as CalendarIcon,
  X,
  Check,
  Clock,
  AlertCircle,
  Command,
  Loader2
} from 'lucide-react'
import Button from '../ui/Button'
import UserMenu from '../auth/UserMenu'
import NewProjectModal from './NewProjectModal'
import CommandPalette from './CommandPalette'
import SearchDropdown from './SearchDropdown'
import FilterDropdown from './FilterDropdown'
import CalendarDropdown from './CalendarDropdown'
import { mockNotifications, mockProjects, mockTasks } from '../../data/mockData'
import { useDebounce } from '../../hooks/useDebounce'
import { useResponsive } from '../../hooks/useResponsive'

export default function DashboardHeader({ activeView, sidebarOpen, setSidebarOpen, isMobile = false }) {
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchSelectedIndex, setSearchSelectedIndex] = useState(0)
  
  // UI state
  const [showNotifications, setShowNotifications] = useState(false)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  
  // Data state
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignee: 'all',
    dateRange: 'all'
  })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [recentCommands, setRecentCommands] = useState([])

  // Refs
  const searchRef = useRef(null)
  const notificationRef = useRef(null)
  const filterRef = useRef(null)
  const calendarRef = useRef(null)
  
  // Hooks
  const { isMobile: isResponsiveMobile } = useResponsive()
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Command palette shortcut (Ctrl+K or Cmd+K)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandPalette(true)
        return
      }

      // Search shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        if (searchRef.current) {
          searchRef.current.focus()
        }
        return
      }

      // Close dropdowns on Escape
      if (e.key === 'Escape') {
        setShowSearchResults(false)
        setShowNotifications(false)
        setShowFilterMenu(false)
        setShowCalendar(false)
        setShowCommandPalette(false)
        return
      }

      // Search navigation
      if (showSearchResults && searchResults.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSearchSelectedIndex(prev => 
            prev < searchResults.length - 1 ? prev + 1 : 0
          )
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSearchSelectedIndex(prev => 
            prev > 0 ? prev - 1 : searchResults.length - 1
          )
        } else if (e.key === 'Enter') {
          e.preventDefault()
          if (searchResults[searchSelectedIndex]) {
            handleSearchSelect(searchResults[searchSelectedIndex])
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showSearchResults, searchResults, searchSelectedIndex])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterMenu(false)
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search functionality
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      setSearchLoading(false)
      return
    }

    setSearchLoading(true)
    
    // Simulate API delay
    const searchTimeout = setTimeout(() => {
      const searchTerm = debouncedSearchQuery.toLowerCase()
      
      const projectResults = mockProjects.filter(project =>
        project.name.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      ).map(project => ({ ...project, type: 'project' }))

      const taskResults = mockTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      ).map(task => ({ ...task, type: 'task' }))

      const results = [...projectResults, ...taskResults]
      setSearchResults(results)
      setShowSearchResults(results.length > 0)
      setSearchSelectedIndex(0)
      setSearchLoading(false)
    }, 200)

    return () => clearTimeout(searchTimeout)
  }, [debouncedSearchQuery])

  // Memoized computed values
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length, 
    [notifications]
  )

  const appliedFiltersCount = useMemo(() => 
    Object.values(appliedFilters).filter(value => value !== 'all').length,
    [appliedFilters]
  )

  const searchData = useMemo(() => [
    ...mockProjects.map(p => ({ ...p, type: 'project' })),
    ...mockTasks.map(t => ({ ...t, type: 'task' }))
  ], [])

  // Utility functions
  const getPageTitle = (view = activeView) => {
    const titles = {
      dashboard: 'Dashboard',
      projects: 'Projects',
      kanban: 'Kanban Board',
      calendar: 'Calendar',
      analytics: 'Analytics',
      team: 'Team',
      settings: 'Settings'
    }
    return titles[view] || 'Dashboard'
  }

  const getPageDescription = () => {
    const descriptions = {
      dashboard: '',
      projects: 'Manage and track all your active projects in one place.',
      kanban: 'Visualize your workflow and track task progress.',
      calendar: '',
      analytics: 'Gain insights into your team\'s performance and productivity.',
      team: 'Collaborate with your team members and manage permissions.',
      settings: 'Customize your workspace and account preferences.'
    }
    return descriptions[activeView] || ''
  }

  // Event handlers
  const handleSearchSelect = useCallback((item) => {
    console.log('Navigate to:', item.type, item.id)
    setShowSearchResults(false)
    setSearchQuery('')
    setSearchSelectedIndex(0)
    
    // Add to recent commands
    const command = {
      id: `recent-${item.type}-${item.id}`,
      label: item.type === 'project' ? item.name : item.title,
      action: `open-${item.type}`,
      data: item,
      timestamp: Date.now()
    }
    setRecentCommands(prev => [command, ...prev.filter(c => c.id !== command.id)].slice(0, 10))
  }, [])

  const handleNotificationClick = useCallback((notification) => {
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    )
    setShowNotifications(false)
    console.log('Navigate to:', notification.actionUrl)
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const handleFiltersApply = useCallback((newFilters) => {
    setAppliedFilters(newFilters)
    console.log('Applying filters:', newFilters)
  }, [])

  const handleFiltersReset = useCallback(() => {
    const resetFilters = {
      status: 'all',
      priority: 'all',
      assignee: 'all',
      dateRange: 'all'
    }
    setFilters(resetFilters)
    setAppliedFilters(resetFilters)
  }, [])

  const handleCommandPaletteNavigate = useCallback((action) => {
    console.log('Navigate to:', action)
    // Add to recent commands
    const command = {
      id: `recent-nav-${action}`,
      label: getPageTitle(action),
      action: `navigate-${action}`,
      timestamp: Date.now()
    }
    setRecentCommands(prev => [command, ...prev.filter(c => c.id !== command.id)].slice(0, 10))
  }, [])

  const handleCommandPaletteAction = useCallback((action, data) => {
    switch (action) {
      case 'new-project':
        setShowNewProjectModal(true)
        break
      case 'filter':
        setShowFilterMenu(true)
        break
      case 'notifications':
        setShowNotifications(true)
        break
      case 'search':
        if (searchRef.current) {
          searchRef.current.focus()
        }
        break
      case 'open-item':
        console.log('Open item:', data)
        break
      default:
        console.log('Command action:', action, data)
    }
  }, [])

  const handleCreateProject = useCallback((projectData) => {
    console.log('Creating project:', projectData)
    setShowNewProjectModal(false)
  }, [])

  return (
    <>
      <motion.header
        className="glass-strong border-b border-white/10 px-4 md:px-6 lg:px-8 py-4 sticky top-0 z-30 w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between w-full max-w-none">
          <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
            {isMobile && (
              <motion.button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200 touch-target flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-5 h-5 text-gray-900" />
              </motion.button>
            )}
            
            <div className="min-w-0 flex-1">
              <motion.h1 
                className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 truncate leading-tight"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                {getPageTitle()}
              </motion.h1>
              <motion.p 
                className="text-sm md:text-base text-gray-600 mt-1 truncate hidden sm:block leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {getPageDescription()}
              </motion.p>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4 flex-shrink-0">
            {/* Desktop Search */}
            <motion.div 
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              ref={searchRef}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search projects, tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchResults(searchQuery.trim().length > 0)}
                  className="pl-10 pr-4 py-2.5 w-80 glass rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all duration-200"
                />
                {searchLoading && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                )}
              </div>
              
              <SearchDropdown
                query={searchQuery}
                results={searchResults}
                isVisible={showSearchResults}
                isLoading={searchLoading}
                onSelect={handleSearchSelect}
                onClose={() => setShowSearchResults(false)}
                selectedIndex={searchSelectedIndex}
                onSelectedIndexChange={setSearchSelectedIndex}
              />
            </motion.div>

            {/* Command Palette Trigger */}
            <motion.button
              onClick={() => setShowCommandPalette(true)}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/10 rounded-xl transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
            </motion.button>

            {/* Quick Actions */}
            <motion.div 
              className="hidden sm:flex items-center space-x-1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              {/* Filter Button */}
              <div className="relative" ref={filterRef}>
                <motion.button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="relative p-2 hover:bg-white/10 rounded-xl transition-colors duration-200 touch-target"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Open filters"
                >
                  <Filter className="w-5 h-5 text-gray-600" />
                  {appliedFiltersCount > 0 && (
                    <motion.span 
                      className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center border border-white"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {appliedFiltersCount}
                    </motion.span>
                  )}
                </motion.button>

                <FilterDropdown
                  isVisible={showFilterMenu}
                  onClose={() => setShowFilterMenu(false)}
                  filters={filters}
                  onFiltersChange={setFilters}
                  onApply={handleFiltersApply}
                  onReset={handleFiltersReset}
                  appliedFiltersCount={appliedFiltersCount}
                />
              </div>

              {/* Calendar Button */}
              <div className="relative" ref={calendarRef}>
                <motion.button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200 touch-target"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Open calendar"
                >
                  <CalendarIcon className="w-5 h-5 text-gray-600" />
                </motion.button>

                <CalendarDropdown
                  isVisible={showCalendar}
                  onClose={() => setShowCalendar(false)}
                  onDateSelect={(date) => console.log('Selected date:', date)}
                  onEventCreate={(date) => console.log('Create event for:', date)}
                />
              </div>
            </motion.div>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <motion.button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-white/10 rounded-xl transition-colors duration-200 touch-target"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
              >
                {unreadCount > 0 ? (
                  <Bell className="w-5 h-5 text-gray-600 animate-pulse" />
                ) : (
                  <Bell className="w-5 h-5 text-gray-600" />
                )}
                {unreadCount > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Enhanced Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 max-h-96 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-gray-600" />
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No notifications</p>
                          <p className="text-xs mt-1">You're all caught up!</p>
                        </div>
                      ) : (
                        notifications.map((notification, index) => (
                          <motion.button
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-l-4 ${
                              notification.read 
                                ? 'border-transparent' 
                                : 'border-blue-500 bg-blue-50/30'
                            }`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-1.5 rounded-full flex-shrink-0 ${
                                notification.type === 'task_assigned' 
                                  ? 'bg-blue-100 text-blue-600'
                                  : notification.type === 'deadline_approaching'
                                  ? 'bg-orange-100 text-orange-600'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {notification.type === 'task_assigned' && <Check className="w-3 h-3" />}
                                {notification.type === 'deadline_approaching' && <Clock className="w-3 h-3" />}
                                {notification.type === 'alert' && <AlertCircle className="w-3 h-3" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-0.5 truncate">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notification.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                              )}
                            </div>
                          </motion.button>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50/50">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View all notifications
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* New Project Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Button 
                size="sm" 
                className="hidden sm:flex group"
                onClick={() => setShowNewProjectModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">New Project</span>
              </Button>
            </motion.div>

            {/* Profile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <UserMenu />
            </motion.div>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {(isMobile || isResponsiveMobile) && (
            <motion.div 
              className="lg:hidden mt-4 w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 z-10" />
                <input
                  type="text"
                  placeholder="Search projects, tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchResults(searchQuery.trim().length > 0)}
                  className="w-full pl-10 pr-4 py-2.5 glass rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all duration-200"
                />
                {searchLoading && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin z-10" />
                )}
                
                <SearchDropdown
                  query={searchQuery}
                  results={searchResults}
                  isVisible={showSearchResults}
                  isLoading={searchLoading}
                  onSelect={handleSearchSelect}
                  onClose={() => setShowSearchResults(false)}
                  selectedIndex={searchSelectedIndex}
                  onSelectedIndexChange={setSearchSelectedIndex}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigate={handleCommandPaletteNavigate}
        onAction={handleCommandPaletteAction}
        searchData={searchData}
        recentCommands={recentCommands}
      />

      {/* New Project Modal */}
      <NewProjectModal 
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onSubmit={handleCreateProject}
      />
    </>
  )
}