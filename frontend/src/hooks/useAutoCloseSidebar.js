import { useEffect, useRef, useCallback, useState } from 'react'

/**
 * Custom hook to automatically close sidebar when user is actively working
 * @param {boolean} sidebarOpen - Current sidebar state
 * @param {function} setSidebarOpen - Function to set sidebar state
 * @param {boolean} isMobile - Whether the device is mobile
 * @param {number} inactivityDelay - Delay in ms before closing sidebar (default: 3000ms)
 */
export const useAutoCloseSidebar = (sidebarOpen, setSidebarOpen, isMobile = false, inactivityDelay = 3000) => {
  const timeoutRef = useRef(null)
  const isUserActiveRef = useRef(false)
  const [showCountdown, setShowCountdown] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(inactivityDelay)
  const countdownIntervalRef = useRef(null)

  // Clear existing timeout and countdown
  const clearAutoCloseTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
    setShowCountdown(false)
    setTimeRemaining(inactivityDelay)
  }, [inactivityDelay])

  // Start countdown display
  const startCountdown = useCallback(() => {
    // Don't show countdown for very short delays (less than 1 second)
    if (inactivityDelay < 1000) return
    
    setShowCountdown(true)
    setTimeRemaining(inactivityDelay)
    
    countdownIntervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 100) {
          clearInterval(countdownIntervalRef.current)
          return 0
        }
        return prev - 100
      })
    }, 100)
  }, [inactivityDelay])

  // Set auto-close timeout
  const setAutoCloseTimeout = useCallback(() => {
    // Don't auto-close on mobile or if sidebar is already closed
    if (isMobile || !sidebarOpen) return

    clearAutoCloseTimeout()
    
    timeoutRef.current = setTimeout(() => {
      if (isUserActiveRef.current) {
        setSidebarOpen(false)
        isUserActiveRef.current = false
        setShowCountdown(false)
      }
    }, inactivityDelay)

    // Start countdown only for delays longer than 1 second
    if (inactivityDelay >= 1000) {
      setTimeout(() => {
        if (isUserActiveRef.current && sidebarOpen && !isMobile) {
          startCountdown()
        }
      }, Math.max(1000, inactivityDelay - 3000)) // Show countdown in last 3 seconds
    }
  }, [sidebarOpen, isMobile, inactivityDelay, setSidebarOpen, clearAutoCloseTimeout, startCountdown])

  // Handle user activity detection
  const handleUserActivity = useCallback(() => {
    isUserActiveRef.current = true
    setAutoCloseTimeout()
  }, [setAutoCloseTimeout])

  // Handle sidebar hover (prevent auto-close when hovering over sidebar)
  const handleSidebarHover = useCallback((isHovering) => {
    if (isHovering) {
      clearAutoCloseTimeout()
      isUserActiveRef.current = false
    } else if (sidebarOpen && !isMobile) {
      setAutoCloseTimeout()
    }
  }, [sidebarOpen, isMobile, clearAutoCloseTimeout, setAutoCloseTimeout])

  useEffect(() => {
    // Events that indicate user is working
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'input',
      'focus'
    ]

    // Add event listeners for user activity with immediate response for short delays
    const eventOptions = inactivityDelay < 100 ? { passive: true, capture: true } : { passive: true }
    
    activityEvents.forEach(event => {
      document.addEventListener(event, handleUserActivity, eventOptions)
    })

    // Initial timeout setup if sidebar is open
    if (sidebarOpen && !isMobile) {
      setAutoCloseTimeout()
    }

    // Cleanup function
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleUserActivity, eventOptions)
      })
      clearAutoCloseTimeout()
    }
  }, [sidebarOpen, isMobile, handleUserActivity, setAutoCloseTimeout, clearAutoCloseTimeout, inactivityDelay])

  // Reset activity flag when sidebar state changes
  useEffect(() => {
    isUserActiveRef.current = false
    if (sidebarOpen && !isMobile) {
      setAutoCloseTimeout()
    } else {
      clearAutoCloseTimeout()
    }
  }, [sidebarOpen, isMobile, setAutoCloseTimeout, clearAutoCloseTimeout])

  return {
    handleSidebarHover,
    clearAutoCloseTimeout,
    showCountdown,
    timeRemaining
  }
}