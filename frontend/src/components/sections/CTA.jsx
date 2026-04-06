import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  CheckCircle, 
  Rocket, 
  Zap, 
  Users, 
  Star,
  Clock,
  Shield,
  Sparkles
} from 'lucide-react'

export default function CTA() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const stats = [
    { icon: Users, value: '50,000+', label: 'Active Users' },
    { icon: Star, value: '4.9/5', label: 'User Rating' },
    { icon: Zap, value: '40%', label: 'Productivity Boost' }
  ]

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: 'transparent' }}>
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0" style={{ backgroundColor: '#ffd77a' }} />
        
        {/* Animated Gradient Overlay */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255, 215, 122, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, rgba(255, 193, 7, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 80%, rgba(255, 235, 59, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255, 215, 122, 0.4) 0%, transparent 50%)'
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0"
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gray-800/30 rounded-full"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        {/* Interactive Glow Effect */}
        <motion.div
          className="absolute w-96 h-96 bg-gray-800/10 rounded-full blur-3xl pointer-events-none"
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
          className="text-center"
          style={{ color: '#7a4a00' }}
        >
          {/* Urgency Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/40 backdrop-blur-xl border border-gray-600/30 rounded-full text-sm font-bold mb-8 shadow-xl"
            style={{ color: '#7a4a00' }}
          >
            <Clock className="w-4 h-4" />
            Limited Time: 50% Off First Year
            <Sparkles className="w-4 h-4" />
          </motion.div>

          {/* Main Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 leading-tight"
          >
            Ready to 10x Your
            <br />
            <span className="relative">
              <span className="font-normal" style={{ color: 'rgba(185, 106, 2, 0.87)' }}>
                Team's Productivity?
              </span>
              <motion.div
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-50"
              />
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-xl lg:text-2xl font-medium mb-12 max-w-4xl mx-auto leading-relaxed"
            style={{ color: '#7a4a00' }}
          >
            Join 50,000+ teams who've transformed their workflow with Stratify. 
            <span className="font-bold" style={{ color: '#5a3500' }}> Start your free trial today</span> and see results in 24 hours.
          </motion.p>

          {/* Social Proof Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 bg-white/30 backdrop-blur-sm rounded-2xl px-6 py-4 border border-gray-400/30"
              >
                <div className="w-10 h-10 bg-gray-800/20 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-5 h-5" style={{ color: '#7a4a00' }} />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm" style={{ color: '#7a4a00' }}>{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-4 px-12 py-6 bg-white text-primary-600 font-black text-xl lg:text-2xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
            >
              {/* Button Glow Effect */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-2xl blur-lg"
              />
              
              {/* Button Content */}
              <div className="relative z-10 flex items-center gap-4">
                <Rocket className="w-8 h-8" />
                <span>Start Free Trial Now</span>
                <motion.div
                  animate={{ x: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-8 h-8" />
                </motion.div>
              </div>

              {/* Pulse Effect */}
              <motion.div
                animate={{
                  scale: [1, 1.4],
                  opacity: [0.7, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
                className="absolute inset-0 bg-white rounded-2xl"
              />
            </motion.button>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/30 backdrop-blur-sm border-2 border-gray-600/30 font-bold text-lg rounded-xl hover:bg-white/40 transition-all duration-300"
              style={{ color: '#7a4a00' }}
            >
              <Zap className="w-5 h-5" />
              Watch 2-Minute Demo
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            style={{ color: '#7a4a00' }}
          >
            {[
              { icon: CheckCircle, text: '14-day free trial' },
              { icon: Shield, text: 'No credit card required' },
              { icon: Zap, text: 'Setup in 2 minutes' },
              { icon: CheckCircle, text: 'Cancel anytime' }
            ].map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 font-medium"
              >
                <item.icon className="w-5 h-5 text-green-300" />
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Urgency Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.7 }}
            viewport={{ once: true }}
            className="mt-12 inline-flex items-center gap-2 px-6 py-3 bg-red-500/30 border border-red-600/40 rounded-full font-bold"
            style={{ color: '#7a4a00' }}
          >
            <Clock className="w-4 h-4" />
            <span>Offer expires in 24 hours</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 bg-red-600 rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}