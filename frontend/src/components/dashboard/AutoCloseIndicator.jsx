import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer } from 'lucide-react'

const AutoCloseIndicator = ({ isVisible, timeRemaining }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          className="fixed bottom-4 left-4 z-50 bg-gray-800/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm"
        >
          <Timer className="w-4 h-4" />
          <span>Auto-closing in {Math.ceil(timeRemaining / 1000)}s</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AutoCloseIndicator