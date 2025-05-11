import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DisplayNft } from './types';

interface NftDetailModalProps {
  nft: DisplayNft | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function NftDetailModal({ nft, isOpen, onClose }: NftDetailModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!nft) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6"
            onClick={onClose}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-[#1a2327] rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Section */}
              <div className="w-full md:w-1/2 bg-gradient-to-br from-[#e6f0ed] to-[#b8c6c9] dark:from-[#232b2f] dark:to-[#2a353a] relative">
                <div className="aspect-square relative">
                  <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image';
                    }}
                  />
                  
                  {/* Ribbon */}
                  <div className="absolute top-4 right-4">
                    <motion.div 
                      className="bg-[#6ad7b7]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Solana NFT
                    </motion.div>
                  </div>
                </div>
              </div>
              
              {/* Info Section */}
              <div className="w-full md:w-1/2 p-6 flex flex-col h-full overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-[#2a353a] dark:text-white">{nft.name}</h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-[#5e6e6a] dark:text-[#b8c6c9] hover:text-[#2a353a] dark:hover:text-white transition-colors"
                    onClick={onClose}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.button>
                </div>
                
                <div className="mb-4 overflow-auto flex-grow custom-scrollbar">
                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-md font-semibold text-[#2a353a] dark:text-white mb-2">Description</h3>
                    <p className="text-sm text-[#5e6e6a] dark:text-[#b8c6c9]">
                      {nft.description || "No description available for this NFT."}
                    </p>
                  </div>
                  
                  {/* Token Info */}
                  <div className="mb-6">
                    <h3 className="text-md font-semibold text-[#2a353a] dark:text-white mb-2">Token Information</h3>
                    <div className="bg-[#e6f0ed]/50 dark:bg-[#232b2f]/50 rounded-lg p-3">
                      <p className="text-sm text-[#5e6e6a] dark:text-[#b8c6c9] mb-1">
                        <span className="font-semibold">Mint Address:</span>
                      </p>
                      <p className="text-sm font-mono bg-[#e6f0ed] dark:bg-[#232b2f] p-2 rounded overflow-x-auto whitespace-nowrap">
                        {nft.mint}
                      </p>
                    </div>
                  </div>
                  
                  {/* Attributes */}
                  {nft.attributes && nft.attributes.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-md font-semibold text-[#2a353a] dark:text-white mb-2">Attributes</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {nft.attributes.map((attr, index) => (
                          <motion.div 
                            key={index} 
                            className="bg-gradient-to-br from-[#e6f0ed]/80 to-[#e6f0ed]/30 dark:from-[#232b2f]/80 dark:to-[#232b2f]/30 backdrop-blur-sm rounded-lg p-3 text-sm border border-white/20 dark:border-[#232b2f]/50"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            whileHover={{ scale: 1.03 }}
                          >
                            <span className="font-semibold text-[#2a353a] dark:text-white block">{attr.trait_type}</span>
                            <span className="text-[#5e6e6a] dark:text-[#b8c6c9]">{attr.value}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="mt-auto pt-4 border-t border-[#e6f0ed] dark:border-[#232b2f] flex flex-wrap gap-3">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={`https://solscan.io/token/${nft.mint}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#6ad7b7] to-[#4bbd9b] hover:from-[#4bbd9b] hover:to-[#3aa38a] text-white text-sm font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 3h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    View on Solscan
                  </motion.a>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-2 p-3 bg-[#e6f0ed]/80 dark:bg-[#232b2f]/80 backdrop-blur-sm rounded-lg text-[#5e6e6a] dark:text-[#b8c6c9] hover:bg-[#e6f0ed] dark:hover:bg-[#232b2f] transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-2 p-3 bg-[#e6f0ed]/80 dark:bg-[#232b2f]/80 backdrop-blur-sm rounded-lg text-[#5e6e6a] dark:text-[#b8c6c9] hover:bg-[#e6f0ed] dark:hover:bg-[#232b2f] transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 6l-4-4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
