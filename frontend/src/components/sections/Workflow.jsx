import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  ArrowRight, 
  CheckCircle, 
  Rocket, 
  Settings, 
  Users, 
  BarChart3,
  Sparkles,
  Play
} from 'lucide-react'

export default function Workflow() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Animated line progress
  const lineProgress = useTransform(scrollYProgress, [0.2, 0.8], [0, 1])

  const steps = [
    {
      number: '01',
      title: 'Create & Setup',
      description: 'Initialize your project with smart templates, invite team members, and configure workflows in under 2 minutes.',
      icon: Rocket,
      color: 'from-blue-500 to-cyan-500',
      delay: 0.2
    },
    {
      number: '02',
      title: 'Organize & Plan',
      description: 'Structure tasks with Kanban boards, Gantt charts, or list views. Set priorities and dependencies effortlessly.',
      icon: Settings,
      color: 'from-purple-500 to-indigo-500',
      delay: 0.4
    },
    {
      number: '03',
      title: 'Collaborate & Execute',
      description: 'Work together in real-time with comments, file sharing, video calls, and instant notifications.',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      delay: 0.6
    },
    {
      number: '04',
      title: 'Track & Optimize',
      description: 'Monitor progress with AI-powered analytics, automated reports, and predictive insights for continuous improvement.',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500',
      delay: 0.8
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }

  const stepVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  return (
    <section 
      ref={containerRef}
      id="about" 
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-primary-200/20 via-accent-200/20 to-primary-300/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-xl border border-white/30 text-gray-900 rounded-full text-sm font-semibold mb-8 shadow-lg"
          >
            <Sparkles className="w-5 h-5 text-primary-500" />
            Simple Workflow Process
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            From Idea to
            <br />
            <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">
              Delivered Results
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            Experience our streamlined 4-step process that transforms complex project management 
            into an intuitive, efficient workflow designed for modern teams.
          </motion.p>
        </motion.div>

        {/* Workflow Steps */}
        <div className="relative">
          {/* Animated Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 overflow-hidden">
            <div className="w-full h-full bg-gray-200 rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 rounded-full origin-left"
                style={{ scaleX: lineProgress }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Steps Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={stepVariants}
                className="relative group"
              >
                {/* Step Number Circle */}
                <div className="flex justify-center mb-8">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                  >
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />
                    
                    {/* Main Circle */}
                    <div className={`relative w-20 h-20 bg-gradient-to-br ${step.color} rounded-full shadow-xl flex items-center justify-center z-10 group-hover:shadow-2xl transition-all duration-500`}>
                      <step.icon className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                    
                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-lg z-20">
                      <span className="text-sm font-bold text-gray-700">{step.number}</span>
                    </div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <motion.h3 
                    className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-600 leading-relaxed text-lg"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: step.delay + 0.2, duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    {step.description}
                  </motion.p>
                </div>

                {/* Connecting Arrow - Mobile */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: step.delay + 0.4, duration: 0.4 }}
                    viewport={{ once: true }}
                    className="lg:hidden flex justify-center mt-8"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center shadow-lg">
                      <ArrowRight className="w-6 h-6 text-primary-600" />
                    </div>
                  </motion.div>
                )}

                {/* Vertical Line - Mobile */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    transition={{ delay: step.delay + 0.6, duration: 0.8 }}
                    viewport={{ once: true }}
                    className="lg:hidden absolute left-1/2 bottom-0 w-0.5 h-8 bg-gradient-to-b from-primary-300 to-accent-300 transform -translate-x-1/2 origin-top"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl p-12 shadow-2xl max-w-4xl mx-auto overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-accent-50/30 to-primary-50/50 rounded-3xl" />
            
            <div className="relative z-10 text-center">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Ready to Streamline Your Workflow?
              </h3>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join over 50,000 teams who have transformed their project management 
                with our intuitive workflow system.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group text-lg"
                >
                  <Rocket className="w-6 h-6" />
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white/80 hover:bg-white border border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-600 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group text-lg"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </motion.button>
              </div>
              
              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 text-sm text-gray-500"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Setup in 2 minutes</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}