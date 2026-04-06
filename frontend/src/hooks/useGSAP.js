import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin)

/**
 * Custom hook for GSAP animations with React
 * Provides cleanup and performance optimizations
 */
export const useGSAP = (animationFn, dependencies = []) => {
  const contextRef = useRef()

  useEffect(() => {
    // Create GSAP context for automatic cleanup
    contextRef.current = gsap.context(() => {
      if (typeof animationFn === 'function') {
        animationFn()
      }
    })

    return () => {
      // Cleanup all animations in this context
      contextRef.current?.revert()
    }
  }, dependencies)

  return contextRef.current
}

/**
 * Hook for scroll-triggered animations
 */
export const useScrollAnimation = (elementRef, animationConfig, dependencies = []) => {
  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current
    const {
      from = {},
      to = {},
      trigger = element,
      start = "top 80%",
      end = "bottom 20%",
      scrub = false,
      pin = false,
      markers = false,
      onEnter = null,
      onLeave = null,
      ...scrollTriggerConfig
    } = animationConfig

    // Set initial state
    gsap.set(element, from)

    // Create scroll-triggered animation
    const animation = gsap.to(element, {
      ...to,
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub,
        pin,
        markers: process.env.NODE_ENV === 'development' && markers,
        onEnter,
        onLeave,
        ...scrollTriggerConfig
      }
    })

    return () => {
      animation.kill()
    }
  }, dependencies)
}

/**
 * Hook for magnetic hover effects
 */
export const useMagneticHover = (elementRef, strength = 0.3) => {
  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current
    let isHovering = false

    const handleMouseMove = (e) => {
      if (!isHovering) return

      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength

      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: "power2.out"
      })
    }

    const handleMouseEnter = () => {
      isHovering = true
      gsap.to(element, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      })
    }

    const handleMouseLeave = () => {
      isHovering = false
      gsap.to(element, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength])
}

/**
 * Hook for text reveal animations
 */
export const useTextReveal = (elementRef, options = {}) => {
  const {
    type = 'words', // 'chars', 'words', 'lines'
    stagger = 0.1,
    duration = 0.8,
    ease = "power2.out",
    trigger = null,
    start = "top 80%"
  } = options

  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current
    const text = element.textContent
    
    // Split text based on type
    let splitText
    if (type === 'chars') {
      splitText = text.split('').map(char => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`).join('')
    } else if (type === 'words') {
      splitText = text.split(' ').map(word => `<span class="word">${word}</span>`).join(' ')
    } else if (type === 'lines') {
      splitText = text.split('\n').map(line => `<span class="line">${line}</span>`).join('<br>')
    }

    element.innerHTML = splitText
    const spans = element.querySelectorAll(`.${type.slice(0, -1)}`)

    // Set initial state
    gsap.set(spans, { 
      y: 100, 
      opacity: 0,
      rotationX: 90
    })

    // Create animation
    const animation = gsap.to(spans, {
      y: 0,
      opacity: 1,
      rotationX: 0,
      duration,
      ease,
      stagger,
      scrollTrigger: trigger ? {
        trigger: trigger || element,
        start,
        toggleActions: "play none none reverse"
      } : null
    })

    return () => {
      element.textContent = text // Restore original text
      animation.kill()
    }
  }, [type, stagger, duration, ease, trigger, start])
}

export default useGSAP