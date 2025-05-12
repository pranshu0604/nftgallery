import React, { useState } from 'react';
import type { DisplayNft } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import NftDetailModal from './NftDetailModal';
import NftLoading from './NftLoading';

export function log(...args: any[]) {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('[NFT-GALLERY]', ...args);
  }
}

export function NftCard({ nft, onClick }: { nft: DisplayNft; onClick: () => void }) {
  log('Rendering NFT Card', nft);
  const [isHovered, setIsHovered] = useState(false);
  const [rotateXY, setRotateXY] = useState({ x: 0, y: 0 });

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

    setRotateXY({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotateXY({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleCardClick = () => {
    onClick();
  };

  return (
    <motion.div
      className="relative group cursor-pointer perspective-1000"
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `rotateX(${rotateXY.x}deg) rotateY(${rotateXY.y}deg)`,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Glass card effect */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-dark-background/90 backdrop-blur-lg border border-light-border dark:border-dark-border shadow-lg"
        animate={{
          boxShadow: isHovered
            ? '0 20px 40px rgba(0,0,0,0.1), 0 5px 15px rgba(106, 215, 183, 0.2)'
            : '0 4px 20px rgba(0,0,0,0.05)',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-light-accent/30 to-light-accentHover/10 dark:from-dark-accent/20 dark:to-dark-accentHover/5 opacity-0 z-10"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* NFT Image */}
          <motion.img
            src={nft.imageUrl}
            alt={nft.name}
            className="w-full h-full object-cover"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{
              scale: isHovered ? 1.05 : 1,
              rotateZ: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.4 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/300x400?text=No+Image';
            }}
          />
          
          {/* Hover overlay with NFT info */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-light-background/95 dark:from-dark-background/95 to-transparent opacity-0 flex flex-col justify-end p-4 z-20"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h3 
              className="text-lg font-bold text-light-text dark:text-dark-text mb-1"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {nft.name}
            </motion.h3>
            
            {nft.attributes && nft.attributes.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {nft.attributes.slice(0, 3).map((attr, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 rounded-full bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent text-xs font-medium"
                  >
                    {attr.trait_type}: {attr.value}
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
        
        {/* Card footer */}
        <div className="p-4 border-t border-light-border dark:border-dark-border">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text truncate">
            {nft.name}
          </h3>
          <p className="text-sm text-light-subtext dark:text-dark-subtext line-clamp-2 h-10">
            {nft.description || 'No description available'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function NftGrid({ nfts, isLoading, error }: { nfts: DisplayNft[]; isLoading: boolean; error: string | null; }) {
  const [selectedNft, setSelectedNft] = useState<DisplayNft | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle NFT selection for modal
  const handleNftSelect = (nft: DisplayNft) => {
    setSelectedNft(nft);
    setIsModalOpen(true);
  };

  if (error) {
    return (
      <motion.div
        className="w-full p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start">
          <div className="text-red-500 dark:text-red-400 mr-3 flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">Error Loading NFTs</h3>
            <p className="text-red-600 dark:text-red-300 whitespace-pre-wrap">{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <NftLoading key={i} />
        ))}
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <motion.div
        className="w-full text-center p-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-block p-4 rounded-full bg-light-accent/10 dark:bg-dark-accent/20 mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 15H15M9 15H9.01M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z" 
              stroke="currentColor" className="text-light-accent dark:text-dark-accent" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-light-text dark:text-dark-text mb-3">No NFTs Found</h3>
        <p className="text-light-subtext dark:text-dark-subtext">
          Connect your wallet or enter a Solana address to view NFTs
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {nfts.map((nft, index) => (
            <motion.div
              key={nft.mint}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <NftCard nft={nft} onClick={() => handleNftSelect(nft)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <NftDetailModal 
        nft={selectedNft} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
