import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  Sparkles,
  Award
} from 'lucide-react'

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      company: 'TechCorp Inc.',
      avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
      rating: 5,
      text: 'Stratify completely transformed how our team collaborates. The intuitive interface and powerful analytics helped us increase productivity by 40% in just 3 months. It\'s simply the best project management tool we\'ve ever used.',
      featured: true
    },
    {
      name: 'Michael Chen',
      role: 'Engineering Lead',
      company: 'StartupXYZ',
      avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
      rating: 5,
      text: 'The real-time collaboration features are incredible. Our distributed team feels more connected than ever. The API integrations saved us countless hours of manual work. Highly recommend for any tech team.',
      featured: false
    },
    {
      name: 'Emily Rodriguez',
      role: 'Creative Director',
      company: 'Design Studio Pro',
      avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
      rating: 5,
      text: 'Beautiful design meets powerful functionality. Stratify helps us manage complex creative projects with ease. The visual timeline and client collaboration tools are game-changers for our agency.',
      featured: false
    },
    {
      name: 'David Kim',
      role: 'Operations Manager',
      company: 'Global Logistics',
      avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
      rating: 5,
      text: 'Managing multiple projects across different time zones was a nightmare before Stratify. Now everything is organized, transparent, and efficient. The automated reporting feature alone saves us 10 hours per week.',
      featured: false
    },
    {
      name: 'Lisa Thompson',
      role: 'Marketing Director',
      company: 'Growth Agency',
      avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
      rating: 5,
      text: 'The campaign management features are outstanding. We can track everything from ideation to execution in one place. The client portal has improved our relationships significantly. Worth every penny!',
      featured: true
    },
    {
      name: 'James Wilson',
      role: 'CTO',
      company: 'FinTech Solutions',
      avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
      rating: 5,
      text: 'Security and compliance were our biggest concerns. Stratify exceeded our expectations with enterprise-grade security features. The audit trails and permission controls are exactly what we needed.',
      featured: false
    }
  ]

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    )
  }

  const goToTestimonial = (index) => {
    setCurrentIndex(index)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-white to-gray-50/50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, -60, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary-200/20 via-accent-200/20 to-primary-300/20 rounded-full blur-3xl"
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
            <Award className="w-5 h-5 text-primary-500" />
            Customer Stories
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Loved by Teams
            <br />
            <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">
              Worldwide
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            Join thousands of teams who have transformed their workflow with Stratify. 
            Here's what they have to say about their experience.
          </motion.p>
        </motion.div>

        {/* Main Carousel */}
        <div className="relative max-w-5xl mx-auto">
          {/* Carousel Container */}
          <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="p-12 lg:p-16"
              >
                {/* Quote Icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex justify-center mb-8"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <Quote className="w-8 h-8 text-white" />
                  </div>
                </motion.div>

                {/* Star Rating */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex justify-center mb-8"
                >
                  <div className="flex gap-1">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                      >
                        <Star className="w-6 h-6 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Testimonial Text */}
                <motion.blockquote
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-2xl lg:text-3xl font-medium text-gray-800 text-center leading-relaxed mb-12 max-w-4xl mx-auto"
                >
                  "{currentTestimonial.text}"
                </motion.blockquote>

                {/* User Info */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                  <div className="relative">
                    <img
                      src={currentTestimonial.avatar}
                      alt={currentTestimonial.name}
                      className="w-20 h-20 rounded-full object-cover shadow-xl ring-4 ring-white"
                    />
                    {currentTestimonial.featured && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="text-xl font-bold text-gray-900 mb-1">
                      {currentTestimonial.name}
                    </h4>
                    <p className="text-gray-600 font-medium">
                      {currentTestimonial.role}
                    </p>
                    <p className="text-primary-600 font-semibold">
                      {currentTestimonial.company}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
              <motion.button
                onClick={prevTestimonial}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-white/90 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </motion.button>
            </div>

            <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
              <motion.button
                onClick={nextTestimonial}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-white/90 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </motion.button>
            </div>

            {/* Auto-play Control */}
            <div className="absolute top-4 right-4">
              <motion.button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isAutoPlaying ? (
                  <Pause className="w-4 h-4 text-gray-700" />
                ) : (
                  <Play className="w-4 h-4 text-gray-700 ml-0.5" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-3">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToTestimonial(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-20"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '50,000+', label: 'Happy Customers', icon: '👥' },
                { value: '4.9/5', label: 'Average Rating', icon: '⭐' },
                { value: '99.2%', label: 'Customer Satisfaction', icon: '💯' },
                { value: '24/7', label: 'Support Available', icon: '🚀' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}