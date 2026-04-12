import React from 'react'
import Navigation from '../components/layout/Navigation'
import Hero from '../components/sections/Hero'
import Footer from '../components/layout/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Footer />
    </div>
  )
}