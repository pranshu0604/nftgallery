'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Initialize theme based on system preference or saved preference
  useEffect(() => {
    // Check if there's a saved preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      // Use system preference as default
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);
  
  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };
  
  return (
    <motion.button
      className="relative h-10 w-20 rounded-full bg-gradient-to-br from-[#f5fcfa] to-[#e6f5f0] dark:from-[#232b2f] dark:to-[#1a2327] p-1 shadow-inner overflow-hidden border border-[#e6f0ed]/50 dark:border-[#232b2f]/70"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Track background with stars and sun rays */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars (only visible in dark mode) */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${15 + Math.random() * 70}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isDarkMode ? [0, 1, 0] : 0,
              scale: isDarkMode ? [0.8, 1.2, 0.8] : 1 
            }}
            transition={{ 
              duration: 1 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
        
        {/* Sun rays (only visible in light mode) */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-[#f9d71c]/50 blur-sm"
            style={{
              width: '30px',
              height: '2px',
              top: '50%',
              left: '25%',
              transformOrigin: '0 50%',
              transform: `rotate(${i * 45}deg)`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: !isDarkMode ? 0.7 : 0,
              scale: !isDarkMode ? 1 : 0 
            }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </div>
      
      {/* Toggle slider */}
      <motion.div
        className="h-8 w-8 rounded-full flex items-center justify-center relative z-10"
        animate={{ 
          x: isDarkMode ? 40 : 0,
          backgroundColor: isDarkMode ? '#1a2327' : '#f9d71c',
          boxShadow: isDarkMode 
            ? '0 0 10px 2px rgba(255, 255, 255, 0.2) inset, 0 0 0 2px rgba(255, 255, 255, 0.1)' 
            : '0 0 15px 2px rgba(249, 215, 28, 0.5), 0 0 0 2px rgba(249, 215, 28, 0.2)'
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {/* Sun */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#f9d71c] flex items-center justify-center"
          animate={{ 
            opacity: isDarkMode ? 0 : 1,
            scale: isDarkMode ? 0 : 1
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-1 h-1 bg-[#f5fcfa]/30 rounded-full absolute top-1.5 left-1.5"></div>
          <div className="w-1 h-1 bg-[#f5fcfa]/30 rounded-full absolute top-1.5 right-1.5"></div>
        </motion.div>
        
        {/* Moon */}
        <motion.div 
          className="absolute rounded-full"
          animate={{ 
            opacity: isDarkMode ? 1 : 0,
            scale: isDarkMode ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-6 h-6 rounded-full bg-[#e6f0ed] overflow-hidden">
            <div className="absolute w-4 h-4 rounded-full bg-[#1a2327] -right-1 top-1"></div>
          </div>
        </motion.div>
      </motion.div>
    </motion.button>
  );
}
