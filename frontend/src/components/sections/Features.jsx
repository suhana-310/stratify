import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Zap, 
  Users, 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Shield,
  Sparkles,
  ArrowRight,
  Star,
  Crown,
  Rocket,
  Brain
} from 'lucide-react'
import ScrollReveal from '../animations/ScrollReveal'
import TextReveal from '../animations/TextReveal'
import ParallaxElement from '../animations/ParallaxElement'
import MagneticButton from '../animations/MagneticButton'
import { createOptimizedScrollTrigger } from '../../utils/gsapOptimizations'

gsap.registerPlugin(ScrollTrigger)

export default function Features() {
  const containerRef = useRef(null)
  const cardsRef = useRef(null)

  // Main features (6 cards in 3x2 grid)
  const features = [
    {
      icon: Zap,
      title: 'Lightning Performance',
      description: 'Blazing fast performance with real-time updates and instant synchronization across all devices.',
      gradient: 'from-yellow-400 to-orange-500',
      glowColor: 'yellow'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Advanced collaboration tools with real-time editing, smart notifications, and video integration.',
      gradient: 'from-blue-400 to-cyan-500',
      glowColor: 'blue'
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'AI-powered insights and comprehensive reporting to optimize team performance and productivity.',
      gradient: 'from-green-400 to-emerald-500',
      glowColor: 'green'
    },
    {
      icon: Calendar,
      title: 'Intelligent Scheduling',
      description: 'Smart calendar integration with automated scheduling and intelligent conflict resolution.',
      gradient: 'from-purple-400 to-indigo-500',
      glowColor: 'purple'
    },
    {
      icon: MessageSquare,
      title: 'Unified Communication',
      description: 'Built-in messaging with threaded conversations, file sharing, and AI translation.',
      gradient: 'from-pink-400 to-rose-500',
      glowColor: 'pink'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with end-to-end encryption and advanced threat protection.',
      gradient: 'from-red-400 to-pink-500',
      glowColor: 'red'
    }
  ]

  // Highlight feature (bigger card)
  const highlightFeature = {
    icon: Brain,
    title: 'AI-Powered Project Intelligence',
    description: 'Revolutionary AI assistant that predicts project outcomes, suggests optimizations, automates routine tasks, and provides intelligent insights to keep your projects on track and your team productive.',
    features: ['Predictive Analytics', 'Smart Automation', 'Intelligent Insights', 'Risk Assessment'],
    gradient: 'from-primary-400 via-accent-400 to-primary-500',
    glowColor: 'primary'
  }

  useEffect(() => {
    if (!containerRef.current || !cardsRef.current) return

    const ctx = gsap.context(() => {
      // Parallax background elements
      gsap.to('.bg-orb-1', {
        y: -100,
        x: 50,
        rotation: 180,
        scale: 1.2,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      })

      gsap.to('.bg-orb-2', {
        y: 80,
        x: -60,
        rotation: -180,
        scale: 1.3,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      })

      // Feature cards stagger animation
      const cards = cardsRef.current.children
      gsap.fromTo(cards, 
        {
          opacity: 0,
          y: 80,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Hover animations for cards
      Array.from(cards).forEach((card, index) => {
        const icon = card.querySelector('.feature-icon')
        const content = card.querySelector('.feature-content')
        
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { scale: 1.05, y: -10, duration: 0.3, ease: "power2.out" })
          gsap.to(icon, { rotation: 15, scale: 1.1, duration: 0.3, ease: "power2.out" })
          gsap.to(content, { y: -5, duration: 0.3, ease: "power2.out" })
        })

        card.addEventListener('mouseleave', () => {
          gsap.to(card, { scale: 1, y: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" })
          gsap.to(icon, { rotation: 0, scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" })
          gsap.to(content, { y: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" })
        })
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={containerRef}
      id="features" 
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-gray-50/50 to-white"
    >
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-orb-1 absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary-200/20 via-accent-200/20 to-primary-300/20 rounded-full blur-3xl" />
        <div className="bg-orb-2 absolute bottom-20 left-20 w-[500px] h-[500px] bg-gradient-to-br from-accent-200/15 via-primary-200/15 to-accent-300/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <ScrollReveal direction="up" className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-xl border border-white/30 text-gray-900 rounded-full text-sm font-semibold mb-8 shadow-lg">
            <Sparkles className="w-5 h-5 text-primary-500" />
            Premium Features
            <Crown className="w-4 h-4 text-accent-500" />
          </div>
          
          <TextReveal 
            as="h2" 
            type="words"
            stagger={0.1}
            className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Powerful Features for
            <br />
            <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">
              Modern Teams
            </span>
          </TextReveal>
          
          <TextReveal 
            as="p" 
            type="words"
            stagger={0.05}
            delay={0.4}
            className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            Experience next-generation Stratify with AI-powered insights, 
            seamless collaboration, and enterprise-grade security.
          </TextReveal>
        </ScrollReveal>

        {/* Highlight Feature Card */}
        <ScrollReveal direction="up" delay={0.2} className="mb-16">
          <div className="group relative">
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl p-8 lg:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-accent-50/30 to-primary-50/50 rounded-3xl" />
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-primary-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  {/* Icon */}
                  <div className={`feature-icon w-20 h-20 bg-gradient-to-br ${highlightFeature.gradient} rounded-3xl flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl group-hover:shadow-primary-500/25 transition-all duration-500`}>
                    <highlightFeature.icon className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>

                  <div className="feature-content">
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                      {highlightFeature.title}
                    </h3>
                    
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      {highlightFeature.description}
                    </p>

                    {/* Feature List */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {highlightFeature.features.map((feature, index) => (
                        <div key={feature} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
                          <span className="text-sm font-medium text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <MagneticButton className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <Rocket className="w-5 h-5" />
                      Try AI Features
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </MagneticButton>
                  </div>
                </div>

                {/* Visual Element */}
                <div className="relative">
                  <div className="w-64 h-64 mx-auto bg-gradient-to-br from-primary-400/20 via-accent-400/20 to-primary-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
                      <Brain className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Badge */}
              <div className="absolute top-6 right-6 px-3 py-1 bg-gradient-to-r from-accent-500 to-primary-500 text-white text-xs font-bold rounded-full">
                PREMIUM
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Feature Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="group h-full"
            >
              <div className="relative h-full bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${feature.glowColor}-500/5 to-${feature.glowColor}-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`feature-icon w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:shadow-${feature.glowColor}-500/25 transition-all duration-500`}>
                    <feature.icon className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>

                  <div className="feature-content">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {feature.description}
                    </p>

                    {/* Learn More Link */}
                    <div className="flex items-center gap-2 text-primary-600 font-semibold group-hover:text-primary-700 transition-colors text-sm">
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="absolute top-4 right-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal direction="up" delay={0.6} className="text-center mt-20">
          <MagneticButton className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg">
            <Sparkles className="w-6 h-6" />
            Explore All Features
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </MagneticButton>
        </ScrollReveal>
      </div>
    </section>
  )
}