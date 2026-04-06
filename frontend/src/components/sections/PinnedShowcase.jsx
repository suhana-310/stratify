import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Monitor, Smartphone, Tablet, Zap, Users, BarChart3 } from 'lucide-react'
import PinSection from '../animations/PinSection'
import ScrollReveal from '../animations/ScrollReveal'
import TextReveal from '../animations/TextReveal'

gsap.registerPlugin(ScrollTrigger)

export default function PinnedShowcase() {
  const showcaseRef = useRef(null)
  const cardsRef = useRef(null)

  const devices = [
    {
      icon: Monitor,
      title: 'Desktop',
      description: 'Full-featured experience with advanced tools and comprehensive dashboards.',
      color: 'from-blue-500 to-blue-600',
      stats: '99.9% Uptime'
    },
    {
      icon: Tablet,
      title: 'Tablet',
      description: 'Optimized interface for touch interactions and mobile productivity.',
      color: 'from-purple-500 to-purple-600',
      stats: 'Touch Optimized'
    },
    {
      icon: Smartphone,
      title: 'Mobile',
      description: 'Lightweight app with essential features for on-the-go management.',
      color: 'from-green-500 to-green-600',
      stats: 'Native Apps'
    }
  ]

  const features = [
    { icon: Zap, title: 'Lightning Fast', value: '2.3s', label: 'Load Time' },
    { icon: Users, title: 'Team Ready', value: '50K+', label: 'Active Teams' },
    { icon: BarChart3, title: 'Data Driven', value: '99.9%', label: 'Accuracy' }
  ]

  useEffect(() => {
    if (!showcaseRef.current || !cardsRef.current) return

    const ctx = gsap.context(() => {
      // Animate cards during pin
      const cards = cardsRef.current.children
      
      gsap.fromTo(cards,
        {
          opacity: 0,
          y: 100,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: showcaseRef.current,
            start: "top center",
            end: "bottom center",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Floating animation for feature stats
      gsap.to('.feature-stat', {
        y: -10,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.3
      })

    }, showcaseRef)

    return () => ctx.revert()
  }, [])

  return (
    <PinSection 
      duration="300%"
      className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden"
      onPin={() => console.log('Showcase pinned')}
      onUnpin={() => console.log('Showcase unpinned')}
    >
      <div ref={showcaseRef} className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <ScrollReveal direction="up" className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full text-sm font-semibold mb-8 shadow-lg">
              <Monitor className="w-5 h-5" />
              Cross-Platform Excellence
            </div>
            
            <TextReveal 
              as="h2" 
              type="words"
              stagger={0.1}
              className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              Works Everywhere
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                You Do
              </span>
            </TextReveal>
            
            <TextReveal 
              as="p" 
              type="words"
              stagger={0.05}
              delay={0.4}
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Seamless experience across all devices with native apps, responsive design, 
              and synchronized data that follows you everywhere.
            </TextReveal>
          </ScrollReveal>

          {/* Device Cards */}
          <div ref={cardsRef} className="grid md:grid-cols-3 gap-8 mb-16">
            {devices.map((device, index) => (
              <div 
                key={device.title}
                className="group relative"
              >
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden hover:scale-105">
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${device.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />
                  
                  <div className="relative z-10 text-center">
                    {/* Icon */}
                    <div className={`w-20 h-20 bg-gradient-to-br ${device.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110`}>
                      <device.icon className="w-10 h-10 text-white" strokeWidth={2} />
                    </div>

                    <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-300 transition-colors duration-300">
                      {device.title}
                    </h3>
                    
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {device.description}
                    </p>

                    {/* Stats Badge */}
                    <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-sm font-semibold">
                      {device.stats}
                    </div>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
                </div>
              </div>
            ))}
          </div>

          {/* Feature Stats */}
          <ScrollReveal direction="up" delay={0.6} className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="feature-stat text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/30 rounded-2xl mb-4 shadow-xl">
                  <feature.icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                
                <div className="text-3xl font-bold text-white mb-2">
                  {feature.value}
                </div>
                
                <div className="text-sm text-gray-300 mb-1">
                  {feature.label}
                </div>
                
                <div className="text-lg font-semibold text-blue-300">
                  {feature.title}
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </div>
    </PinSection>
  )
}