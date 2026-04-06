/*
 * Stratify 2026 - Advanced 3D Project Management System
 * Copyright (c) 2026 Stratify. All rights reserved.
 */

import { useState, useEffect } from 'react'

// Breakpoints following Tailwind CSS defaults
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  })

  const [breakpoint, setBreakpoint] = useState('sm')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setWindowSize({ width, height })

      // Determine current breakpoint
      if (width >= BREAKPOINTS['2xl']) {
        setBreakpoint('2xl')
      } else if (width >= BREAKPOINTS.xl) {
        setBreakpoint('xl')
      } else if (width >= BREAKPOINTS.lg) {
        setBreakpoint('lg')
      } else if (width >= BREAKPOINTS.md) {
        setBreakpoint('md')
      } else {
        setBreakpoint('sm')
      }
    }

    // Set initial values
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    windowSize,
    breakpoint,
    isMobile: windowSize.width < BREAKPOINTS.md,
    isTablet: windowSize.width >= BREAKPOINTS.md && windowSize.width < BREAKPOINTS.lg,
    isDesktop: windowSize.width >= BREAKPOINTS.lg,
    isSmall: windowSize.width < BREAKPOINTS.sm,
    isMedium: windowSize.width >= BREAKPOINTS.sm && windowSize.width < BREAKPOINTS.md,
    isLarge: windowSize.width >= BREAKPOINTS.md && windowSize.width < BREAKPOINTS.lg,
    isXLarge: windowSize.width >= BREAKPOINTS.lg && windowSize.width < BREAKPOINTS.xl,
    is2XLarge: windowSize.width >= BREAKPOINTS.xl
  }
}

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    
    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    } else {
      // Legacy browsers
      media.addListener(listener)
      return () => media.removeListener(listener)
    }
  }, [matches, query])

  return matches
}