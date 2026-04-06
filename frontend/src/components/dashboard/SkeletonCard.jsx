import React from 'react'
import { motion } from 'framer-motion'

const SkeletonCard = () => {
  return (
    <div className="card-base relative overflow-hidden">
      <div className="animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-4"></div>
            <div className="flex items-center">
              <div className="h-6 bg-gray-200 rounded-full w-12"></div>
              <div className="h-3 bg-gray-200 rounded w-16 ml-2"></div>
            </div>
          </div>
          <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ translateX: '200%' }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  )
}

export default SkeletonCard