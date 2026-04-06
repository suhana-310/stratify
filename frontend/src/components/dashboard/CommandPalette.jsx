/*
 * Stratify 2026 - Advanced 3D Project Management System
 * Copyright (c) 2026 Stratify. All rights reserved.
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import {
  Search,
  Command,
  ArrowRight,
  Hash,
  User,
  Calendar,
  Settings,
  Plus,
  Filter,
  Bell,
  LayoutDashboard,
  FolderOpen,
  Kanban,
  BarChart3,
  Users,
  Clock,
  Star,
  Zap
} from 'lucide-react'
import { useDebounce } from '../../hooks/useDebounce'

const COMMAND_CATEGORIES = {
  NAVIGATION: 'navigation',
  ACTIONS: 'actions',
  SEARCH: 'search',
  RECENT: 'recent'
}

const NAVIGATION_COMMANDS = [
  { id: 'nav-dashboard', label: 'Dashboard', icon: LayoutDashboard, action: 'dashboard', category: COMMAND_CATEGORIES.NAVIGATION },
  { id: 'nav-projects', label: 'Projects', icon: FolderOpen, action: 'projects', category: COMMAND_CATEGORIES.NAVIGATION },
  { id: 'nav-kanban', label: 'Kanban Board', icon: Kanban, action: 'kanban', category: COMMAND_CATEGORIES.NAVIGATION },
  { id: 'nav-calendar', label: 'Calendar', icon: Calendar, action: 'calendar', category: COMMAND_CATEGORIES.NAVIGATION },
  { id: 'nav-analytics', label: 'Analytics', icon: BarChart3, action: 'analytics', category: COMMAND_CATEGORIES.NAVIGATION },
  { id: 'nav-team', label: 'Team', icon: Users, action: 'team', category: COMMAND_CATEGORIES.NAVIGATION },
  { id: 'nav-settings', label: 'Settings', icon: Settings, action: 'settings', category: COMMAND_CATEGORIES.NAVIGATION }
]

const ACTION_COMMANDS = [
  { id: 'action-new-project', label: 'Create New Project', icon: Plus, action: 'new-project', category: COMMAND_CATEGORIES.ACTIONS },
  { id: 'action-new-task', label: 'Create New Task', icon: Plus, action: 'new-task', category: COMMAND_CATEGORIES.ACTIONS },
  { id: 'action-filter', label: 'Open Filters', icon: Filter, action: 'filter', category: COMMAND_CATEGORIES.ACTIONS },
  { id: 'action-notifications', label: 'View Notifications', icon: Bell, action: 'notifications', category: COMMAND_CATEGORIES.ACTIONS },
  { id: 'action-quick-search', label: 'Quick Search', icon: Search, action: 'search', category: COMMAND_CATEGORIES.ACTIONS }
]

const CommandPalette = ({ 
  isOpen, 
  onClose, 
  onNavigate, 
  onAction,
  searchData = [],
  recentCommands = []
}) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState(COMMAND_CATEGORIES.NAVIGATION)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const debouncedQuery = useDebounce(query, 150)

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setActiveCategory(COMMAND_CATEGORIES.NAVIGATION)
    }
  }, [isOpen])

  // Filter and search commands
  const filteredCommands = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return {
        [COMMAND_CATEGORIES.NAVIGATION]: NAVIGATION_COMMANDS,
        [COMMAND_CATEGORIES.ACTIONS]: ACTION_COMMANDS,
        [COMMAND_CATEGORIES.RECENT]: recentCommands.slice(0, 5)
      }
    }

    const searchTerm = debouncedQuery.toLowerCase()
    const allCommands = [...NAVIGATION_COMMANDS, ...ACTION_COMMANDS]
    
    // Search in navigation and actions
    const matchingCommands = allCommands.filter(cmd =>
      cmd.label.toLowerCase().includes(searchTerm) ||
      cmd.action.toLowerCase().includes(searchTerm)
    )

    // Search in data (projects, tasks, etc.)
    const searchResults = searchData.filter(item =>
      item.name?.toLowerCase().includes(searchTerm) ||
      item.title?.toLowerCase().includes(searchTerm) ||
      item.description?.toLowerCase().includes(searchTerm)
    ).map(item => ({
      id: `search-${item.type}-${item.id}`,
      label: item.type === 'project' ? item.name : item.title,
      description: item.description,
      icon: item.type === 'project' ? FolderOpen : Hash,
      action: `open-${item.type}`,
      data: item,
      category: COMMAND_CATEGORIES.SEARCH
    }))

    return {
      [COMMAND_CATEGORIES.NAVIGATION]: matchingCommands.filter(cmd => cmd.category === COMMAND_CATEGORIES.NAVIGATION),
      [COMMAND_CATEGORIES.ACTIONS]: matchingCommands.filter(cmd => cmd.category === COMMAND_CATEGORIES.ACTIONS),
      [COMMAND_CATEGORIES.SEARCH]: searchResults,
      [COMMAND_CATEGORIES.RECENT]: []
    }
  }, [debouncedQuery, searchData, recentCommands])

  // Flatten commands for keyboard navigation
  const allFilteredCommands = useMemo(() => {
    return Object.values(filteredCommands).flat()
  }, [filteredCommands])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < allFilteredCommands.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : allFilteredCommands.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (allFilteredCommands[selectedIndex]) {
            handleCommandSelect(allFilteredCommands[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, allFilteredCommands, onClose])

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const selectedElement = listRef.current.children[selectedIndex]
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        })
      }
    }
  }, [selectedIndex])

  const handleCommandSelect = useCallback((command) => {
    if (command.category === COMMAND_CATEGORIES.NAVIGATION) {
      onNavigate(command.action)
    } else if (command.category === COMMAND_CATEGORIES.SEARCH) {
      onAction('open-item', command.data)
    } else {
      onAction(command.action, command.data)
    }
    onClose()
  }, [onNavigate, onAction, onClose])

  const renderCommandGroup = (title, commands, icon) => {
    if (commands.length === 0) return null

    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
          {icon && <icon className="w-3 h-3" />}
          {title}
        </div>
        <div className="space-y-1">
          {commands.map((command, index) => {
            const globalIndex = allFilteredCommands.indexOf(command)
            const isSelected = globalIndex === selectedIndex
            
            return (
              <motion.button
                key={command.id}
                onClick={() => handleCommandSelect(command)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-all duration-150 ${
                  isSelected 
                    ? 'bg-blue-50 text-blue-900 border border-blue-200' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
                whileHover={{ x: isSelected ? 0 : 2 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <command.icon className={`w-4 h-4 flex-shrink-0 ${
                  isSelected ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{command.label}</div>
                  {command.description && (
                    <div className="text-xs text-gray-500 truncate">
                      {command.description}
                    </div>
                  )}
                </div>
                <ArrowRight className={`w-3 h-3 flex-shrink-0 ${
                  isSelected ? 'text-blue-400' : 'text-gray-300'
                }`} />
              </motion.button>
            )
          })}
        </div>
      </div>
    )
  }

  if (!isOpen) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-start justify-center pt-[10vh]"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-gray-50/50">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-400"
            />
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs font-mono">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs font-mono">K</kbd>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto p-2" ref={listRef}>
            {allFilteredCommands.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Search className="w-8 h-8 mb-3 opacity-50" />
                <p className="text-sm">No results found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            ) : (
              <>
                {!query && renderCommandGroup('Recent', filteredCommands[COMMAND_CATEGORIES.RECENT], Clock)}
                {renderCommandGroup('Navigation', filteredCommands[COMMAND_CATEGORIES.NAVIGATION], LayoutDashboard)}
                {renderCommandGroup('Actions', filteredCommands[COMMAND_CATEGORIES.ACTIONS], Zap)}
                {renderCommandGroup('Search Results', filteredCommands[COMMAND_CATEGORIES.SEARCH], Search)}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50/50 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-gray-200 rounded font-mono">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-gray-200 rounded font-mono">↵</kbd>
                <span>Select</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-gray-200 rounded font-mono">esc</kbd>
                <span>Close</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Command className="w-3 h-3" />
              <span>Command Palette</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}

export default CommandPalette