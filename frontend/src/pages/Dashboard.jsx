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
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isMobile, isTablet, isDesktop } = useResponsive()

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
        return <DashboardOverview onProjectSelect={(projectId) => {
          setSelectedProjectId(projectId)
          setActiveView('kanban')
        }} />
      case 'projects':
        return <ProjectsView onProjectSelect={(projectId) => {
          setSelectedProjectId(projectId)
          setActiveView('kanban')
        }} />
      case 'kanban':
        return <KanbanView projectId={selectedProjectId} />
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

  // Responsive sidebar width calculation
  const getSidebarWidth = () => {
    if (isMobile) return 0
    if (isTablet) return sidebarOpen ? '240px' : '60px'
    return sidebarOpen ? '280px' : '72px'
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex relative overflow-hidden">
      {/* Sidebar - Single component for both mobile and desktop */}
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isMobile={isMobile}
        isTablet={isTablet}
        isDesktop={isDesktop}
        onHover={handleSidebarHover}
        onInteraction={clearAutoCloseTimeout}
      />
      
      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          !isMobile ? `ml-[${getSidebarWidth()}]` : 'ml-0'
        }`}
        style={{
          marginLeft: !isMobile ? getSidebarWidth() : '0px'
        }}
      >
        {/* Header */}
        <DashboardHeader 
          activeView={activeView}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
          isTablet={isTablet}
          isDesktop={isDesktop}
        />
        
        {/* Main Content */}
        <main className={`
          flex-1 overflow-y-auto
          ${isMobile ? 'p-3' : isTablet ? 'p-4' : 'p-6 lg:p-8'}
          safe-area-inset safe-area-bottom
        `}>
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