import React from 'react'
import { ArrowRight, Target, TrendingUp, Users, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Hero() {
  const { isAuthenticated } = useAuth()

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
              <span className="block mb-2" style={{ color: '#7A4A00' }}>
                Stratify
              </span>
            </h1>

            <p className="text-lg mb-8 max-w-2xl leading-relaxed" style={{ color: '#7A4A00' }}>
              Transform your team's productivity with our premium Stratify platform. 
              Beautiful design meets powerful functionality in perfect harmony.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <button className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </Link>
              ) : (
                <Link to="/register">
                  <button className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <div className="relative">
              {/* Main Dashboard Card */}
              <div className="rounded-3xl p-8 border shadow-2xl" style={{ borderColor: 'rgba(122, 74, 0, 0.3)', backgroundColor: 'rgba(255, 248, 231, 0.9)' }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E6A520, #7A4A00)' }}>
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold" style={{ color: '#7A4A00' }}>Project Dashboard</h3>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
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
                      className="rounded-xl p-4 border"
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
                          className="h-2 rounded-full"
                          style={{ width: `${project.progress}%`, background: project.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Static Stats Cards */}
              <div className="absolute -top-4 -right-4 rounded-2xl p-4 border shadow-xl" style={{ borderColor: 'rgba(122, 74, 0, 0.3)', backgroundColor: 'rgba(255, 248, 231, 0.9)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4" style={{ color: '#E6A520' }} />
                  <span className="text-xs font-medium" style={{ color: '#7A4A00' }}>Velocity</span>
                </div>
                <div className="text-xl font-bold" style={{ color: '#E6A520' }}>+24%</div>
              </div>

              <div className="absolute -bottom-4 -left-4 rounded-2xl p-4 border shadow-xl" style={{ borderColor: 'rgba(122, 74, 0, 0.3)', backgroundColor: 'rgba(255, 248, 231, 0.9)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4" style={{ color: '#E6A520' }} />
                  <span className="text-xs font-medium" style={{ color: '#7A4A00' }}>Tasks</span>
                </div>
                <div className="text-xl font-bold" style={{ color: '#E6A520' }}>127</div>
              </div>

              <div className="absolute top-1/2 -right-8 rounded-xl p-3 border shadow-lg" style={{ borderColor: 'rgba(122, 74, 0, 0.3)', backgroundColor: 'rgba(255, 248, 231, 0.9)' }}>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: '#E6A520' }} />
                  <span className="text-xs font-medium" style={{ color: '#7A4A00' }}>12 Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}