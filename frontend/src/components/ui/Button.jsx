import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children,
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl hover:shadow-amber-500/25 border-0 focus:ring-amber-500",
    secondary: "bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 hover:border-amber-300 shadow-sm hover:shadow-md focus:ring-amber-500",
    ghost: "hover:bg-amber-50 text-amber-800 hover:text-amber-900 border-0 focus:ring-amber-500",
    outline: "border-2 border-amber-500 text-amber-700 hover:bg-amber-50 hover:border-amber-600 focus:ring-amber-500",
    gradient: "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl hover:shadow-amber-500/30 border-0 focus:ring-amber-500",
    premium: "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 text-white shadow-xl hover:shadow-2xl hover:shadow-amber-500/30 border-0 focus:ring-amber-500 relative overflow-hidden",
    glass: "glass text-amber-900 hover:bg-white/20 border border-white/20 shadow-glass focus:ring-amber-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl border-0 focus:ring-red-500",
    success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl border-0 focus:ring-green-500"
  }

  const sizes = {
    xs: "px-3 py-1.5 text-xs font-medium min-h-[32px]",
    sm: "px-4 py-2 text-sm font-medium min-h-[36px]",
    md: "px-6 py-2.5 text-sm font-semibold min-h-[40px]",
    default: "px-6 py-3 text-sm font-medium min-h-[44px]",
    lg: "px-8 py-4 text-base font-semibold min-h-[48px]",
    xl: "px-10 py-5 text-lg font-semibold min-h-[56px]"
  }

  const isDisabled = disabled || loading

  return (
    <motion.button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group",
        variants[variant],
        sizes[size],
        isDisabled && "cursor-not-allowed",
        className
      )}
      whileHover={!isDisabled ? { 
        scale: 1.05,
        y: -2,
      } : {}}
      whileTap={!isDisabled ? { 
        scale: 0.95,
        y: 0,
      } : {}}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
      disabled={isDisabled}
      {...props}
    >
      {/* Premium shimmer effect */}
      {(variant === 'primary' || variant === 'gradient' || variant === 'premium') && !isDisabled && (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>
      )}

      {/* Premium glow effect for premium variant */}
      {variant === 'premium' && !isDisabled && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl" />
      )}
      
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Content */}
      <span className={cn(
        "flex items-center gap-2 transition-opacity duration-200 relative z-10",
        loading && "opacity-0"
      )}>
        {children}
      </span>
    </motion.button>
  )
})

Button.displayName = "Button"

export default Button