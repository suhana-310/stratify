import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * PinSection component for scroll-triggered pinning
 */
const PinSection = ({ 
  children, 
  duration = "200%",
  start = "top top",
  end = null,
  pinSpacing = true,
  anticipatePin = 1,
  className = "",
  onPin = null,
  onUnpin = null,
  ...props 
}) => {
  const sectionRef = useRef()

  useEffect(() => {
    if (!sectionRef.current) return

    const section = sectionRef.current

    // Create pin animation
    const pinAnimation = ScrollTrigger.create({
      trigger: section,
      start,
      end: end || `+=${duration}`,
      pin: true,
      pinSpacing,
      anticipatePin,
      onToggle: (self) => {
        if (self.isActive) {
          onPin?.()
        } else {
          onUnpin?.()
        }
      },
      invalidateOnRefresh: true
    })

    return () => {
      pinAnimation.kill()
    }
  }, [duration, start, end, pinSpacing, anticipatePin, onPin, onUnpin])

  return (
    <section ref={sectionRef} className={className} {...props}>
      {children}
    </section>
  )
}

export default PinSection