import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Play, CheckCircle, Sparkles, Zap, Target, TrendingUp, Users, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import ScrollReveal from '../animations/ScrollReveal'
import TextReveal from '../animations/TextReveal'
import ParallaxElement from '../animations/ParallaxElement'
import MagneticButton from '../animations/MagneticButton'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const { isAuthenticated } = useAuth()
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const dashboardRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Hero parallax effect
      gsap.to(heroRef.current, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      })

      // Dashboard floating animation
      gsap.to(dashboardRef.current, {
        y: -20,
        rotation: 2,
        duration: 4,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      })

      // Floating particles animation
      const particles = containerRef.current.querySelectorAll('.floating-particle')
      particles.forEach((particle, i) => {
        gsap.to(particle, {
          y: -60,
          x: Math.sin(i) * 30,
          scale: 1.2,
          opacity: 0.6,
          duration: 6 + i * 1.5,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.8
        })
      })

      // Stats cards animation
      const statsCards = containerRef.current.querySelectorAll('.stats-card')
      statsCards.forEach((card, i) => {
        gsap.to(card, {
          y: i % 2 === 0 ? -15 : 12,
          rotation: i % 2 === 0 ? 3 : -2,
          duration: 4 + i,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
          delay: i + 1
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Parallax Gradient Orbs */}
        <ParallaxElement speed={0.3}>
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(255, 215, 122, 0.3) 0%, rgba(230, 165, 32, 0.2) 50%, transparent 100%)' }} />
        </ParallaxElement>
        <ParallaxElement speed={0.5}>
          <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(230, 165, 32, 0.3) 0%, rgba(122, 74, 0, 0.2) 50%, transparent 100%)' }} />
        </ParallaxElement>
        
        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="floating-particle absolute w-1 h-1 rounded-full"
            style={{
              left: `${15 + i * 10}%`,
              top: `${25 + (i % 3) * 25}%`,
              background: 'linear-gradient(45deg, #E6A520, #7A4A00)'
            }}
          />
        ))}
      </div>

      <div ref={heroRef} className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <ScrollReveal direction="up" delay={0.2}>
              <span className="inline-flex items-center px-4 py-2 rounded-full glass text-sm font-medium border shadow-lg mb-8" style={{ color: '#7A4A00', borderColor: 'rgba(122, 74, 0, 0.3)', backgroundColor: 'rgba(255, 248, 231, 0.8)' }}>
                <div className="mr-2 animate-spin">
                  <Sparkles className="w-4 h-4" style={{ color: '#E6A520' }} />
                </div>
                Trusted by 50,000+ teams worldwide
              </span>
            </ScrollReveal>

            <TextReveal 
              as="h1"
              type="words"
              stagger={0.1}
              className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
            >
              <span className="block mb-2" style={{ color: '#7A4A00' }}>
                Stratify
              </span>
            </TextReveal>

            <ScrollReveal direction="up" delay={0.6}>
              <p className="text-lg mb-8 max-w-2xl leading-relaxed" style={{ color: '#7A4A00' }}>
                Transform your team's productivity with our premium Stratify platform. 
                Beautiful design meets powerful functionality in perfect harmony.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.8} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <MagneticButton size="lg" className="group">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </MagneticButton>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <MagneticButton variant="premium" size="lg" className="group shadow-xl hover:shadow-2xl hover:shadow-purple-500/30">
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </MagneticButton>
                  </Link>
                  
                  <MagneticButton variant="glass" size="lg" className="group">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </MagneticButton>
                </>
              )}
            </ScrollReveal>

            <ScrollReveal direction="up" delay={1} className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm">
              {[
                'No credit card required',
                '14-day free trial',
                'Cancel anytime'
              ].map((text, index) => (
                <span 
                  key={text}
                  className="flex items-center glass px-3 py-2 rounded-full border hover:scale-105 transition-transform duration-300"
                  style={{ 
                    borderColor: 'rgba(122, 74, 0, 0.3)', 
                    backgroundColor: 'rgba(255, 248, 231, 0.8)',
                    color: '#7A4A00'
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" style={{ color: '#E6A520' }} />
                  {text}
                </span>
              ))}
            </ScrollReveal>
          </div>

          {/* Right Content - Premium Dashboard Preview */}
          <ScrollReveal direction="right" delay={0.4} className="relative">
            <div ref={dashboardRef} className="relative">
              {/* Main Dashboard Card */}
              <div className="glass-strong rounded-3xl p-8 border shadow-2xl hover:scale-102 transition-transform duration-300" style={{ borderColor: 'rgba(122, 74, 0, 0.3)', backgroundColor: 'rgba(255, 248, 231, 0.9)' }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E6A520, #7A4A00)' }}>
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold" style={{ color: '#7A4A00' }}>Project Dashboard</h3>
                  </div>
                  <div className="flex space-x-2">
                    {['bg-red-400', 'bg-yellow-400', 'bg-green-400'].map((color, i) => (
                      <div 
                        key={i}
                        className={`w-3 h-3 ${color} rounded-full animate-pulse`}
                        style={{ animationDelay: `${i * 0.3}s` }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: 'Website Redesign', status: 'In Progress', progress: 75, color: 'linear-gradient(135deg, #FFD77A, #E6A520)' },
                    { name: 'Mobile App', status: 'Completed', progress: 100, color: 'linear-gradient(135deg, #E6A520, #7A4A00)' },
                    { name: 'API Integration', status: 'Planning', progress: 25, color: 'linear-gradient(135deg, #FFF8E7, #FFD77A)' }
                  ].map((project, index) => (
                    <div
                      key={project.name}
                      className="glass-subtle rounded-xl p-4 border hover:scale-102 hover:translate-x-1 transition-all duration-300"
                      style={{ borderColor: 'rgba(122, 74, 0, 0.2)', backgroundColor: 'rgba(255, 248, 231, 0.6)' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium" style={{ color: '#7A4A00' }}>{project.name}</span>
                        <span className="px-2 py-1 text-white text-xs font-medium rounded-full" style={{ background: project.color }}>
                          {project.status}
                        </span>
                      </div>
                      <div className="w-full rounded-full h-2" style={{ backgroundColor: 'rgba(122, 74, 0, 0.2)' }}>
                        <div 
                          className="h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${project.progress}%`, background: project.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Stats Cards */}
              <div className="stats-card absolute -top-4 -right-4 glass rounded-2xl p-4 border shadow-xl hover:scale-110 transition-transform duration-300" style={{ borderColor: 'rgba(122, 74, 0, 0.3)', backgroundColor: 'rgba(255, 248, 231, 0.9)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4" style={{ color: '#E6A520' }} />
                  <span className="text-xs font-medium" style={{ color: '#7A4A00' }}>Velocity</span>
                </div>
                <div className="text-xl font-bold" style={{ color: '#E6A520' }}>+24%</div>
              </div>

              <div className="stats-card absolute -bottom-4 -left-4 glass rounded-2xl p-4 border shadow-xl hover:scale-110 transition-transform duration-300" style={{ borderColor: 'rgba(122, 74, 0, 0.3)', backgroundColor: 'rgba(255, 248, 231, 0.9)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4" style={{ color: '#E6A520' }} />
                  <span className="text-xs font-medium" style={{ color: '#7A4A00' }}>Tasks</span>
                </div>
                <div className="text-xl font-bold" style={{ color: '#E6A520' }}>127</div>
              </div>

              <div className="stats-card absolute top-1/2 -right-8 glass rounded-xl p-3 border shadow-lg hover:scale-110 transition-transform duration-300" style={{ borderColor: 'rgba(122, 74, 0, 0.3)', backgroundColor: 'rgba(255, 248, 231, 0.9)' }}>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: '#E6A520' }} />
                  <span className="text-xs font-medium" style={{ color: '#7A4A00' }}>12 Active</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}