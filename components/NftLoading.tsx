import React from 'react';
import { motion } from 'framer-motion';

export default function NftLoading() {
  return (
    <div className="min-h-[400px] w-full">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="relative bg-[#f4f7f6] dark:bg-[#1e2a30] rounded-xl overflow-hidden shadow-md h-[320px] w-full perspective"
          >
            <motion.div 
              className="h-3/4 bg-gradient-to-br from-[#e6f0ed]/50 to-[#d1e6e0]/50 dark:from-[#232b2f]/80 dark:to-[#1e2a30]/80"
              animate={{ 
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
            <div className="p-4 space-y-2">
              <div className="h-5 bg-[#e6f0ed] dark:bg-[#232b2f] rounded-md w-2/3">
                <motion.div 
                  className="h-full w-full shimmer-effect"
                />
              </div>
              <div className="h-4 bg-[#e6f0ed] dark:bg-[#232b2f] rounded-md w-1/2">
                <motion.div 
                  className="h-full w-full shimmer-effect"
                />
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
