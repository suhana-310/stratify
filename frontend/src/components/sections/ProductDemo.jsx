import React from 'react'
import { motion } from 'framer-motion'
import { Play, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function ProductDemo() {
  return (
    <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'transparent' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#7A4A00' }}>
              See Stratify
              <span className="block" style={{ color: '#E6A520' }}>In Action</span>
            </h2>
            <p className="text-lg mb-8" style={{ color: '#7A4A00', opacity: 0.8 }}>
              Watch how teams around the world use Stratify to streamline their 
              workflows, boost productivity, and deliver projects on time.
            </p>
            
            <div className="space-y-4 mb-8">
              {[
                'Kanban boards with drag-and-drop functionality',
                'Real-time collaboration and updates',
                'Advanced analytics and reporting',
                'Integrated time tracking and billing'
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#E6A520' }}></div>
                  <span style={{ color: '#7A4A00', opacity: 0.9 }}>{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg">
                Schedule Demo
              </Button>
            </div>
          </motion.div>

          {/* Right Content - Video/Demo Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl shadow-2xl overflow-hidden border" 
                 style={{ 
                   backgroundColor: 'rgba(255, 248, 231, 0.9)', 
                   borderColor: 'rgba(122, 74, 0, 0.2)' 
                 }}>
              {/* Video Placeholder */}
              <div className="aspect-video flex items-center justify-center" 
                   style={{ background: 'linear-gradient(135deg, rgba(255, 248, 231, 0.8), rgba(255, 215, 122, 0.3))' }}>
                <motion.button
                  className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #E6A520, #7A4A00)' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </motion.button>
              </div>
              
              {/* Demo UI Elements */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: '#7A4A00' }}>Project Overview</h3>
                  <span className="text-sm" style={{ color: '#7A4A00', opacity: 0.6 }}>2:34 min</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Tasks', value: '24', color: '#E6A520' },
                    { label: 'Completed', value: '18', color: '#7A4A00' },
                    { label: 'In Progress', value: '6', color: '#FFD77A' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="text-center p-3 rounded-lg"
                      style={{ backgroundColor: 'rgba(255, 248, 231, 0.6)' }}
                    >
                      <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: stat.color }}></div>
                      <div className="text-lg font-bold" style={{ color: '#7A4A00' }}>{stat.value}</div>
                      <div className="text-xs" style={{ color: '#7A4A00', opacity: 0.6 }}>{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-4 -right-4 rounded-lg shadow-lg p-3 border"
              style={{ 
                backgroundColor: 'rgba(255, 248, 231, 0.95)', 
                borderColor: 'rgba(122, 74, 0, 0.2)' 
              }}
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 2, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut"
              }}
            >
              <div className="text-xs" style={{ color: '#7A4A00', opacity: 0.6 }}>Productivity</div>
              <div className="text-sm font-bold" style={{ color: '#E6A520' }}>+47%</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}