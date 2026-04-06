import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar,
  Clock,
  Users,
  FileText,
  Image,
  Video,
  Star,
  CheckCircle2,
  AlertCircle,
  User,
  Tag,
  Lightbulb,
  Target,
  Zap,
  Edit3,
  Trash2,
  Save,
  X
} from 'lucide-react'

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [events, setEvents] = useState([])
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [draggedEvent, setDraggedEvent] = useState(null)
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    project: '',
    type: 'meeting',
    attendees: [],
    description: ''
  })

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar-events')
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    } else {
      // Initialize with sample data
      const sampleEvents = [
        {
          id: Date.now() + 1,
          type: 'meeting',
          title: 'Sprint Planning',
          date: new Date().toISOString().split('T')[0],
          time: '10:00',
          project: 'E-commerce Platform',
          status: 'scheduled',
          attendees: ['Sarah Johnson', 'Michael Chen'],
          description: 'Plan the next sprint goals and tasks',
          color: 'bg-blue-100 border-blue-200'
        },
        {
          id: Date.now() + 2,
          type: 'deadline',
          title: 'Design Review',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '14:30',
          project: 'Mobile App',
          status: 'upcoming',
          attendees: ['Emily Rodriguez', 'Sarah Johnson'],
          description: 'Review the latest design mockups',
          color: 'bg-red-100 border-red-200'
        }
      ]
      setEvents(sampleEvents)
      localStorage.setItem('calendar-events', JSON.stringify(sampleEvents))
    }
  }, [])

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events))
  }, [events])

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])
  
  // Event management functions
  const createEvent = useCallback((eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now(),
      color: getEventColor(eventData.type),
      status: 'scheduled'
    }
    setEvents(prev => [...prev, newEvent])
  }, [])

  const updateEvent = useCallback((eventId, eventData) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, ...eventData, color: getEventColor(eventData.type) }
        : event
    ))
  }, [])

  const deleteEvent = useCallback((eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId))
  }, [])

  const getEventColor = (type) => {
    const colors = {
      meeting: 'bg-blue-100 border-blue-200',
      deadline: 'bg-red-100 border-red-200',
      milestone: 'bg-green-100 border-green-200',
      task: 'bg-purple-100 border-purple-200',
      reminder: 'bg-yellow-100 border-yellow-200'
    }
    return colors[type] || 'bg-gray-100 border-gray-200'
  }

  // Modal handlers
  const openEventModal = (date = null, event = null) => {
    if (event) {
      setEditingEvent(event)
      setEventForm({
        title: event.title,
        date: event.date,
        time: event.time,
        project: event.project,
        type: event.type,
        attendees: event.attendees || [],
        description: event.description || ''
      })
    } else {
      setEditingEvent(null)
      setEventForm({
        title: '',
        date: date || new Date().toISOString().split('T')[0],
        time: '09:00',
        project: '',
        type: 'meeting',
        attendees: [],
        description: ''
      })
    }
    setShowEventModal(true)
  }

  const closeEventModal = () => {
    setShowEventModal(false)
    setEditingEvent(null)
    setEventForm({
      title: '',
      date: '',
      time: '',
      project: '',
      type: 'meeting',
      attendees: [],
      description: ''
    })
  }

  const handleEventSubmit = (e) => {
    e.preventDefault()
    if (!eventForm.title || !eventForm.date) return

    if (editingEvent) {
      updateEvent(editingEvent.id, eventForm)
    } else {
      createEvent(eventForm)
    }
    closeEventModal()
  }

  // Drag and drop handlers
  const handleDragStart = (e, event) => {
    setDraggedEvent(event)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetDate) => {
    e.preventDefault()
    if (draggedEvent && targetDate) {
      const newDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${targetDate.toString().padStart(2, '0')}`
      updateEvent(draggedEvent.id, { ...draggedEvent, date: newDate })
      setDraggedEvent(null)
    }
  }
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/13.jpg',
      role: 'Project Manager',
      status: 'active'
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/14.jpg',
      role: 'Lead Developer',
      status: 'busy'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/15.jpg',
      role: 'UI/UX Designer',
      status: 'active'
    }
  ]

  // Right sidebar data
  const brainstormItems = [
    { id: 1, title: 'Sprint Goals', color: 'bg-yellow-200' },
    { id: 2, title: 'Feature Ideas', color: 'bg-yellow-200' },
    { id: 3, title: 'Bug Fixes', color: 'bg-yellow-200' },
    { id: 4, title: 'Improvements', color: 'bg-yellow-200' }
  ]

  const contentPillars = [
    { id: 1, title: 'Project Planning', icon: Target, color: 'bg-blue-100' },
    { id: 2, title: 'Development Tasks', icon: Zap, color: 'bg-green-100' },
    { id: 3, title: 'Design Reviews', icon: Star, color: 'bg-purple-100' },
    { id: 4, title: 'Client Meetings', icon: Users, color: 'bg-orange-100' }
  ]

  // Calendar grid generation
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const getContentForDay = (day) => {
    if (!day) return []
    const year = currentDate.getFullYear()
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const dayStr = day.toString().padStart(2, '0')
    const dateStr = `${year}-${month}-${dayStr}`
    return events.filter(event => event.date === dateStr)
  }

  const isToday = (day) => {
    const today = new Date()
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear()
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="w-full h-full">
      <div className="max-w-full mx-auto h-full">
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full">
          
          {/* Left Sidebar - Team + Tasks */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Stratify Calendar</h1>
              <p className="text-gray-600 text-sm">Schedule meetings and track important deadlines for all your active projects.</p>
            </div>

            {/* Team + tasks */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Team + tasks</h2>
              <div className="space-y-3">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{member.name}</h3>
                      <p className="text-xs text-gray-600">{member.role}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      member.status === 'active' ? 'bg-green-500' : 'bg-orange-500'
                    }`}></div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom Info Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Event Types</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>Meetings: {events.filter(e => e.type === 'meeting').length}</div>
                  <div>Deadlines: {events.filter(e => e.type === 'deadline').length}</div>
                  <div>Tasks: {events.filter(e => e.type === 'task').length}</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 text-sm mb-2">This Week</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>Events: {events.filter(event => {
                    const eventDate = new Date(event.date)
                    const today = new Date()
                    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
                    const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6))
                    return eventDate >= weekStart && eventDate <= weekEnd
                  }).length}</div>
                  <div>Meetings: {events.filter(event => {
                    const eventDate = new Date(event.date)
                    const today = new Date()
                    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
                    const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6))
                    return eventDate >= weekStart && eventDate <= weekEnd && event.type === 'meeting'
                  }).length}</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Quick Actions</h4>
                <div className="space-y-1 text-xs">
                  <button 
                    onClick={() => openEventModal()}
                    className="w-full text-left text-blue-600 hover:text-blue-800"
                  >
                    + Add Event
                  </button>
                  <button 
                    onClick={goToToday}
                    className="w-full text-left text-green-600 hover:text-green-800"
                  >
                    Go to Today
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Status Legend</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded"></div>
                    <span className="text-gray-600">Meeting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded"></div>
                    <span className="text-gray-600">Deadline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                    <span className="text-gray-600">Milestone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-400 rounded"></div>
                    <span className="text-gray-600">Task</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Calendar */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 h-full">
              
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                  <button
                    onClick={goToToday}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Today
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEventModal()}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Event
                  </button>
                  <button 
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                  <div key={day} className="p-2 text-center text-xs font-semibold text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[120px] p-2 border border-gray-200 rounded-lg transition-colors ${
                      day ? 'bg-gray-50 hover:bg-gray-100 cursor-pointer' : 'bg-transparent'
                    } ${isToday(day) ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                    onDragOver={day ? handleDragOver : undefined}
                    onDrop={day ? (e) => handleDrop(e, day) : undefined}
                    onClick={day ? () => openEventModal(`${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`) : undefined}
                  >
                    {day && (
                      <>
                        <div className={`text-sm font-semibold mb-2 ${isToday(day) ? 'text-blue-700' : 'text-gray-900'}`}>
                          {day}
                        </div>
                        <div className="space-y-1">
                          {getContentForDay(day).map((event, eventIndex) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: eventIndex * 0.1 }}
                              className={`${event.color} border rounded-lg p-2 cursor-pointer hover:shadow-sm transition-all group`}
                              draggable
                              onDragStart={(e) => handleDragStart(e, event)}
                              onClick={(e) => {
                                e.stopPropagation()
                                openEventModal(null, event)
                              }}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`w-4 h-4 rounded flex-shrink-0 ${
                                  event.type === 'meeting' ? 'bg-blue-500' :
                                  event.type === 'deadline' ? 'bg-red-500' :
                                  event.type === 'milestone' ? 'bg-green-500' :
                                  event.type === 'task' ? 'bg-purple-500' :
                                  'bg-yellow-500'
                                }`}></div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-medium text-gray-900 truncate">
                                    {event.title}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {event.time} {event.project && `- ${event.project}`}
                                  </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteEvent(event.id)
                                    }}
                                    className="p-1 hover:bg-red-200 rounded"
                                  >
                                    <Trash2 className="w-3 h-3 text-red-600" />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* Current Time */}
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 border border-blue-200">
              <h3 className="font-bold text-gray-900 mb-2">Current Time</h3>
              <div className="text-2xl font-bold text-blue-700">
                {currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-sm text-gray-600">
                {currentDate.toLocaleDateString([], { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>

            {/* Today's Events */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">Today's Events</h3>
              <div className="space-y-2">
                {events
                  .filter(event => event.date === new Date().toISOString().split('T')[0])
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((event) => (
                    <div
                      key={event.id}
                      className={`${event.color} rounded-lg p-3 cursor-pointer hover:shadow-sm transition-all`}
                      onClick={() => openEventModal(null, event)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          event.type === 'meeting' ? 'bg-blue-500' :
                          event.type === 'deadline' ? 'bg-red-500' :
                          event.type === 'milestone' ? 'bg-green-500' :
                          event.type === 'task' ? 'bg-purple-500' :
                          'bg-yellow-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                          <div className="text-xs text-gray-600">{event.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                {events.filter(event => event.date === new Date().toISOString().split('T')[0]).length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No events scheduled for today
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">Upcoming Events</h3>
              <div className="space-y-2">
                {events
                  .filter(event => new Date(event.date) > new Date())
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 5)
                  .map((event) => (
                    <div
                      key={event.id}
                      className={`${event.color} rounded-lg p-3 cursor-pointer hover:shadow-sm transition-all`}
                      onClick={() => openEventModal(null, event)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          event.type === 'meeting' ? 'bg-blue-500' :
                          event.type === 'deadline' ? 'bg-red-500' :
                          event.type === 'milestone' ? 'bg-green-500' :
                          event.type === 'task' ? 'bg-purple-500' :
                          'bg-yellow-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                          <div className="text-xs text-gray-600">
                            {new Date(event.date).toLocaleDateString()} {event.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {events.filter(event => new Date(event.date) > new Date()).length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No upcoming events
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-4 border border-green-200">
              <h3 className="font-bold text-gray-900 mb-3">Calendar Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Events:</span>
                  <span className="font-semibold text-gray-900">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Month:</span>
                  <span className="font-semibold text-gray-900">
                    {events.filter(event => {
                      const eventDate = new Date(event.date)
                      return eventDate.getMonth() === currentDate.getMonth() && 
                             eventDate.getFullYear() === currentDate.getFullYear()
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Meetings:</span>
                  <span className="font-semibold text-gray-900">
                    {events.filter(event => event.type === 'meeting').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deadlines:</span>
                  <span className="font-semibold text-gray-900">
                    {events.filter(event => event.type === 'deadline').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Modal */}
        <AnimatePresence>
          {showEventModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={closeEventModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingEvent ? 'Edit Event' : 'Create New Event'}
                  </h3>
                  <button
                    onClick={closeEventModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter event title"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={eventForm.date}
                        onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        value={eventForm.time}
                        onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Type
                    </label>
                    <select
                      value={eventForm.type}
                      onChange={(e) => setEventForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="meeting">Meeting</option>
                      <option value="deadline">Deadline</option>
                      <option value="milestone">Milestone</option>
                      <option value="task">Task</option>
                      <option value="reminder">Reminder</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project
                    </label>
                    <input
                      type="text"
                      value={eventForm.project}
                      onChange={(e) => setEventForm(prev => ({ ...prev, project: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Project name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Event description"
                      rows="3"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {editingEvent ? 'Update Event' : 'Create Event'}
                    </button>
                    <button
                      type="button"
                      onClick={closeEventModal}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}