import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import Button from '../ui/Button'

/**
 * MagneticButton component with magnetic hover effect
 */
const MagneticButton = ({ 
  children, 
  strength = 0.3,
  speed = 0.3,
  className = "",
  ...props 
}) => {
  const buttonRef = useRef()
  const magnetRef = useRef()

  useEffect(() => {
    if (!buttonRef.current) return

    const button = buttonRef.current
    let isHovering = false

    const handleMouseMove = (e) => {
      if (!isHovering) return

      const rect = button.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength

      gsap.to(button, {
        x: deltaX,
        y: deltaY,
        duration: speed,
        ease: "power2.out"
      })

      // Optional: Move text in opposite direction for extra effect
      if (magnetRef.current) {
        gsap.to(magnetRef.current, {
          x: -deltaX * 0.2,
          y: -deltaY * 0.2,
          duration: speed,
          ease: "power2.out"
        })
      }
    }

    const handleMouseEnter = () => {
      isHovering = true
      gsap.to(button, {
        scale: 1.05,
        duration: speed,
        ease: "power2.out"
      })
    }

    const handleMouseLeave = () => {
      isHovering = false
      gsap.to(button, {
        x: 0,
        y: 0,
        scale: 1,
        duration: speed * 1.5,
        ease: "elastic.out(1, 0.3)"
      })

      if (magnetRef.current) {
        gsap.to(magnetRef.current, {
          x: 0,
          y: 0,
          duration: speed * 1.5,
          ease: "elastic.out(1, 0.3)"
        })
      }
    }

    // Use passive listeners for better performance
    button.addEventListener('mousemove', handleMouseMove, { passive: true })
    button.addEventListener('mouseenter', handleMouseEnter, { passive: true })
    button.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    return () => {
      button.removeEventListener('mousemove', handleMouseMove)
      button.removeEventListener('mouseenter', handleMouseEnter)
      button.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength, speed])

  return (
    <Button
      ref={buttonRef}
      className={className}
      {...props}
    >
      <span ref={magnetRef} className="relative z-10">
        {children}
      </span>
    </Button>
  )
}

export default MagneticButton