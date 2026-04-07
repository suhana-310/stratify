/*
 * Stratify 2026 - Advanced 3D Project Management System
 * Copyright (c) 2026 Stratify. All rights reserved.
 * 
 * This software is proprietary and confidential.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 */

import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { RealtimeProvider } from './contexts/RealtimeContext'
import Background3D from './components/3d/Background3D'
import ErrorBoundary from './components/error/ErrorBoundary'
import AuthErrorBoundary from './components/auth/AuthErrorBoundary'
import './utils/apiTest' // Import API test for debugging
import ProtectedRoute from './components/auth/ProtectedRoute'
import AuthRedirect from './components/auth/AuthRedirect'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import { initializeGSAP } from './utils/gsapOptimizations'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

function App() {
  useEffect(() => {
    // Initialize GSAP optimizations
    initializeGSAP()

    // Initialize smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <ThemeProvider>
      <AuthErrorBoundary>
        <AuthProvider>
          <RealtimeProvider>
            <Router
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
              }}
            >
            {/* CRITICAL: Global 3D Background - Fixed behind everything */}
            <ErrorBoundary 
              fallback={
                <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#FFF8E7] via-[#FFD77A]/20 to-[#E6A520]/30" />
              }
            >
              <Background3D />
            </ErrorBoundary>
            
            {/* Main content with relative positioning */}
            <div className="relative z-10 min-h-screen"
                 style={{ position: 'relative' }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Auth Routes - Redirect to dashboard if already authenticated */}
                <Route path="/login" element={
                  <AuthRedirect>
                    <LoginPage />
                  </AuthRedirect>
                } />
                <Route path="/register" element={
                  <AuthRedirect>
                    <RegisterPage />
                  </AuthRedirect>
                } />
                <Route path="/forgot-password" element={
                  <AuthRedirect>
                    <ForgotPasswordPage />
                  </AuthRedirect>
                } />
                <Route path="/reset-password/:token" element={
                  <AuthRedirect>
                    <ResetPasswordPage />
                  </AuthRedirect>
                } />
                
                {/* Protected Routes - Only accessible after login */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/projects" element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                } />
                
                {/* Redirect unknown routes to landing page */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--color-card)',
                    color: 'var(--color-text-primary)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500'
                  },
                  success: {
                    iconTheme: {
                      primary: 'var(--color-primary)',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </RealtimeProvider>
      </AuthProvider>
    </AuthErrorBoundary>
  </ThemeProvider>
  )
}

export default App