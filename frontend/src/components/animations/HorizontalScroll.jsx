import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * HorizontalScroll component for horizontal scrolling sections
 */
const HorizontalScroll = ({ 
  children, 
  className = "",
  containerClassName = "",
  speed = 1,
  ...props 
}) => {
  const containerRef = useRef()
  const scrollRef = useRef()

  useEffect(() => {
    if (!containerRef.current || !scrollRef.current) return

    const container = containerRef.current
    const scrollElement = scrollRef.current
    
    // Get the scroll width
    const getScrollAmount = () => {
      const scrollWidth = scrollElement.scrollWidth
      const containerWidth = container.offsetWidth
      return -(scrollWidth - containerWidth)
    }

    // Create horizontal scroll animation
    let animation
    
    const createAnimation = () => {
      if (animation) {
        animation.kill()
      }
      
      animation = gsap.to(scrollElement, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${Math.abs(getScrollAmount()) * speed}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => {
            // Recalculate on refresh
            if (animation && animation.vars) {
              animation.vars.x = getScrollAmount
            }
          }
        }
      })
    }
    
    createAnimation()

    // Handle resize
    const handleResize = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animation) {
        animation.kill()
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [speed])

  return (
    <div 
      ref={containerRef} 
      className={`overflow-hidden ${containerClassName}`}
      {...props}
    >
      <div 
        ref={scrollRef}
        className={`flex items-center ${className}`}
        style={{ width: 'max-content' }}
      >
        {children}
      </div>
    </div>
  )
}

export default HorizontalScroll