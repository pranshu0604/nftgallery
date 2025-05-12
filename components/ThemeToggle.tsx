'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) return null;
  
  // Toggle theme function
  const isDark = resolvedTheme === 'dark';
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };
  
  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative overflow-hidden h-10 w-20 rounded-full p-1 transition-colors border ${
        isDark 
          ? 'bg-dark-background border-dark-border' 
          : 'bg-white border-light-border'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{ opacity: isDark ? 0 : 1 }}
      >
        {/* Light mode pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-light-accent" />
          <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 rounded-full bg-light-accent" />
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 rounded-full bg-light-accent" />
        </div>
      </motion.div>

      <motion.div
        className="relative z-10 w-8 h-8 rounded-full"
        animate={{
          x: isDark ? 40 : 0,
          backgroundColor: isDark ? '#232b2f' : '#6ad7b7',
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Sun/Moon Icon */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
          animate={{
            rotate: isDark ? 360 : 0,
            scale: isDark ? 0.8 : 1,
          }}
        >
          {isDark ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          )}
        </motion.svg>
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{ opacity: isDark ? 1 : 0 }}
      >
        {/* Dark mode stars */}
        <div className="absolute inset-0 opacity-70">
          <div className="absolute top-1/3 left-1/4 w-0.5 h-0.5 rounded-full bg-dark-accent" />
          <div className="absolute top-1/2 right-1/3 w-1 h-1 rounded-full bg-dark-accent" />
          <div className="absolute bottom-1/3 left-1/2 w-0.5 h-0.5 rounded-full bg-dark-accent" />
        </div>
      </motion.div>
    </motion.button>
  );
}
