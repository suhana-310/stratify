import React from 'react'
import { motion } from 'framer-motion'

export default function TrustLogos() {
  const logos = [
    { name: 'Microsoft', width: 120 },
    { name: 'Google', width: 100 },
    { name: 'Apple', width: 80 },
    { name: 'Amazon', width: 110 },
    { name: 'Meta', width: 90 },
    { name: 'Netflix', width: 100 },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #FFF8E7 0%, #FFD77A 50%, #FFF8E7 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium" style={{ color: '#7A4A00', opacity: 0.8 }}>
            Trusted by industry leaders worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center"
            >
              <div 
                className="rounded-lg p-4 shadow-sm border hover:shadow-md transition-all duration-300"
                style={{ 
                  width: logo.width,
                  backgroundColor: 'rgba(255, 248, 231, 0.8)',
                  borderColor: 'rgba(122, 74, 0, 0.2)'
                }}
              >
                <div 
                  className="h-8 rounded flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(230, 165, 32, 0.2), rgba(255, 215, 122, 0.2))' }}
                >
                  <span className="text-xs font-medium" style={{ color: '#7A4A00' }}>{logo.name}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}