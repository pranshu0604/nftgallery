import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  message?: string;
  subMessage?: string;
}

export default function Loader({ 
  message = "Loading your NFT experience", 
  subMessage 
}: LoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#121a1d]">
      <div className="relative flex flex-col items-center">
        {/* Background gradients */}
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[#6ad7b7]/30 to-transparent blur-3xl pulse-glow"></div>
        <div className="absolute bottom-[-80px] right-[-80px] w-[250px] h-[250px] rounded-full bg-gradient-to-br from-[#81a4f8]/20 to-transparent blur-3xl pulse-glow" style={{ animationDelay: "0.5s" }}></div>
        <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-gradient-to-br from-[#f1c3f1]/10 to-transparent blur-3xl pulse-glow" style={{ animationDelay: "1s" }}></div>
        
        {/* Logo animation */}
        <motion.div 
          className="flex items-center justify-center mb-8 perspective"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated cube representing Solana NFT */}
          <motion.div
            className="w-20 h-20 relative transform-gpu"
            animate={{ 
              rotateY: [0, 180, 360],
              rotateX: [0, 180, 0],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4, 
              ease: "easeInOut" 
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Cube faces */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6ad7b7] to-[#4bbd9b] rounded-md shadow-lg" style={{ transform: 'translateZ(10px)' }}>
              <div className="flex items-center justify-center h-full">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
                  <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#6ad7b7] to-[#4bbd9b] rounded-md shadow-lg" style={{ transform: 'translateZ(-10px) rotateY(180deg)' }}>
              <div className="flex items-center justify-center h-full">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#6ad7b7] to-[#4bbd9b] rounded-md shadow-lg" style={{ transform: 'rotateY(-90deg) translateZ(10px)' }}>
              <div className="flex items-center justify-center h-full">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 17L17 14.5V7L12 9.5L7 7V14.5L12 17Z" fill="white" stroke="white" strokeWidth="1" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#6ad7b7] to-[#4bbd9b] rounded-md shadow-lg" style={{ transform: 'rotateY(90deg) translateZ(10px)' }}>
              <div className="flex items-center justify-center h-full">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12L12 22M12 22L7 17M12 22L17 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#6ad7b7] to-[#4bbd9b] rounded-md shadow-lg" style={{ transform: 'rotateX(90deg) translateZ(10px)' }}>
              <div className="flex items-center justify-center h-full">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#6ad7b7] to-[#4bbd9b] rounded-md shadow-lg" style={{ transform: 'rotateX(-90deg) translateZ(10px)' }}>
              <div className="flex items-center justify-center h-full">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="7" y="7" width="10" height="10" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Text animation */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2a353a] to-[#4a5a63] dark:from-white dark:to-[#b8c6c9]">Solana</span>
            <span className="text-[#6ad7b7] ml-2">Gallery</span>
          </h2>
          
          {/* Loading indicator */}
          <div className="flex flex-col justify-center items-center mt-4">
            <div className="flex space-x-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#6ad7b7]"
                  initial={{ opacity: 0.3, y: 0 }}
                  animate={{ opacity: [0.3, 1, 0.3], y: [-1, -5, -1] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            
            {/* Progress bar */}
            <motion.div 
              className="w-48 h-1 bg-[#e6f0ed]/30 dark:bg-[#232b2f]/30 rounded-full mt-4 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-[#6ad7b7] to-[#4bbd9b] rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ 
                  duration: 3,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            </motion.div>
          </div>
          
          {/* Loading text with shimmer effect */}
          <div className="mt-3 text-sm text-[#5e6e6a] dark:text-[#b8c6c9] relative overflow-hidden">
            <p className="text-center">{message}</p>
            {subMessage && (
              <p className="text-center text-xs mt-1 text-[#6ad7b7]/70">{subMessage}</p>
            )}
            <motion.div 
              className="absolute inset-0 shimmer-effect"
              animate={{ x: ["0%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
