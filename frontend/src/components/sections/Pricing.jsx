import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  Star, 
  Crown, 
  Zap, 
  Shield, 
  Sparkles,
  ArrowRight
} from 'lucide-react'

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small teams getting started',
      monthlyPrice: 9,
      yearlyPrice: 7,
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Up to 5 team members',
        '10 projects',
        'Basic analytics',
        'Email support',
        '5GB storage',
        'Mobile app access'
      ],
      popular: false
    },
    {
      name: 'Professional',
      description: 'Best for growing teams and businesses',
      monthlyPrice: 29,
      yearlyPrice: 23,
      icon: Crown,
      color: 'from-primary-500 to-accent-500',
      features: [
        'Up to 25 team members',
        'Unlimited projects',
        'Advanced analytics',
        'Priority support',
        '100GB storage',
        'Custom integrations',
        'Advanced permissions',
        'API access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with advanced needs',
      monthlyPrice: 99,
      yearlyPrice: 79,
      icon: Shield,
      color: 'from-purple-500 to-indigo-500',
      features: [
        'Unlimited team members',
        'Unlimited projects',
        'Custom analytics',
        '24/7 phone support',
        'Unlimited storage',
        'Custom integrations',
        'Advanced security',
        'Dedicated account manager',
        'Custom onboarding'
      ],
      popular: false
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-gray-50/50 to-white">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary-200/20 via-accent-200/20 to-primary-300/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-xl border border-white/30 text-gray-900 rounded-full text-sm font-semibold mb-8 shadow-lg"
          >
            <Sparkles className="w-5 h-5 text-primary-500" />
            Simple Pricing
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Choose Your
            <br />
            <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12"
          >
            Transparent pricing with no hidden fees. Start with a 14-day free trial, 
            no credit card required.
          </motion.p>

          {/* Monthly/Yearly Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="inline-flex items-center bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-2 shadow-lg"
          >
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                !isYearly
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                isYearly
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              className="relative group"
            >
              <motion.div
                whileHover={{ 
                  y: plan.popular ? -8 : -12,
                  scale: plan.popular ? 1.02 : 1.05
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`relative h-full bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                  plan.popular 
                    ? 'scale-105 ring-2 ring-primary-500/20' 
                    : ''
                }`}
              >
                {/* Glow Effect for Popular Plan */}
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-accent-500/10 to-primary-500/10 rounded-3xl" />
                )}

                {/* Popular Badge */}
                {plan.popular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                  >
                    <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                      <Star className="w-4 h-4 mr-2 fill-current" />
                      Most Popular
                    </div>
                  </motion.div>
                )}

                <div className="relative z-10 p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-500`}
                    >
                      <plan.icon className="w-8 h-8 text-white" strokeWidth={2} />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>

                    {/* Price */}
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-5xl font-bold text-gray-900">
                        ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-gray-500 ml-2">/month</span>
                    </div>
                    
                    {isYearly && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-sm text-green-600 font-semibold"
                      >
                        Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/year
                      </motion.div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + featureIndex * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="flex items-center"
                      >
                        <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 group/btn ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-white border-2 border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-600 shadow-sm hover:shadow-lg'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                  </motion.button>
                </div>

                {/* Animated Border for Popular Plan */}
                {plan.popular && (
                  <motion.div
                    animate={{
                      background: [
                        'linear-gradient(0deg, #3B82F6, #8B5CF6, #3B82F6)',
                        'linear-gradient(90deg, #8B5CF6, #EC4899, #8B5CF6)',
                        'linear-gradient(180deg, #EC4899, #3B82F6, #EC4899)',
                        'linear-gradient(270deg, #3B82F6, #8B5CF6, #3B82F6)'
                      ]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute -inset-0.5 rounded-3xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  />
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-16"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              All Plans Include
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                '14-day free trial',
                'No credit card required',
                'Cancel anytime'
              ].map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-center gap-2 text-gray-600"
                >
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
            
            <p className="text-gray-600">
              Need a custom plan? {' '}
              <motion.a 
                href="#contact"
                whileHover={{ scale: 1.05 }}
                className="text-primary-600 hover:text-primary-700 font-semibold underline decoration-2 underline-offset-2"
              >
                Contact our sales team
              </motion.a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}