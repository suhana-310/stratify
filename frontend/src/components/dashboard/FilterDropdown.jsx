/*
 * Stratify 2026 - Advanced 3D Project Management System
 * Copyright (c) 2026 Stratify. All rights reserved.
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Filter,
  X,
  Check,
  RotateCcw,
  Search,
  Calendar,
  User,
  Flag,
  Circle,
  CheckCircle,
  Clock,
  Pause
} from 'lucide-react'
import Button from '../ui/Button'

const FILTER_OPTIONS = {
  status: [
    { value: 'all', label: 'All Status', icon: Circle },
    { value: 'planning', label: 'Planning', icon: Clock, color: 'text-yellow-600' },
    { value: 'in-progress', label: 'In Progress', icon: CheckCircle, color: 'text-blue-600' },
    { value: 'review', label: 'Review', icon: Search, color: 'text-purple-600' },
    { value: 'completed', label: 'Completed', icon: Check, color: 'text-green-600' },
    { value: 'on-hold', label: 'On Hold', icon: Pause, color: 'text-gray-600' },
    { value: 'cancelled', label: 'Cancelled', icon: X, color: 'text-red-600' }
  ],
  priority: [
    { value: 'all', label: 'All Priorities', icon: Flag },
    { value: 'critical', label: 'Critical', icon: Flag, color: 'text-red-600' },
    { value: 'high', label: 'High Priority', icon: Flag, color: 'text-orange-600' },
    { value: 'medium', label: 'Medium Priority', icon: Flag, color: 'text-yellow-600' },
    { value: 'low', label: 'Low Priority', icon: Flag, color: 'text-green-600' }
  ],
  category: [
    { value: 'all', label: 'All Categories', icon: Circle },
    { value: 'web-development', label: 'Web Development', icon: Circle, color: 'text-blue-600' },
    { value: 'mobile-app', label: 'Mobile App', icon: Circle, color: 'text-green-600' },
    { value: 'api-integration', label: 'API Integration', icon: Circle, color: 'text-purple-600' },
    { value: 'ui/ux-design', label: 'UI/UX Design', icon: Circle, color: 'text-pink-600' },
    { value: 'data-analysis', label: 'Data Analysis', icon: Circle, color: 'text-indigo-600' },
    { value: 'devops', label: 'DevOps', icon: Circle, color: 'text-orange-600' },
    { value: 'marketing', label: 'Marketing', icon: Circle, color: 'text-red-600' },
    { value: 'research', label: 'Research', icon: Circle, color: 'text-gray-600' }
  ],
  client: [
    { value: 'all', label: 'All Clients', icon: User },
    { value: 'acme-corp', label: 'Acme Corp', icon: User, color: 'text-blue-600' },
    { value: 'techstart-inc', label: 'TechStart Inc', icon: User, color: 'text-green-600' },
    { value: 'global-solutions', label: 'Global Solutions', icon: User, color: 'text-purple-600' },
    { value: 'innovation-labs', label: 'Innovation Labs', icon: User, color: 'text-orange-600' },
    { value: 'digital-agency', label: 'Digital Agency', icon: User, color: 'text-pink-600' },
    { value: 'enterprise-co', label: 'Enterprise Co', icon: User, color: 'text-indigo-600' }
  ],
  dateRange: [
    { value: 'all', label: 'All Time', icon: Calendar },
    { value: 'today', label: 'Today', icon: Calendar, color: 'text-green-600' },
    { value: 'week', label: 'This Week', icon: Calendar, color: 'text-blue-600' },
    { value: 'month', label: 'This Month', icon: Calendar, color: 'text-purple-600' },
    { value: 'custom', label: 'Custom Range', icon: Calendar, color: 'text-orange-600' }
  ],
  budget: [
    { value: 'all', label: 'All Budgets', icon: Circle },
    { value: 'small', label: 'Small (<$25k)', icon: Circle, color: 'text-green-600' },
    { value: 'medium', label: 'Medium ($25k-$75k)', icon: Circle, color: 'text-yellow-600' },
    { value: 'large', label: 'Large (>$75k)', icon: Circle, color: 'text-red-600' }
  ],
  health: [
    { value: 'all', label: 'All Health Status', icon: Circle },
    { value: 'good', label: 'Good', icon: CheckCircle, color: 'text-green-600' },
    { value: 'fair', label: 'Fair', icon: Clock, color: 'text-yellow-600' },
    { value: 'at-risk', label: 'At Risk', icon: Flag, color: 'text-red-600' }
  ]
}

const FilterDropdown = ({ 
  isVisible, 
  onClose, 
  filters, 
  onFiltersChange, 
  onApply, 
  onReset,
  appliedFiltersCount = 0
}) => {
  const [localFilters, setLocalFilters] = useState(filters)
  const [searchTerm, setSearchTerm] = useState('')

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = (category, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const handleApply = () => {
    onFiltersChange(localFilters)
    onApply(localFilters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters = {
      status: 'all',
      priority: 'all',
      category: 'all',
      client: 'all',
      budget: 'all',
      health: 'all',
      dateRange: 'all'
    }
    setLocalFilters(resetFilters)
    onFiltersChange(resetFilters)
    onReset()
  }

  const hasChanges = JSON.stringify(localFilters) !== JSON.stringify(filters)
  const hasActiveFilters = Object.values(localFilters).some(value => value !== 'all')

  const renderFilterSection = (title, category, options) => {
    const filteredOptions = searchTerm 
      ? options.filter(option => 
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options

    return (
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
          {options[0].icon && React.createElement(options[0].icon, { className: "w-4 h-4 text-gray-500" })}
          {title}
        </h4>
        <div className="space-y-1">
          {filteredOptions.map((option, index) => {
            const isSelected = localFilters[category] === option.value
            const Icon = option.icon
            
            return (
              <motion.button
                key={option.value}
                onClick={() => handleFilterChange(category, option.value)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-150 ${
                  isSelected 
                    ? 'bg-blue-50 text-blue-900 border border-blue-200' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
                whileHover={{ x: isSelected ? 0 : 2 }}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${
                  isSelected 
                    ? 'text-blue-600' 
                    : option.color || 'text-gray-400'
                }`} />
                <span className="flex-1 text-sm font-medium">{option.label}</span>
                {isSelected && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    )
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {appliedFiltersCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                {appliedFiltersCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search filters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Options */}
        <div className="max-h-80 overflow-y-auto p-4">
          {renderFilterSection('Status', 'status', FILTER_OPTIONS.status)}
          {renderFilterSection('Priority', 'priority', FILTER_OPTIONS.priority)}
          {renderFilterSection('Category', 'category', FILTER_OPTIONS.category)}
          {renderFilterSection('Client', 'client', FILTER_OPTIONS.client)}
          {renderFilterSection('Budget', 'budget', FILTER_OPTIONS.budget)}
          {renderFilterSection('Health', 'health', FILTER_OPTIONS.health)}
          {renderFilterSection('Date Range', 'dateRange', FILTER_OPTIONS.dateRange)}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50/50">
          <button
            onClick={handleReset}
            disabled={!hasActiveFilters}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              disabled={!hasChanges}
              className="relative"
            >
              Apply Filters
              {hasChanges && (
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FilterDropdown