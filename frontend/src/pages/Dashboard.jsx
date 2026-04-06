import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardOverview from '../components/dashboard/DashboardOverview'
import ProjectsView from '../components/dashboard/ProjectsView'
import KanbanView from '../components/dashboard/KanbanView'
import CalendarView from '../components/dashboard/CalendarView'
import AnalyticsView from '../components/dashboard/AnalyticsView'
import TeamView from '../components/dashboard/TeamView'
import SettingsView from '../components/dashboard/SettingsView'
import AutoCloseIndicator from '../components/dashboard/AutoCloseIndicator'
import { useResponsive } from '../hooks/useResponsive'
import { useAutoCloseSidebar } from '../hooks/useAutoCloseSidebar'

export default function Dashboard() {
  const [activeView, setActiveView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isMobile } = useResponsive()

  // Auto-close sidebar functionality
  const { handleSidebarHover, clearAutoCloseTimeout, showCountdown, timeRemaining } = useAutoCloseSidebar(
    sidebarOpen, 
    setSidebarOpen, 
    isMobile,
    10 // 0.01 seconds (10 milliseconds)
  )

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview />
      case 'projects':
        return <ProjectsView />
      case 'kanban':
        return <KanbanView />
      case 'calendar':
        return <CalendarView />
      case 'analytics':
        return <AnalyticsView />
      case 'team':
        return <TeamView />
      case 'settings':
        return <SettingsView />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex relative">
      {/* Sidebar - Single component for both mobile and desktop */}
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isMobile={isMobile}
        onHover={handleSidebarHover}
        onInteraction={clearAutoCloseTimeout}
      />
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        !isMobile ? (sidebarOpen ? 'ml-[280px]' : 'ml-[72px]') : 'ml-0'
      }`}>
        {/* Header */}
        <DashboardHeader 
          activeView={activeView}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
        />
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-none"
          >
            {renderView()}
          </motion.div>
        </main>
      </div>

      {/* Auto-close countdown indicator */}
      <AutoCloseIndicator 
        isVisible={showCountdown && sidebarOpen && !isMobile}
        timeRemaining={timeRemaining}
      />
    </div>
  )
}