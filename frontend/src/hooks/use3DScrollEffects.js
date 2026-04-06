import { useRef, useEffect } from 'react';

export const use3DScrollEffects = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Simple scroll effects
    const handleScroll = () => {
      try {
        const scrolled = window.pageYOffset;
        const parallaxElements = container.querySelectorAll('.parallax-bg');
        
        parallaxElements.forEach((element) => {
          const speed = 0.5;
          element.style.transform = `translateY(${scrolled * speed}px)`;
        });
      } catch (error) {
        console.warn('Scroll effect error:', error);
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Add CSS classes for animations with error handling
    try {
      const cards = container.querySelectorAll('.fade-in-card');
      cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          card.style.transition = 'all 0.6s ease-out';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 100);
      });
    } catch (error) {
      console.warn('Animation setup error:', error);
    }

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);

  return {
    containerRef
  };
};