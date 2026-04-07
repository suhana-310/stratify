/*
 * Stratify 2026 - Advanced 3D Project Management System
 * Copyright (c) 2026 Stratify. All rights reserved.
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  FolderOpen, 
  Kanban, 
  Calendar, 
  BarChart3, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Menu,
  Zap
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import Tooltip from './Tooltip'

// Menu items configuration
const MENU_ITEMS = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: LayoutDashboard,
    description: 'Overview and analytics'
  },
  { 
    id: 'projects', 
    label: 'Projects', 
    icon: FolderOpen,
    description: 'Manage your projects'
  },
  { 
    id: 'kanban', 
    label: 'Kanban', 
    icon: Kanban,
    description: 'Task board view'
  },
  { 
    id: 'calendar', 
    label: 'Calendar', 
    icon: Calendar,
    description: 'Schedule and deadlines'
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: BarChart3,
    description: 'Performance metrics'
  },
  { 
    id: 'team', 
    label: 'Team', 
    icon: Users,
    description: 'Team management'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings,
    description: 'App preferences'
  },
  { 
    id: 'realtime-test', 
    label: 'Real-time Test', 
    icon: Zap,
    description: 'Test real-time functionality'
  }
]

// Animation variants
const sidebarVariants = {
  expanded: {
    width: 280,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8
    }
  },
  collapsed: {
    width: 72,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8
    }
  }
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

const mobileDrawerVariants = {
  hidden: { 
    x: -320,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  visible: { 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
}

const SidebarItem = React.memo(({ 
  item, 
  isActive, 
  isCollapsed, 
  onClick, 
  index 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const { theme } = useTheme()
  
  const handleClick = useCallback(() => {
    onClick(item.id)
  }, [onClick, item.id])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }, [handleClick])

  const buttonContent = (
    <motion.button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
        transition-all duration-200 group outline-none
        focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        ${isActive 
          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
        }
        ${isCollapsed ? 'justify-center' : 'justify-start'}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      aria-label={`${item.label} - ${item.description}`}
      role="menuitem"
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute inset-0 bg-blue-500 rounded-xl"
          initial={false}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30,
            mass: 0.8
          }}
        />
      )}
      
      {/* Icon */}
      <motion.div
        className="relative z-10 flex-shrink-0"
        animate={{ 
          rotate: isHovered && !isActive ? 12 : 0,
          scale: isActive ? 1.1 : 1
        }}
        transition={{ duration: 0.2 }}
      >
        <item.icon className="w-5 h-5" />
      </motion.div>
      
      {/* Label with animation */}
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 flex-1 text-left"
          >
            <span className="font-medium text-sm">{item.label}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcut */}
      <AnimatePresence>
        {!isCollapsed && !isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 text-xs text-gray-400 font-mono"
          >
            {item.shortcut}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )

  // Wrap with tooltip when collapsed
  if (isCollapsed) {
    return (
      <Tooltip
        content={
          <div className="text-center">
            <div className="font-medium">{item.label}</div>
            <div className="text-xs text-gray-400 mt-1">{item.description}</div>
            <div className="text-xs text-gray-500 mt-1 font-mono">{item.shortcut}</div>
          </div>
        }
        side="right"
        sideOffset={12}
      >
        {buttonContent}
      </Tooltip>
    )
  }

  return buttonContent
})

SidebarItem.displayName = 'SidebarItem'

const Sidebar = React.memo(({ 
  activeView, 
  setActiveView, 
  isOpen, 
  setIsOpen,
  isMobile = false,
  onHover = () => {},
  onInteraction = () => {}
}) => {
  const { theme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const sidebarRef = useRef(null)
  const focusedIndexRef = useRef(-1)

  // Handle mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle sidebar with Cmd/Ctrl + B
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        setIsOpen(!isOpen)
        return
      }

      // Navigation shortcuts
      if (e.metaKey || e.ctrlKey) {
        const shortcutMap = {
          '1': 'dashboard',
          '2': 'projects', 
          '3': 'kanban',
          '4': 'calendar',
          '5': 'analytics',
          '6': 'team',
          '7': 'settings'
        }
        
        if (shortcutMap[e.key]) {
          e.preventDefault()
          setActiveView(shortcutMap[e.key])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setIsOpen, setActiveView])

  // Handle click outside for mobile
  useEffect(() => {
    if (!isMobile || !isOpen) return

    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobile, isOpen, setIsOpen])

  // Memoized handlers
  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen, setIsOpen])

  const handleItemClick = useCallback((viewId) => {
    setActiveView(viewId)
    if (isMobile) {
      setIsOpen(false)
    }
  }, [setActiveView, isMobile, setIsOpen])

  // Memoized user profile data
  const userProfile = useMemo(() => ({
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    initials: 'SJ',
    activeProjects: 12,
    avatar: 'https://randomuser.me/api/portraits/women/21.jpg'
  }), [])

  if (!isMounted) return null

  // Mobile version
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile drawer */}
            <motion.div
              ref={sidebarRef}
              variants={mobileDrawerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 z-50 shadow-2xl"
              role="navigation"
              aria-label="Main navigation"
              onClick={onInteraction}
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
                <div className="flex items-center gap-3">
                  <img 
                    src="/logo.png" 
                    alt="Stratify Logo" 
                    className="w-28 h-28 object-contain"
                  />

                </div>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="p-4" role="menu">
                <ul className="space-y-1" role="none">
                  {MENU_ITEMS.map((item, index) => (
                    <li key={item.id} role="none">
                      <SidebarItem
                        item={item}
                        isActive={activeView === item.id}
                        isCollapsed={false}
                        onClick={handleItemClick}
                        index={index}
                      />
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Mobile user profile */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-semibold text-sm">{userProfile.initials}</span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{userProfile.name}</p>
                      <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200/50">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Active Projects</span>
                      <span className="text-blue-500 font-semibold">{userProfile.activeProjects}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }

  // Desktop version
  return (
    <motion.div
      ref={sidebarRef}
      variants={sidebarVariants}
      initial={isOpen ? "expanded" : "collapsed"}
      animate={isOpen ? "expanded" : "collapsed"}
      className="fixed left-0 top-0 h-full bg-white/95 backdrop-blur-xl border-r border-gray-200/50 z-40 shadow-lg flex flex-col"
      role="navigation"
      aria-label="Main navigation"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onInteraction}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200/50">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <img 
                src="/logo.png" 
                alt="Stratify Logo" 
                className="w-28 h-28 object-contain"
              />

            </motion.div>
          )}
        </AnimatePresence>
        
        <Tooltip
          content={`${isOpen ? 'Collapse' : 'Expand'} sidebar`}
          side={isOpen ? "bottom" : "right"}
          sideOffset={8}
        >
          <motion.button
            onClick={handleToggle}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`${isOpen ? 'Collapse' : 'Expand'} sidebar`}
          >
            <motion.div
              animate={{ rotate: isOpen ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </motion.div>
          </motion.button>
        </Tooltip>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1 overflow-y-auto" role="menu">
        <ul className="space-y-1" role="none">
          {MENU_ITEMS.map((item, index) => (
            <li key={item.id} role="none">
              <SidebarItem
                item={item}
                isActive={activeView === item.id}
                isCollapsed={!isOpen}
                onClick={handleItemClick}
                index={index}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="p-4 border-t border-gray-200/50"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-semibold text-sm">{userProfile.initials}</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{userProfile.name}</p>
                  <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200/50">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Active Projects</span>
                  <span className="text-blue-500 font-semibold">{userProfile.activeProjects}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

Sidebar.displayName = 'Sidebar'

export default Sidebar