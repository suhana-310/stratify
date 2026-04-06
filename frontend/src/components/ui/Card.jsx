import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const Card = React.forwardRef(({ 
  className, 
  children, 
  hover = true, 
  glass = false,
  elevated = false,
  interactive = false,
  ...props 
}, ref) => (
  <motion.div
    ref={ref}
    className={cn(
      "rounded-2xl border transition-all duration-300 ease-smooth",
      glass 
        ? "glass shadow-glass border-white/20" 
        : elevated
        ? "bg-white shadow-xl border-gray-200/50"
        : "bg-white shadow-lg border-gray-200",
      interactive && "cursor-pointer",
      className
    )}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.5,
      type: "spring",
      stiffness: 100,
      damping: 20
    }}
    whileHover={hover ? { 
      y: -8, 
      scale: 1.02,
      boxShadow: glass 
        ? "0 20px 40px rgba(31, 38, 135, 0.5)" 
        : "0 25px 50px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3, ease: "easeOut" }
    } : {}}
    {...props}
  >
    <div className="relative overflow-hidden rounded-2xl">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative p-6">
        {children}
      </div>
    </div>
  </motion.div>
))

Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 pb-4", className)}
    {...props}
  />
))

CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold text-gray-900 leading-tight tracking-tight",
      className
    )}
    {...props}
  />
))

CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 leading-relaxed", className)}
    {...props}
  />
))

CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("pt-0", className)} 
    {...props} 
  />
))

CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4 border-t border-gray-200/50", className)}
    {...props}
  />
))

CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
export default Card