import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AddressInput({
  manualAddressInput,
  setManualAddressInput,
  addressError,
  isLoading,
  handleManualAddressSubmit,
  targetAddress,
  clearAddressError
}: {
  manualAddressInput: string;
  setManualAddressInput: (v: string) => void;
  addressError: string | null;
  isLoading: boolean;
  handleManualAddressSubmit: () => void;
  targetAddress: string | null;
  clearAddressError: () => void;
}) {
  console.log('[NFT-GALLERY] Rendering AddressInput', { manualAddressInput, addressError, isLoading, targetAddress });
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative overflow-hidden" 
        initial={{ borderRadius: 16 }}
        animate={{ 
          boxShadow: isFocused 
            ? '0 8px 32px rgba(106, 215, 183, 0.25), 0 2px 8px rgba(106, 215, 183, 0.2)' 
            : '0 4px 24px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.03)'
        }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-light-accent/30 to-light-accentHover/10 dark:from-dark-accent/20 dark:to-dark-accentHover/5 opacity-0"
          animate={{ 
            opacity: isFocused ? 1 : 0,
            rotate: isFocused ? 180 : 0,
            scale: isFocused ? 1.05 : 1
          }}
          transition={{ duration: 1.5 }}
        />
        
        <div className="relative p-6 md:p-8 bg-white/90 dark:bg-dark-background/90 backdrop-blur-lg rounded-2xl border border-light-border dark:border-dark-border">
          <motion.div 
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-light-accent via-light-accentHover to-light-accent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ 
              scaleX: isFocused ? 1 : 0, 
              opacity: isFocused ? 1 : 0 
            }}
            style={{ originX: 0 }}
            transition={{ duration: 0.8 }}
          />
          
          <div className="mb-6 flex items-start">
            <div className="bg-light-accent/10 dark:bg-dark-accent/20 rounded-full p-2.5 mr-4">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -5, 0],
                  scale: [1, 1.1, 0.95, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  repeatType: "loop",
                  ease: "easeInOut" 
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 9.5V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V16.5M20 9.5H13M20 9.5L16.5 6M20 16.5H13M20 16.5L16.5 20" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>
            <div>
              <motion.h2 
                className="text-2xl md:text-3xl font-extrabold text-light-text dark:text-dark-text mb-1 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Find NFT Collections
              </motion.h2>
              
              <motion.p 
                className="text-light-subtext dark:text-dark-subtext"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Enter any Solana wallet address to discover their digital treasures
              </motion.p>
            </div>
          </div>
          
          <div className="relative">
            <motion.div 
              className={`flex flex-col sm:flex-row gap-3 items-center justify-between p-1 rounded-xl ${
                isFocused ? 'bg-gradient-to-r from-light-accent via-light-accentHover to-light-accent' : 'bg-transparent border border-light-border dark:border-dark-border'
              }`}
              animate={{ 
                boxShadow: isFocused ? '0 4px 20px rgba(106, 215, 183, 0.25)' : 'none',
                y: isFocused ? -2 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative flex-grow flex items-center">
                <div className="absolute left-4 text-light-accent dark:text-dark-accent">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 17.2361C8 14.3832 9.79086 12 12 12C14.2091 12 16 14.3832 16 17.2361" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <input
                  type="text"
                  value={manualAddressInput}
                  onChange={(e) => {
                    setManualAddressInput(e.target.value);
                    clearAddressError();
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter Solana wallet address (e.g., 8iiJin...)"
                  className="flex-grow p-4 pl-12 rounded-lg bg-white dark:bg-dark-background text-light-text dark:text-dark-text focus:outline-none border-0 w-full placeholder:text-light-subtext/50 dark:placeholder:text-dark-subtext/50"
                />
              </div>
              <motion.button
                onClick={() => {
                  try {
                    handleManualAddressSubmit();
                  } catch (err) {
                    console.error('[NFT-GALLERY] 500 error in AddressInput handleManualAddressSubmit', err);
                    alert('500 error: Something went wrong. See console for details.');
                  }
                }}
                className="bg-gradient-to-r from-light-accent to-light-accentHover hover:from-light-accentHover hover:to-light-accent text-white font-bold py-3.5 px-6 rounded-lg shadow-lg w-full sm:w-auto min-w-[140px] overflow-hidden relative"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 500, damping: 17 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: isLoading ? '100%' : '-100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
                
                {isLoading && targetAddress === manualAddressInput.trim() ? (
                  <motion.div 
                    className="flex items-center justify-center gap-2"
                    animate={{ opacity: [0.6, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse" }}
                  >
                    <motion.span 
                      className="inline-block w-2 h-2 bg-white rounded-full"
                      animate={{ scale: [0.8, 1.2, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1, repeatType: "loop" }}
                    />
                    <span>Fetching...</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 12L13 5V9H4V15H13V19L21 12Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Explore NFTs</span>
                  </div>
                )}
              </motion.button>
            </motion.div>
            
            <AnimatePresence>
              {addressError && (
                <motion.div 
                  className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 backdrop-blur-sm"
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start">
                    <div className="text-red-500 dark:text-red-400 mr-3 flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-red-600 dark:text-red-300 text-sm font-medium">{addressError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {targetAddress && (
            <motion.div 
              className="mt-6 pt-4 border-t border-light-border dark:border-dark-border text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-light-subtext dark:text-dark-subtext flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-light-accent dark:bg-dark-accent mr-2 animate-pulse"></div>
                Currently viewing 
                <div className="px-3 py-1 bg-light-background dark:bg-dark-background rounded-full ml-2 flex items-center">
                  <span className="font-mono font-medium text-light-text dark:text-dark-text">
                    {targetAddress.substring(0, 6)}...{targetAddress.substring(targetAddress.length - 6)}
                  </span>
                  <motion.button
                    className="ml-2 text-light-accent dark:text-dark-accent p-1 rounded-full hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      navigator.clipboard.writeText(targetAddress);
                    }}
                    title="Copy address"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17M10 9H18C19.1046 9 20 8.10457 20 7V5C20 3.89543 19.1046 3 18 3H10C8.89543 3 8 3.89543 8 5V7C8 8.10457 8.89543 9 10 9Z" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
