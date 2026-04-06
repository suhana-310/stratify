import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * ScrollReveal component for fade + slide animations
 */
const ScrollReveal = ({ 
  children, 
  direction = 'up', 
  distance = 60,
  duration = 0.8,
  delay = 0,
  stagger = 0,
  trigger = null,
  start = "top 80%",
  end = "bottom 20%",
  scrub = false,
  className = "",
  ...props 
}) => {
  const elementRef = useRef()

  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current
    const children = element.children

    // Direction mappings
    const directions = {
      up: { y: distance, x: 0 },
      down: { y: -distance, x: 0 },
      left: { y: 0, x: distance },
      right: { y: 0, x: -distance },
      'up-left': { y: distance, x: distance },
      'up-right': { y: distance, x: -distance },
      'down-left': { y: -distance, x: distance },
      'down-right': { y: -distance, x: -distance }
    }

    const initialPosition = directions[direction] || directions.up

    // Set initial state
    gsap.set(children.length > 0 ? children : element, {
      opacity: 0,
      ...initialPosition,
      scale: 0.95
    })

    // Create animation
    const animation = gsap.to(children.length > 0 ? children : element, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration,
      delay,
      stagger: children.length > 0 ? stagger : 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: trigger || element,
        start,
        end,
        scrub,
        toggleActions: "play none none reverse"
      }
    })

    return () => {
      animation.kill()
    }
  }, [direction, distance, duration, delay, stagger, trigger, start, end, scrub])

  return (
    <div ref={elementRef} className={className} {...props}>
      {children}
    </div>
  )
}

export default ScrollReveal