/*
 * Stratify 2026 - Advanced 3D Project Management System
 * Copyright (c) 2026 Stratify. All rights reserved.
 */

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Plus,
  Dot
} from 'lucide-react'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Mock events data
const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Team Standup',
    date: new Date(2026, 2, 19), // March 19, 2026
    time: '09:00',
    type: 'meeting',
    attendees: 5,
    color: 'bg-blue-500'
  },
  {
    id: '2',
    title: 'Project Review',
    date: new Date(2026, 2, 20), // March 20, 2026
    time: '14:00',
    type: 'review',
    attendees: 3,
    color: 'bg-green-500'
  },
  {
    id: '3',
    title: 'Client Presentation',
    date: new Date(2026, 2, 22), // March 22, 2026
    time: '10:00',
    type: 'presentation',
    attendees: 8,
    color: 'bg-purple-500'
  },
  {
    id: '4',
    title: 'Sprint Planning',
    date: new Date(2026, 2, 24), // March 24, 2026
    time: '13:00',
    type: 'planning',
    attendees: 6,
    color: 'bg-orange-500'
  }
]

const CalendarDropdown = ({ isVisible, onClose, onDateSelect, onEventCreate }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 19)) // March 19, 2026
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 2, 19))
  const [hoveredDate, setHoveredDate] = useState(null)

  const { year, month } = useMemo(() => ({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth()
  }), [currentDate])

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const current = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }, [year, month])

  const eventsForDate = (date) => {
    return MOCK_EVENTS.filter(event => 
      event.date.toDateString() === date.toDateString()
    )
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    onDateSelect?.(date)
  }

  const isToday = (date) => {
    const today = new Date(2026, 2, 19) // Current date in the system
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  const isCurrentMonth = (date) => {
    return date.getMonth() === month
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Calendar</h3>
          </div>
          <button
            onClick={() => onEventCreate?.()}
            className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus className="w-3 h-3" />
            New Event
          </button>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          
          <h4 className="font-semibold text-gray-900">
            {MONTHS[month]} {year}
          </h4>
          
          <button
            onClick={() => navigateMonth(1)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(day => (
              <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const events = eventsForDate(date)
              const hasEvents = events.length > 0
              const isCurrentMonthDate = isCurrentMonth(date)
              const isTodayDate = isToday(date)
              const isSelectedDate = isSelected(date)
              const isHovered = hoveredDate && date.toDateString() === hoveredDate.toDateString()

              return (
                <motion.button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  onMouseEnter={() => setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  className={`
                    relative p-2 text-sm rounded-lg transition-all duration-150 min-h-[36px]
                    ${isCurrentMonthDate ? 'text-gray-900' : 'text-gray-400'}
                    ${isTodayDate ? 'bg-blue-100 text-blue-900 font-semibold' : ''}
                    ${isSelectedDate ? 'bg-blue-500 text-white' : ''}
                    ${!isSelectedDate && !isTodayDate ? 'hover:bg-gray-100' : ''}
                    ${hasEvents && !isSelectedDate && !isTodayDate ? 'bg-gray-50' : ''}
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.01 }}
                >
                  <span className="relative z-10">{date.getDate()}</span>
                  
                  {/* Event indicators */}
                  {hasEvents && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                      {events.slice(0, 3).map((event, eventIndex) => (
                        <div
                          key={event.id}
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelectedDate ? 'bg-white/80' : event.color
                          }`}
                        />
                      ))}
                      {events.length > 3 && (
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          isSelectedDate ? 'bg-white/60' : 'bg-gray-400'
                        }`} />
                      )}
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Events for Selected Date */}
        {selectedDate && (
          <div className="border-t border-gray-200 p-4">
            <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h5>
            
            {eventsForDate(selectedDate).length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <Calendar className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No events scheduled</p>
                <button
                  onClick={() => onEventCreate?.(selectedDate)}
                  className="text-xs text-blue-600 hover:text-blue-700 mt-1"
                >
                  Create an event
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {eventsForDate(selectedDate).map((event, index) => (
                  <motion.div
                    key={event.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`w-3 h-3 rounded-full ${event.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          {event.attendees}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50/50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {MOCK_EVENTS.length} event{MOCK_EVENTS.length !== 1 ? 's' : ''} this month
            </span>
            <button
              onClick={() => setCurrentDate(new Date(2026, 2, 19))}
              className="text-blue-600 hover:text-blue-700"
            >
              Go to today
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CalendarDropdown