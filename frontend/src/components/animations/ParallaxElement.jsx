import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * ParallaxElement component for smooth parallax effects
 */
const ParallaxElement = ({ 
  children, 
  speed = 0.5, 
  direction = 'vertical',
  start = "top bottom",
  end = "bottom top",
  className = "",
  ...props 
}) => {
  const elementRef = useRef()

  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current

    // Calculate movement based on speed and direction
    const getMovement = () => {
      const movement = window.innerHeight * speed
      
      switch (direction) {
        case 'vertical':
          return { y: -movement }
        case 'horizontal':
          return { x: -movement }
        case 'both':
          return { x: -movement * 0.5, y: -movement }
        default:
          return { y: -movement }
      }
    }

    const movement = getMovement()

    // Create parallax animation
    const animation = gsap.fromTo(element, 
      {
        ...Object.keys(movement).reduce((acc, key) => {
          acc[key] = 0
          return acc
        }, {})
      },
      {
        ...movement,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start,
          end,
          scrub: true,
          invalidateOnRefresh: true
        }
      }
    )

    // Handle resize
    const handleResize = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      animation.kill()
      window.removeEventListener('resize', handleResize)
    }
  }, [speed, direction, start, end])

  return (
    <div ref={elementRef} className={className} {...props}>
      {children}
    </div>
  )
}

export default ParallaxElement