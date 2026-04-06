import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

const Input = React.forwardRef(({ 
  className, 
  type = "text",
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  ...props 
}, ref) => {
  const [focused, setFocused] = React.useState(false)
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {leftIcon}
          </div>
        )}
        
        <motion.input
          ref={ref}
          type={type}
          className={cn(
            "input-base w-full",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-error-500 focus:ring-error-500",
            className
          )}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {rightIcon}
          </div>
        )}
        
        {/* Focus ring animation */}
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-primary-500 pointer-events-none"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ 
            opacity: focused ? 0.2 : 0,
            scale: focused ? 1.02 : 1
          }}
          transition={{ duration: 0.2 }}
        />
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error-600"
        >
          {error}
        </motion.p>
      )}
      
      {helper && !error && (
        <p className="text-sm text-gray-500">
          {helper}
        </p>
      )}
    </div>
  )
})

Input.displayName = "Input"

export default Input