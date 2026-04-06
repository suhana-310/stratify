import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp, 
  Activity, 
  Zap, 
  Target,
  Play,
  Maximize2,
  Eye,
  Sparkles
} from 'lucide-react'

export default function DashboardPreview() {
  const containerRef = useRef(null)
  const dashboardRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1])
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  // Mouse movement for tilt effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]))
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]))

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dashboardRef.current) {
        const rect = dashboardRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const x = (e.clientX - centerX) / rect.width
        const y = (e.clientY - centerY) / rect.height
        
        mouseX.set(x)
        mouseY.set(y)
        setMousePosition({ x: e.clientX, y: e.clientY })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const stats = [
    { icon: BarChart3, label: 'Active Projects', value: '24', trend: '+12%', color: 'from-blue-500 to-cyan-500' },
    { icon: Users, label: 'Team Members', value: '156', trend: '+8%', color: 'from-green-500 to-emerald-500' },
    { icon: Clock, label: 'Hours Tracked', value: '2.4k', trend: '+15%', color: 'from-purple-500 to-indigo-500' },
    { icon: Target, label: 'Goals Achieved', value: '89%', trend: '+5%', color: 'from-orange-500 to-red-500' }
  ]

  const projects = [
    { name: 'E-commerce Platform', progress: 85, color: 'from-primary-500 to-primary-600', status: 'On Track' },
    { name: 'Mobile App Redesign', progress: 92, color: 'from-green-500 to-green-600', status: 'Ahead' },
    { name: 'API Integration', progress: 67, color: 'from-blue-500 to-blue-600', status: 'In Progress' },
    { name: 'Security Audit', progress: 45, color: 'from-orange-500 to-orange-600', status: 'Starting' }
  ]

  const activities = [
    { user: 'Sarah Chen', action: 'completed', item: 'User Authentication Module', time: '2 min ago', avatar: 'SC' },
    { user: 'Mike Johnson', action: 'reviewed', item: 'Payment Integration PR', time: '15 min ago', avatar: 'MJ' },
    { user: 'Emma Davis', action: 'deployed', item: 'Frontend v2.1.0', time: '1 hour ago', avatar: 'ED' },
    { user: 'Alex Kim', action: 'created', item: 'Performance Optimization Task', time: '2 hours ago', avatar: 'AK' }
  ]

  const floatingCards = [
    { 
      icon: TrendingUp, 
      title: 'Revenue Growth', 
      value: '+127%', 
      position: { top: '10%', right: '-8%' },
      delay: 0,
      color: 'from-green-400 to-emerald-500'
    },
    { 
      icon: Activity, 
      title: 'Team Velocity', 
      value: '94 pts', 
      position: { top: '60%', left: '-6%' },
      delay: 1,
      color: 'from-blue-400 to-cyan-500'
    },
    { 
      icon: Zap, 
      title: 'Performance', 
      value: '99.9%', 
      position: { bottom: '15%', right: '-10%' },
      delay: 2,
      color: 'from-yellow-400 to-orange-500'
    }
  ]

  return (
    <motion.section 
      ref={containerRef}
      style={{ opacity }}
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-gray-50/50 to-white"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary-200/20 via-accent-200/20 to-primary-300/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-xl border border-white/30 text-gray-900 rounded-full text-sm font-semibold mb-8 shadow-lg"
          >
            <Eye className="w-5 h-5 text-primary-500" />
            Live Dashboard Preview
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Dashboard That
            <br />
            <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">
              Tells Your Story
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            Experience real-time insights with our interactive dashboard. 
            Watch your data come alive with beautiful visualizations and smart analytics.
          </motion.p>
        </motion.div>

        {/* Interactive Dashboard */}
        <motion.div
          ref={dashboardRef}
          style={{ 
            scale,
            y,
            rotateX,
            rotateY,
            transformStyle: "preserve-3d"
          }}
          className="relative perspective-1000"
        >
          {/* Glowing Border Animation */}
          <motion.div
            animate={{
              background: [
                'linear-gradient(0deg, #3B82F6, #8B5CF6, #3B82F6)',
                'linear-gradient(90deg, #8B5CF6, #EC4899, #8B5CF6)',
                'linear-gradient(180deg, #EC4899, #3B82F6, #EC4899)',
                'linear-gradient(270deg, #3B82F6, #8B5CF6, #3B82F6)'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -inset-1 rounded-3xl blur-sm opacity-30"
          />

          {/* Main Dashboard Container */}
          <div className="relative bg-white/90 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
            {/* Dashboard Header */}
            <div className="bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm p-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Stratify Dashboard</h3>
                    <p className="text-gray-600">Welcome back, Sarah Chen</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Play className="w-5 h-5 text-primary-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Maximize2 className="w-5 h-5 text-gray-600" />
                  </motion.button>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {stat.trend}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Project Progress */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30"
                >
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Project Progress</h4>
                  <div className="space-y-6">
                    {projects.map((project, index) => (
                      <motion.div
                        key={project.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-800">{project.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{project.progress}%</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              project.status === 'Ahead' ? 'bg-green-100 text-green-700' :
                              project.status === 'On Track' ? 'bg-blue-100 text-blue-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${project.color} rounded-full`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${project.progress}%` }}
                            transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30"
                >
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Live Activity Feed</h4>
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50/80 transition-colors duration-200"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {activity.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800">
                            <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                            <span className="font-semibold text-primary-600">{activity.item}</span>
                          </p>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            {activity.time}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Floating Cards */}
          {floatingCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: card.delay * 0.2 }}
              className="absolute z-20"
              style={card.position}
            >
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 4 + card.delay, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: card.delay
                }}
                className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center`}>
                    <card.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {card.title}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group text-lg"
          >
            <Play className="w-6 h-6" />
            Try Interactive Demo
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  )
}