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
              className="relative w-full max-w-4xl bg-white dark:bg-dark-background rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-light-background/80 dark:bg-dark-background/80 backdrop-blur-sm text-light-subtext dark:text-dark-subtext hover:text-light-accent dark:hover:text-dark-accent transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image Section */}
                <div className="relative aspect-square md:aspect-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-light-accent/20 to-light-accentHover/5 dark:from-dark-accent/10 dark:to-dark-accentHover/5 mix-blend-overlay"/>
                  <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/800x800?text=No+Image';
                    }}
                  />
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8 overflow-y-auto max-h-[80vh] md:max-h-[600px]">
                  <h2 className="text-2xl md:text-3xl font-bold text-light-text dark:text-dark-text mb-4">
                    {nft.name}
                  </h2>

                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-sm font-medium text-light-subtext dark:text-dark-subtext mb-2">Description</h3>
                      <p className="text-light-text dark:text-dark-text whitespace-pre-wrap">
                        {nft.description || 'No description available'}
                      </p>
                    </div>

                    {/* Properties */}
                    {nft.attributes && nft.attributes.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-light-subtext dark:text-dark-subtext mb-3">Properties</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {nft.attributes.map((attr, index) => (
                            <div
                              key={index}
                              className="p-3 rounded-lg bg-light-accent/10 dark:bg-dark-accent/10 border border-light-border dark:border-dark-border"
                            >
                              <p className="text-sm text-light-subtext dark:text-dark-subtext mb-1">
                                {attr.trait_type}
                              </p>
                              <p className="font-medium text-light-text dark:text-dark-text truncate">
                                {attr.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Details */}
                    <div>
                      <h3 className="text-sm font-medium text-light-subtext dark:text-dark-subtext mb-3">Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-light-subtext dark:text-dark-subtext">Token Address</span>
                          <span className="text-light-text dark:text-dark-text font-mono">
                            {nft.mint.substring(0, 4)}...{nft.mint.substring(nft.mint.length - 4)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
