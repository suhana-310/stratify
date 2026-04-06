import React from 'react'
import Navigation from '../components/layout/Navigation'
import Hero from '../components/sections/Hero'
import TrustLogos from '../components/sections/TrustLogos'
import Features from '../components/sections/Features'
import HorizontalFeatures from '../components/sections/HorizontalFeatures'
import ProductDemo from '../components/sections/ProductDemo'
import Workflow from '../components/sections/Workflow'
import DashboardPreview from '../components/sections/DashboardPreview'
import Integrations from '../components/sections/Integrations'
import Pricing from '../components/sections/Pricing'
import Testimonials from '../components/sections/Testimonials'
import FAQ from '../components/sections/FAQ'
import CTA from '../components/sections/CTA'
import Footer from '../components/layout/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <TrustLogos />
      <Features />
      <HorizontalFeatures />
      <ProductDemo />
      <Workflow />
      <DashboardPreview />
      <Integrations />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}