import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  Instagram,
  Youtube,
  ExternalLink,
  Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'API Documentation', href: '#api' },
      { name: 'Changelog', href: '#changelog' }
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press Kit', href: '#press' },
      { name: 'Partners', href: '#partners' }
    ],
    resources: [
      { name: 'Help Center', href: '#help' },
      { name: 'Documentation', href: '#docs' },
      { name: 'Community', href: '#community' },
      { name: 'Templates', href: '#templates' },
      { name: 'Webinars', href: '#webinars' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'Security', href: '#security' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#twitter', color: 'hover:text-blue-400' },
    { name: 'LinkedIn', icon: Linkedin, href: '#linkedin', color: 'hover:text-blue-600' },
    { name: 'GitHub', icon: Github, href: '#github', color: 'hover:text-gray-300' },
    { name: 'Instagram', icon: Instagram, href: '#instagram', color: 'hover:text-pink-400' },
    { name: 'YouTube', icon: Youtube, href: '#youtube', color: 'hover:text-red-500' },
    { name: 'Email', icon: Mail, href: '#email', color: 'hover:text-green-400' }
  ];

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        
        {/* Animated background elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-500/5 to-accent-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [360, 180, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-accent-500/5 to-primary-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Logo */}
              <motion.div 
                className="flex items-center space-x-3 mb-6 group cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <motion.img
                  src="/logo.png" 
                  alt="Stratify Logo" 
                  className="w-28 h-28 object-contain"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                <span className="text-2xl font-bold" style={{ color: '#fff8e7' }}>
                  Stratify
                </span>
              </motion.div>

              <p className="text-gray-400 mb-8 max-w-sm leading-relaxed">
                Transform your team's productivity with our premium Stratify platform. 
                Beautiful design meets powerful functionality.
              </p>

              {/* Newsletter Signup */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white">Stay in the loop</h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-500 transition-all duration-300"
                  />
                  <motion.button
                    className="px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h4 className="font-bold text-white text-lg capitalize tracking-wide">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: (index * 0.1) + (linkIndex * 0.05) }}
                    viewport={{ once: true }}
                  >
                    <motion.a
                      href={link.href}
                      className="group flex items-center text-gray-400 hover:text-white transition-all duration-300 text-sm"
                      whileHover={{ x: 8 }}
                    >
                      <span className="relative">
                        {link.name}
                        <motion.div
                          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                          initial={{ width: 0 }}
                          whileHover={{ width: '100%' }}
                          transition={{ duration: 0.3 }}
                        />
                      </span>
                      <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8 origin-center"
        />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <p className="text-gray-400 text-sm mb-2">
              © {currentYear} Stratify. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs flex items-center justify-center lg:justify-start gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> by the Stratify team
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <span className="text-gray-500 text-sm mr-2">Follow us:</span>
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.href}
                className={`p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-gray-400 ${social.color} transition-all duration-300 hover:bg-gray-700/50 hover:border-gray-600 hover:shadow-lg group`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>

          {/* Status & Version */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 text-xs text-gray-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>All systems operational</span>
            </div>
            <span>•</span>
            <span className="px-3 py-1 bg-gray-800/50 border border-gray-700 rounded-full">
              v2.1.0
            </span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;