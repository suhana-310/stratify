import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * GSAP Performance Optimizations for Mobile
 */

// Device detection
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768
}

export const isLowEndDevice = () => {
  // Check for low-end device indicators
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  const slowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
  const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4
  const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4
  
  return slowConnection || lowMemory || lowCores || isMobile()
}

/**
 * Optimized GSAP configuration for mobile devices
 */
export const initGSAPOptimizations = () => {
  if (isMobile()) {
    // Reduce refresh rate for mobile
    ScrollTrigger.config({
      limitCallbacks: true,
      syncInterval: 150, // Increase sync interval for mobile
    })

    // Set lower precision for mobile animations
    gsap.config({
      force3D: true,
      nullTargetWarn: false,
      trialWarn: false
    })
  }

  if (isLowEndDevice()) {
    // Further optimizations for low-end devices
    ScrollTrigger.config({
      syncInterval: 200,
      limitCallbacks: true
    })
  }
}

/**
 * Optimized scroll trigger creation
 */
export const createOptimizedScrollTrigger = (config) => {
  const baseConfig = {
    // Default optimizations
    invalidateOnRefresh: true,
    anticipatePin: isMobile() ? 0 : 1,
    fastScrollEnd: isMobile() ? 1000 : 2500,
    preventOverlaps: true,
    ...config
  }

  // Reduce complexity on mobile
  if (isMobile()) {
    // Disable scrub on mobile for better performance
    if (baseConfig.scrub && typeof baseConfig.scrub === 'number') {
      baseConfig.scrub = Math.max(baseConfig.scrub, 1)
    }
    
    // Simplify pin spacing
    if (baseConfig.pin) {
      baseConfig.pinSpacing = false
    }
  }

  return ScrollTrigger.create(baseConfig)
}

/**
 * Optimized animation creation
 */
export const createOptimizedAnimation = (targets, vars, mobile = null) => {
  const optimizedVars = { ...vars }

  if (isMobile()) {
    // Reduce duration on mobile
    if (optimizedVars.duration) {
      optimizedVars.duration *= 0.7
    }

    // Simplify easing
    if (optimizedVars.ease && typeof optimizedVars.ease === 'string') {
      optimizedVars.ease = optimizedVars.ease.includes('elastic') ? 'power2.out' : optimizedVars.ease
    }

    // Use mobile-specific config if provided
    if (mobile) {
      Object.assign(optimizedVars, mobile)
    }
  }

  // Force hardware acceleration
  if (!optimizedVars.force3D) {
    optimizedVars.force3D = true
  }

  return gsap.to(targets, optimizedVars)
}

/**
 * Debounced resize handler for ScrollTrigger
 */
export const createResizeHandler = (callback, delay = 250) => {
  let timeoutId
  
  return () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      callback()
      ScrollTrigger.refresh()
    }, delay)
  }
}

/**
 * Intersection Observer for performance
 */
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  }

  return new IntersectionObserver(callback, defaultOptions)
}

/**
 * Cleanup utility for GSAP animations
 */
export const cleanupGSAP = (context) => {
  if (context) {
    context.revert()
  }
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
}

/**
 * Reduced motion preferences
 */
export const respectsReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Apply reduced motion settings
 */
export const applyReducedMotion = () => {
  if (respectsReducedMotion()) {
    gsap.globalTimeline.timeScale(0.5) // Slow down all animations
    ScrollTrigger.config({
      syncInterval: 300 // Reduce scroll trigger frequency
    })
  }
}

/**
 * Performance monitoring
 */
export const monitorPerformance = () => {
  if (process.env.NODE_ENV === 'development') {
    let frameCount = 0
    let lastTime = performance.now()
    
    const checkFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        
        if (fps < 30) {
          console.warn(`Low FPS detected: ${fps}fps. Consider reducing animation complexity.`)
        }
        
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(checkFPS)
    }
    
    requestAnimationFrame(checkFPS)
  }
}

// Initialize optimizations
export const initializeGSAP = () => {
  initGSAPOptimizations()
  applyReducedMotion()
  
  if (process.env.NODE_ENV === 'development') {
    monitorPerformance()
  }
}

export default {
  isMobile,
  isLowEndDevice,
  initGSAPOptimizations,
  createOptimizedScrollTrigger,
  createOptimizedAnimation,
  createResizeHandler,
  createIntersectionObserver,
  cleanupGSAP,
  respectsReducedMotion,
  applyReducedMotion,
  monitorPerformance,
  initializeGSAP
}