/*
 * Stratify 2026 - Advanced 3D Project Management System
 * Copyright (c) 2026 Stratify. All rights reserved.
 */

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

const Tooltip = ({ 
  children, 
  content, 
  side = 'top', 
  sideOffset = 8,
  align = 'center',
  delayDuration = 700,
  disabled = false,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)
  const timeoutRef = useRef(null)
  const isHoveringRef = useRef(false)

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    let x = 0
    let y = 0

    // Calculate base position based on side
    switch (side) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
        y = triggerRect.top - tooltipRect.height - sideOffset
        break
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
        y = triggerRect.bottom + sideOffset
        break
      case 'left':
        x = triggerRect.left - tooltipRect.width - sideOffset
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
        break
      case 'right':
        x = triggerRect.right + sideOffset
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
        break
    }

    // Adjust for alignment
    if (side === 'top' || side === 'bottom') {
      if (align === 'start') {
        x = triggerRect.left
      } else if (align === 'end') {
        x = triggerRect.right - tooltipRect.width
      }
    } else {
      if (align === 'start') {
        y = triggerRect.top
      } else if (align === 'end') {
        y = triggerRect.bottom - tooltipRect.height
      }
    }

    // Keep tooltip within viewport
    x = Math.max(8, Math.min(x, viewport.width - tooltipRect.width - 8))
    y = Math.max(8, Math.min(y, viewport.height - tooltipRect.height - 8))

    setPosition({ x, y })
  }

  const showTooltip = () => {
    if (disabled) return
    
    isHoveringRef.current = true
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      if (isHoveringRef.current) {
        setIsVisible(true)
      }
    }, delayDuration)
  }

  const hideTooltip = () => {
    isHoveringRef.current = false
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    setIsVisible(false)
  }

  useEffect(() => {
    if (isVisible) {
      calculatePosition()
      
      const handleResize = () => calculatePosition()
      const handleScroll = () => calculatePosition()
      
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleScroll, true)
      
      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleScroll, true)
      }
    }
  }, [isVisible, side, sideOffset, align])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const getArrowPosition = () => {
    const arrowSize = 6
    
    switch (side) {
      case 'top':
        return {
          bottom: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderTop: `${arrowSize}px solid rgba(0, 0, 0, 0.9)`
        }
      case 'bottom':
        return {
          top: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid rgba(0, 0, 0, 0.9)`
        }
      case 'left':
        return {
          right: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderLeft: `${arrowSize}px solid rgba(0, 0, 0, 0.9)`
        }
      case 'right':
        return {
          left: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid rgba(0, 0, 0, 0.9)`
        }
      default:
        return {}
    }
  }

  const tooltipVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: side === 'top' ? 4 : side === 'bottom' ? -4 : 0,
      x: side === 'left' ? 4 : side === 'right' ? -4 : 0
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.8
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: side === 'top' ? 4 : side === 'bottom' ? -4 : 0,
      x: side === 'left' ? 4 : side === 'right' ? -4 : 0,
      transition: {
        duration: 0.15
      }
    }
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>

      {createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              ref={tooltipRef}
              variants={tooltipVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                zIndex: 9999
              }}
              className={`
                px-3 py-2 text-sm text-white bg-gray-900/90 backdrop-blur-sm
                rounded-lg shadow-lg border border-gray-700/50
                pointer-events-none select-none
                max-w-xs break-words
                ${className}
              `}
              role="tooltip"
              aria-hidden="true"
            >
              {/* Arrow */}
              <div
                className="absolute w-0 h-0"
                style={getArrowPosition()}
              />
              
              {/* Content */}
              <div className="relative z-10">
                {typeof content === 'string' ? (
                  <span>{content}</span>
                ) : (
                  content
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

export default Tooltip