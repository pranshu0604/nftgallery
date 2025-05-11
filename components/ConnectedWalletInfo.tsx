import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ConnectedWalletInfo({
  publicKey,
  targetAddress,
  isLoading,
  setTargetAddress,
  setManualAddressInput,
  setAddressError
}: {
  publicKey: any;
  targetAddress: string | null;
  isLoading: boolean;
  setTargetAddress: (v: string) => void;
  setManualAddressInput: (v: string) => void;
  setAddressError: (v: string | null) => void;
}) {
  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative">
        {/* Animated background gradient */}
        <motion.div 
          className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#6ad7b7]/20 via-[#b8c6c9]/10 to-[#6ad7b7]/20 z-0 opacity-60 dark:opacity-30 blur-md"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            repeatType: 'mirror',
            ease: 'linear'
          }}
        />
        
        <div className="relative z-10 p-6 rounded-2xl bg-white/90 dark:bg-[#1a2327]/90 backdrop-blur-md border border-white/50 dark:border-[#232b2f]/50 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            {/* Connected Badge and Address */}
            <div className="text-center sm:text-left">
              <div className="flex items-center mb-3 justify-center sm:justify-start">
                <div className="bg-[#6ad7b7]/10 dark:bg-[#6ad7b7]/20 p-2 rounded-full mr-3">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 0.95, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                        stroke="#6ad7b7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 12L11 15L16 10" 
                        stroke="#6ad7b7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#2a353a] dark:text-white">Connected Wallet</h3>
                  <p className="text-xs text-[#5e6e6a] dark:text-[#b8c6c9]">View your NFT collection</p>
                </div>
              </div>
              
              <div className="flex items-center bg-gradient-to-br from-[#f5fcfa] to-[#e6f5f0] dark:from-[#232b2f] dark:to-[#1a2327] rounded-xl p-1 border border-[#e6f0ed]/50 dark:border-[#2a353a]/50 overflow-hidden group">
                <div className="bg-white/80 dark:bg-[#1e2a30]/80 backdrop-blur-sm rounded-lg px-4 py-2 w-full truncate flex items-center">
                  <p className="font-mono text-sm text-[#5e6e6a] dark:text-[#b8c6c9] truncate">
                    {publicKey?.toBase58() || targetAddress || ''}
                  </p>
                  <motion.button
                    className="ml-2 flex-shrink-0 text-[#6ad7b7] p-1 rounded-full hover:bg-[#6ad7b7]/10 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      navigator.clipboard.writeText(publicKey?.toBase58() || targetAddress || '');
                      // Could add toast notification here
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
            </div>
            
            {/* Action Button */}
            {publicKey && targetAddress !== publicKey.toBase58() ? (
              <motion.button
                onClick={() => {
                  if (publicKey) {
                    setTargetAddress(publicKey.toBase58());
                    setManualAddressInput('');
                    setAddressError(null);
                  }
                }}
                className="bg-gradient-to-r from-[#6ad7b7] to-[#4bbd9b] hover:from-[#4bbd9b] hover:to-[#3aa38a] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg flex items-center relative overflow-hidden group min-w-[160px] justify-center"
                disabled={isLoading || (publicKey && targetAddress === publicKey.toBase58())}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear", repeatDelay: 0.5 }}
                />
                
                {isLoading && publicKey && targetAddress === publicKey.toBase58() ? (
                  <div className="flex items-center gap-2 relative z-10">
                    <motion.span 
                      className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 relative z-10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 19H20M4 19L8 15M4 19L8 23M20 5H4M20 5L16 1M20 5L16 9" 
                        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Show My NFTs</span>
                  </div>
                )}
              </motion.button>
            ) : (
              <motion.div
                className="py-3 px-6 rounded-xl flex items-center gap-2 bg-gradient-to-br from-[#6ad7b7]/20 to-[#4bbd9b]/10 backdrop-blur-sm text-[#4bbd9b] dark:text-[#6ad7b7] font-medium border border-[#6ad7b7]/30"
                animate={{ 
                  boxShadow: ["0 0 0 rgba(106, 215, 183, 0)", "0 0 16px rgba(106, 215, 183, 0.3)", "0 0 0 rgba(106, 215, 183, 0)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572M22 4L12 14.01L9 11.01" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.span>
                <span>Currently Viewing</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
