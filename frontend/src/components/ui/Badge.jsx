import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const Badge = React.forwardRef(({ 
  className, 
  variant = "default",
  size = "default",
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-secondary-100 text-secondary-800 border-secondary-200",
    primary: "bg-primary-100 text-primary-800 border-primary-200",
    secondary: "bg-secondary-100 text-secondary-800 border-secondary-200",
    success: "bg-success-100 text-success-800 border-success-200",
    warning: "bg-warning-100 text-warning-800 border-warning-200",
    error: "bg-error-100 text-error-800 border-error-200",
    accent: "bg-accent-100 text-accent-800 border-accent-200",
    outline: "bg-transparent text-gray-600 border-gray-200",
    glass: "glass text-gray-900 border-white/20"
  }

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm"
  }

  return (
    <motion.span
      ref={ref}
      className={cn(
        "inline-flex items-center font-medium rounded-full border transition-all duration-200",
        variants[variant],
        sizes[size],
        className
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.05 }}
      {...props}
    >
      {children}
    </motion.span>
  )
})

Badge.displayName = "Badge"

export default Badge