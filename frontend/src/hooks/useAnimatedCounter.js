import { useState, useEffect, useRef } from 'react'

export const useAnimatedCounter = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start)
  const countRef = useRef(start)
  const rafRef = useRef()

  useEffect(() => {
    const startTime = Date.now()
    const startValue = countRef.current

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(startValue + (end - startValue) * easeOutQuart)
      
      setCount(currentValue)
      countRef.current = currentValue

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [end, duration, start])

  return count
}