/*
 * Stratify 2026 - Advanced 3D Project Management System
 * Copyright (c) 2026 Stratify. All rights reserved.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  FolderOpen,
  Hash,
  User,
  Calendar,
  ArrowRight,
  Clock,
  Star,
  Loader2
} from 'lucide-react'

const SearchDropdown = ({ 
  query, 
  results, 
  isVisible, 
  isLoading,
  onSelect, 
  onClose,
  selectedIndex,
  onSelectedIndexChange
}) => {
  const listRef = useRef(null)

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && selectedIndex >= 0 && results.length > 0) {
      const selectedElement = listRef.current.children[selectedIndex]
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        })
      }
    }
  }, [selectedIndex, results])

  const getItemIcon = (item) => {
    switch (item.type) {
      case 'project':
        return FolderOpen
      case 'task':
        return Hash
      case 'user':
        return User
      case 'event':
        return Calendar
      default:
        return Hash
    }
  }

  const getItemColor = (item) => {
    switch (item.type) {
      case 'project':
        return 'text-blue-600 bg-blue-50'
      case 'task':
        return 'text-green-600 bg-green-50'
      case 'user':
        return 'text-purple-600 bg-purple-50'
      case 'event':
        return 'text-orange-600 bg-orange-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  const groupedResults = useMemo(() => {
    const groups = {}
    results.forEach(item => {
      if (!groups[item.type]) {
        groups[item.type] = []
      }
      groups[item.type].push(item)
    })
    return groups
  }, [results])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 max-h-96 overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Searching...</span>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Search className="w-6 h-6 mb-2 opacity-50" />
            <p className="text-sm">No results found</p>
            {query && (
              <p className="text-xs mt-1">Try searching for projects, tasks, or team members</p>
            )}
          </div>
        ) : (
          <div className="overflow-y-auto max-h-80" ref={listRef}>
            {Object.entries(groupedResults).map(([type, items]) => (
              <div key={type} className="mb-2 last:mb-0">
                <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  {type}s ({items.length})
                </div>
                <div className="py-1">
                  {items.map((item, itemIndex) => {
                    const globalIndex = results.indexOf(item)
                    const isSelected = globalIndex === selectedIndex
                    const Icon = getItemIcon(item)
                    const colorClass = getItemColor(item)
                    
                    return (
                      <motion.button
                        key={`${item.type}-${item.id}`}
                        onClick={() => onSelect(item)}
                        onMouseEnter={() => onSelectedIndexChange(globalIndex)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-150 ${
                          isSelected 
                            ? 'bg-blue-50 border-l-2 border-blue-500' 
                            : 'hover:bg-gray-50'
                        }`}
                        whileHover={{ x: isSelected ? 0 : 2 }}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: itemIndex * 0.02 }}
                      >
                        <div className={`p-1.5 rounded-lg ${colorClass}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900">
                            {highlightMatch(
                              item.type === 'project' ? item.name : item.title,
                              query
                            )}
                          </div>
                          {item.description && (
                            <div className="text-xs text-gray-500 truncate mt-0.5">
                              {highlightMatch(item.description, query)}
                            </div>
                          )}
                          
                          {/* Additional metadata */}
                          <div className="flex items-center gap-2 mt-1">
                            {item.status && (
                              <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                                item.status === 'active' ? 'bg-green-100 text-green-700' :
                                item.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                item.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {item.status}
                              </span>
                            )}
                            
                            {item.priority && (
                              <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                                item.priority === 'high' ? 'bg-red-100 text-red-700' :
                                item.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {item.priority}
                              </span>
                            )}
                            
                            {item.dueDate && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                {new Date(item.dueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <ArrowRight className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${
                          isSelected ? 'text-blue-400' : 'text-gray-300'
                        }`} />
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Footer with keyboard shortcuts */}
        {results.length > 0 && (
          <div className="border-t border-gray-100 px-3 py-2 bg-gray-50/50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-gray-200 rounded font-mono">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-gray-200 rounded font-mono">↵</kbd>
                  <span>Open</span>
                </div>
              </div>
              <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default SearchDropdown