import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Minus, 
  ChevronDown, 
  HelpCircle, 
  MessageCircle, 
  Mail,
  Sparkles
} from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: 'How does the free trial work?',
      answer: 'You get full access to all premium features for 14 days, no credit card required. You can invite your team, create unlimited projects, and explore all integrations. You can upgrade, downgrade, or cancel anytime during or after the trial period with no commitments.',
      category: 'Getting Started'
    },
    {
      question: 'Can I change my plan later?',
      answer: 'Absolutely! You can upgrade or downgrade your plan at any time from your account settings. Changes take effect immediately, and we\'ll automatically prorate any billing adjustments. You\'ll only pay for what you use, when you use it.',
      category: 'Billing'
    },
    {
      question: 'Is my data secure and private?',
      answer: 'Yes, we take security seriously. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We\'re SOC 2 Type II compliant, GDPR compliant, and undergo regular security audits. We never share your data with third parties and you maintain full ownership of your content.',
      category: 'Security'
    },
    {
      question: 'What kind of customer support do you offer?',
      answer: 'We offer comprehensive support across all plans: email support with 24-hour response time for Starter plans, priority support with 4-hour response for Professional plans, and dedicated 24/7 phone support plus a dedicated account manager for Enterprise customers.',
      category: 'Support'
    },
    {
      question: 'Can I integrate Stratify with other tools?',
      answer: 'Stratify integrates seamlessly with over 100 popular tools including Slack, Microsoft Teams, GitHub, GitLab, Google Workspace, Figma, Adobe Creative Suite, Salesforce, and many more. We also provide a robust REST API and webhooks for custom integrations.',
      category: 'Integrations'
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'You can cancel anytime with no penalties. Your account remains active until the end of your billing period, giving you full access to export all your data in multiple formats (JSON, CSV, PDF). We provide a 30-day grace period after cancellation to retrieve any remaining data.',
      category: 'Account Management'
    },
    {
      question: 'Do you offer team training and onboarding?',
      answer: 'Yes! Professional plans include guided onboarding sessions and training materials. Enterprise customers get dedicated onboarding with a customer success manager, custom training sessions, and ongoing support to ensure your team gets the most out of Stratify.',
      category: 'Training'
    },
    {
      question: 'Can I use Stratify for client collaboration?',
      answer: 'Absolutely! Stratify includes client portal features, guest access controls, branded project spaces, and client-friendly reporting. You can share specific projects with clients while keeping internal discussions private, and generate beautiful client reports automatically.',
      category: 'Collaboration'
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-gray-50/50 to-white">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-primary-200/20 via-accent-200/20 to-primary-300/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
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
            <HelpCircle className="w-5 h-5 text-primary-500" />
            Frequently Asked Questions
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Got Questions?
            <br />
            <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">
              We've Got Answers
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Everything you need to know about Stratify. Can't find what you're looking for? 
            Our support team is here to help.
          </motion.p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={`bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  openIndex === index ? 'ring-2 ring-primary-500/20' : ''
                }`}
              >
                {/* Question Header */}
                <motion.button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 lg:p-8 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-300 group"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                      {faq.question}
                    </h3>
                  </div>
                  
                  {/* Animated Icon */}
                  <motion.div
                    animate={{ 
                      rotate: openIndex === index ? 180 : 0,
                      scale: openIndex === index ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openIndex === index 
                        ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-primary-50 group-hover:text-primary-600'
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" strokeWidth={2.5} />
                  </motion.div>
                </motion.button>
                
                {/* Answer Content */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        ease: [0.25, 0.46, 0.45, 0.94],
                        opacity: { duration: 0.3 }
                      }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        exit={{ y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 lg:px-8 pb-6 lg:pb-8"
                      >
                        <div className="border-t border-gray-200/50 pt-6">
                          <p className="text-gray-700 leading-relaxed text-lg">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Contact Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl p-8 lg:p-12 shadow-xl text-center">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h3>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Our friendly support team is here to help. Get in touch and we'll get back to you as soon as possible.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <MessageCircle className="w-5 h-5" />
                Start Live Chat
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-600 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                Send Email
              </motion.button>
            </div>
            
            {/* Response Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Average response time: 2 hours</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}