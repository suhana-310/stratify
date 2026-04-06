import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import UserMenu from '../auth/UserMenu';
import { cn } from '../../utils/cn';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollTop / docHeight) * 100, 100);
      
      setScrolled(scrollTop > 20);
      setScrollProgress(progress);

      // Update active section based on scroll position
      const sections = ['features', 'pricing', 'demo', 'about', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Features', href: '#features', id: 'features' },
    { name: 'Pricing', href: '#pricing', id: 'pricing' },
    { name: 'Demo', href: '#demo', id: 'demo' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Contact', href: '#contact', id: 'contact' }
  ];

  const handleNavClick = (href) => {
    setIsOpen(false);
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 z-[60] origin-left"
        style={{ scaleX: scrollProgress / 100 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrollProgress / 100 }}
        transition={{ duration: 0.1 }}
      />

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out",
          scrolled 
            ? "backdrop-blur-xl bg-white/90 shadow-2xl border-b border-gray-200/50" 
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.img
                src="/logo.png" 
                alt="Stratify Logo" 
                className="w-28 h-28 object-contain"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              
              <motion.span 
                className="text-2xl font-bold"
                style={{ color: '#7a4a00' }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Stratify
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  className={cn(
                    "relative px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-xl group",
                    activeSection === item.id
                      ? "text-amber-700 bg-amber-50"
                      : "text-amber-800 hover:text-amber-600"
                  )}
                >
                  {item.name}
                  
                  {/* Smooth underline animation */}
                  <motion.div
                    className="absolute bottom-1 left-1/2 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    initial={{ width: 0, x: "-50%" }}
                    animate={{ 
                      width: activeSection === item.id ? "60%" : 0,
                      x: "-50%"
                    }}
                    whileHover={{ width: "60%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  
                  {/* Hover background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                    layoutId="navHover"
                  />
                </motion.button>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard">
                    <Button variant="secondary" size="md" className="font-semibold">
                      Dashboard
                    </Button>
                  </Link>
                  <UserMenu />
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button 
                      variant="ghost" 
                      size="md" 
                      className="font-semibold text-amber-800 hover:text-amber-600 hover:bg-amber-50"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="premium"
                        size="md" 
                        className="font-semibold shadow-xl hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 group"
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </motion.div>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-3 rounded-2xl hover:bg-gray-100 transition-colors duration-300"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6 text-gray-900" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6 text-gray-900" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                onClick={() => setIsOpen(false)}
              />
              
              {/* Drawer */}
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ 
                  type: "spring", 
                  damping: 25, 
                  stiffness: 200,
                  duration: 0.5 
                }}
                className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl border-l border-gray-200/50 shadow-2xl z-50 overflow-hidden"
              >
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                    <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent">
                      Menu
                    </span>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex-1 px-6 py-8 space-y-2">
                    {navItems.map((item, index) => (
                      <motion.button
                        key={item.name}
                        onClick={() => handleNavClick(item.href)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className={cn(
                          "w-full text-left text-lg font-semibold py-4 px-4 rounded-xl transition-all duration-300",
                          activeSection === item.id
                            ? "text-amber-700 bg-amber-50"
                            : "text-amber-800 hover:text-amber-600 hover:bg-amber-50"
                        )}
                      >
                        {item.name}
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* Auth Buttons */}
                  <div className="p-6 border-t border-gray-200/50 space-y-4">
                    {isAuthenticated ? (
                      <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button className="w-full text-lg py-4">
                          Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                          <Button variant="secondary" className="w-full text-lg py-4 font-semibold">
                            Login
                          </Button>
                        </Link>
                        <Link to="/register" onClick={() => setIsOpen(false)}>
                          <Button 
                            variant="premium"
                            className="w-full text-lg py-4 font-semibold shadow-xl hover:shadow-2xl hover:shadow-amber-500/30"
                          >
                            Get Started
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navigation;