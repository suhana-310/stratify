import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * TextReveal component for animated text reveals
 * Fallback implementation without SplitText plugin
 */
const TextReveal = ({ 
  children, 
  type = 'words', // 'chars', 'words', 'lines'
  stagger = 0.1,
  duration = 0.8,
  delay = 0,
  ease = "power2.out",
  trigger = null,
  start = "top 80%",
  animation = 'slideUp', // 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'fade', 'scale', 'rotate'
  className = "",
  as = 'div',
  ...props 
}) => {
  const elementRef = useRef()

  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current
    const text = element.textContent || element.innerText

    // Simple word splitting (fallback without SplitText)
    if (type === 'words') {
      const words = text.split(' ')
      const wrappedText = words.map(word => `<span class="word inline-block">${word}</span>`).join(' ')
      element.innerHTML = wrappedText
    } else {
      // For chars and lines, just animate the whole element
      element.innerHTML = `<span class="text-element">${text}</span>`
    }

    const targets = element.querySelectorAll(type === 'words' ? '.word' : '.text-element')

    // Animation presets
    const animations = {
      slideUp: {
        from: { y: 50, opacity: 0 },
        to: { y: 0, opacity: 1 }
      },
      slideDown: {
        from: { y: -50, opacity: 0 },
        to: { y: 0, opacity: 1 }
      },
      slideLeft: {
        from: { x: 50, opacity: 0 },
        to: { x: 0, opacity: 1 }
      },
      slideRight: {
        from: { x: -50, opacity: 0 },
        to: { x: 0, opacity: 1 }
      },
      fade: {
        from: { opacity: 0 },
        to: { opacity: 1 }
      },
      scale: {
        from: { scale: 0, opacity: 0 },
        to: { scale: 1, opacity: 1 }
      },
      rotate: {
        from: { rotationY: 90, opacity: 0 },
        to: { rotationY: 0, opacity: 1 }
      }
    }

    const animConfig = animations[animation] || animations.slideUp

    // Set initial state
    gsap.set(targets, animConfig.from)

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger || element,
        start,
        toggleActions: "play none none reverse"
      }
    })

    tl.to(targets, {
      ...animConfig.to,
      duration,
      delay,
      stagger: type === 'words' ? stagger : 0,
      ease
    })

    return () => {
      tl.kill()
      // Restore original text
      element.textContent = text
    }
  }, [type, stagger, duration, delay, ease, trigger, start, animation])

  const Component = as

  return (
    <Component ref={elementRef} className={className} {...props}>
      {children}
    </Component>
  )
}

export default TextReveal