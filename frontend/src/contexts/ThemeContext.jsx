/*
 * Stratify 2026 - Advanced 3D Project Management System
 * Copyright (c) 2026 Stratify. All rights reserved.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      // Dark theme colors (darker tones of the same palette family)
      root.style.setProperty('--color-background', '#1a1a1a');
      root.style.setProperty('--color-card', '#2d2d2d');
      root.style.setProperty('--color-primary', '#FFD77A');
      root.style.setProperty('--color-highlight', '#E6A520');
      root.style.setProperty('--color-accent', '#7A4A00');
      root.style.setProperty('--color-text-primary', '#ffffff');
      root.style.setProperty('--color-text-secondary', '#d1d5db');
      root.style.setProperty('--color-text-muted', '#9ca3af');
      root.style.setProperty('--color-border', '#404040');
      root.style.setProperty('--color-border-light', '#525252');
    } else {
      // Light theme colors (original palette)
      root.style.setProperty('--color-background', '#FFF8E7');
      root.style.setProperty('--color-card', '#FFFFFF');
      root.style.setProperty('--color-primary', '#E6A520');
      root.style.setProperty('--color-highlight', '#FFD77A');
      root.style.setProperty('--color-accent', '#7A4A00');
      root.style.setProperty('--color-text-primary', '#1f2937');
      root.style.setProperty('--color-text-secondary', '#4b5563');
      root.style.setProperty('--color-text-muted', '#6b7280');
      root.style.setProperty('--color-border', '#e5e7eb');
      root.style.setProperty('--color-border-light', '#f3f4f6');
    }

    // Update body class for additional styling
    document.body.className = document.body.className.replace(/theme-\w+/, '');
    document.body.classList.add(`theme-${newTheme}`);
  };

  const toggleTheme = () => {
    setIsTransitioning(true);
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Reset transition state after animation
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const setSpecificTheme = (newTheme) => {
    if (newTheme !== theme) {
      setIsTransitioning(true);
      setTheme(newTheme);
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const getThemeColors = () => {
    if (theme === 'dark') {
      return {
        background: '#1a1a1a',
        card: '#2d2d2d',
        primary: '#FFD77A',
        highlight: '#E6A520',
        accent: '#7A4A00',
        textPrimary: '#ffffff',
        textSecondary: '#d1d5db',
        textMuted: '#9ca3af',
        border: '#404040',
        borderLight: '#525252'
      };
    } else {
      return {
        background: '#FFF8E7',
        card: '#FFFFFF',
        primary: '#E6A520',
        highlight: '#FFD77A',
        accent: '#7A4A00',
        textPrimary: '#1f2937',
        textSecondary: '#4b5563',
        textMuted: '#6b7280',
        border: '#e5e7eb',
        borderLight: '#f3f4f6'
      };
    }
  };

  const value = {
    theme,
    toggleTheme,
    setTheme: setSpecificTheme,
    isTransitioning,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    colors: getThemeColors()
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={`theme-transition ${isTransitioning ? 'transitioning' : ''}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};