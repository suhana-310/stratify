import React from 'react'
import { 
  Zap, 
  Users, 
  BarChart3, 
  Shield,
  Sparkles,
  ArrowRight,
  Star,
  Brain,
  Rocket,
  TrendingUp,
  Target,
  CheckCircle
} from 'lucide-react'
import ScrollReveal from '../animations/ScrollReveal'
import TextReveal from '../animations/TextReveal'

export default function HorizontalFeatures() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Revolutionary AI that predicts outcomes and automates routine tasks for maximum productivity.',
      gradient: 'linear-gradient(135deg, #E6A520, #7A4A00)',
      stats: { value: '95%', label: 'Accuracy' },
      highlights: ['Predictive Analytics', 'Smart Automation', 'Risk Assessment'],
      accentColor: '#E6A520'
    },
    {
      icon: Zap,
      title: 'Lightning Performance',
      description: 'Blazing fast performance with real-time updates and instant synchronization across platforms.',
      gradient: 'linear-gradient(135deg, #FFD77A, #E6A520)',
      stats: { value: '2.3s', label: 'Load Time' },
      highlights: ['Real-time Sync', 'Instant Updates', 'Global CDN'],
      accentColor: '#FFD77A'
    },
    {
      icon: Users,
      title: 'Advanced Collaboration',
      description: 'Seamless team collaboration with real-time editing and smart notifications.',
      gradient: 'linear-gradient(135deg, #7A4A00, #E6A520)',
      stats: { value: '50K+', label: 'Teams' },
      highlights: ['Real-time Editing', 'Video Integration', 'Smart Notifications'],
      accentColor: '#7A4A00'
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Comprehensive reporting and AI-powered insights to optimize team performance.',
      gradient: 'linear-gradient(135deg, #E6A520, #FFD77A)',
      stats: { value: '24/7', label: 'Monitoring' },
      highlights: ['Custom Reports', 'Performance Metrics', 'Trend Analysis'],
      accentColor: '#E6A520'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with end-to-end encryption and compliance certifications.',
      gradient: 'linear-gradient(135deg, #7A4A00, #FFD77A)',
      stats: { value: '99.9%', label: 'Uptime' },
      highlights: ['End-to-end Encryption', 'SOC 2 Compliant', 'Advanced Threats'],
      accentColor: '#7A4A00'
    }
  ]

  return (
    <section className="py-16" style={{ backgroundColor: 'transparent' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal direction="up" className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-xl border rounded-full text-sm font-semibold mb-6 shadow-lg" 
               style={{ backgroundColor: 'rgba(255, 248, 231, 0.8)', borderColor: 'rgba(122, 74, 0, 0.3)', color: '#7A4A00' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#E6A520' }} />
            Premium Features
          </div>
          
          <TextReveal 
            as="h2" 
            type="words"
            stagger={0.08}
            className="text-4xl lg:text-5xl font-bold mb-4 leading-tight"
            style={{ color: '#7A4A00' }}
          >
            Powerful Tools for Modern Teams
          </TextReveal>
          
          <TextReveal 
            as="p" 
            type="words"
            stagger={0.03}
            delay={0.2}
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: '#7A4A00' }}
          >
            Experience enterprise-grade features designed for productivity and growth.
          </TextReveal>
        </ScrollReveal>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12 justify-items-center">
          {features.map((feature, index) => (
            <ScrollReveal 
              key={feature.title}
              direction="up"
              delay={index * 0.1}
              className="group w-full max-w-sm"
            >
              <div className="relative h-[420px] w-full backdrop-blur-xl border rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105" 
                   style={{ 
                     backgroundColor: 'rgba(255, 248, 231, 0.95)', 
                     borderColor: 'rgba(122, 74, 0, 0.2)'
                   }}>
                
                {/* Hover Background Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-8 transition-all duration-500 rounded-2xl"
                  style={{ background: feature.gradient }}
                />
                
                <div className="relative z-10 h-full flex flex-col">
                  
                  {/* Header Section */}
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-500"
                      style={{ background: feature.gradient }}
                    >
                      <feature.icon className="w-7 h-7 text-white" strokeWidth={2} />
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: feature.accentColor }}>{feature.stats.value}</div>
                      <div className="text-xs font-medium" style={{ color: '#7A4A00' }}>{feature.stats.label}</div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3 group-hover:scale-105 transition-all duration-300" 
                        style={{ color: '#7A4A00' }}>
                      {feature.title}
                    </h3>
                    
                    <p className="text-sm leading-relaxed mb-4" 
                       style={{ color: '#7A4A00', opacity: 0.8 }}>
                      {feature.description}
                    </p>

                    {/* Compact Highlights */}
                    <div className="space-y-2 mb-6">
                      {feature.highlights.map((highlight, idx) => (
                        <div key={highlight} className="flex items-center gap-2 text-xs">
                          <CheckCircle className="w-3 h-3" style={{ color: feature.accentColor }} />
                          <span style={{ color: '#7A4A00' }}>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div className="flex items-center justify-between">
                    <button 
                      className="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105 relative overflow-hidden"
                      style={{ background: feature.gradient }}
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                    
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-3 h-3 fill-current" 
                          style={{ color: '#FFD77A' }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Premium Badge */}
                <div 
                  className="absolute top-4 left-4 px-3 py-1 text-white text-xs font-bold rounded-lg shadow-sm z-20"
                  style={{ background: feature.gradient }}
                >
                  PRO
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA Section */}
        <ScrollReveal direction="up" delay={0.6} className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="relative backdrop-blur-xl border rounded-2xl p-8 shadow-xl text-white overflow-hidden transform hover:scale-105 transition-all duration-500" 
                 style={{ background: 'linear-gradient(135deg, #7A4A00, #E6A520, #FFD77A)' }}>
              
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <Rocket className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-4">Ready to Start?</h3>
                <p className="text-white/90 mb-6 text-sm leading-relaxed">
                  Join thousands of teams using our platform for extraordinary results.
                </p>

                <button className="inline-flex items-center gap-2 px-6 py-3 bg-white font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-xl mb-6" 
                        style={{ color: '#7A4A00' }}>
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-6 text-xs text-white/80">
                  <div className="flex items-center gap-2">
                    <Target className="w-3 h-3" />
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" />
                    <span>No credit card required</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}