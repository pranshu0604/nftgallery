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
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotateXY, setRotateXY] = useState({ x: 0, y: 0 });
  
  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFlipped) {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;
      
      setRotateXY({ x: rotateX, y: rotateY });
    }
  };
  
  const handleMouseLeave = () => {
    setRotateXY({ x: 0, y: 0 });
    setIsHovered(false);
  };
  
  const handleCardClick = () => {
    if (isFlipped) {
      setIsFlipped(false);
    } else {
      onClick();
    }
  };
  
  return (
    <motion.div
      key={nft.mint}
      className="rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-white to-[#f9fcfb] dark:from-[#2a353a] dark:to-[#1e2a30] hover:shadow-2xl flex flex-col transform-gpu perspective h-[420px]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -8,
        boxShadow: "0 20px 35px rgba(0, 0, 0, 0.2)"
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <AnimatePresence initial={false}>
        <motion.div 
          className="relative w-full h-full"
          animate={{ 
            rotateY: isFlipped ? 180 : rotateXY.y,
            rotateX: !isFlipped ? rotateXY.x : 0
          }}
          transition={{ 
            duration: isFlipped ? 0.6 : 0.2, 
            type: isFlipped ? "spring" : "tween", 
            stiffness: 50 
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Glow effect for hover state */}
          <motion.div 
            className="absolute -inset-1 bg-gradient-to-r from-[#6ad7b7] to-[#81e4c4] rounded-2xl blur-lg z-[-1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.5 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* FRONT CARD */}
          <motion.div 
            className="absolute inset-0 backface-hidden flex flex-col border border-white/20 dark:border-[#232b2f]/50 rounded-2xl overflow-hidden"
            style={{ 
              transformStyle: "preserve-3d",
              transform: "translateZ(0px)",
              backfaceVisibility: "hidden"
            }}
          >
            <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-[#e6f0ed] to-[#b8c6c9] dark:from-[#232b2f] dark:to-[#2a353a]">
              {/* Main NFT image */}
              <motion.img
                src={nft.imageUrl}
                alt={nft.name}
                className="w-full h-full object-cover"
                style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  log('Image error for', nft.mint, nft.imageUrl);
                  (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image';
                }}
              />
              
              {/* Overlay with hover effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 flex items-center justify-center backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-white text-center px-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ 
                    transformStyle: "preserve-3d", 
                    transform: "translateZ(40px)" 
                  }}
                >
                  <p className="font-bold text-lg mb-2">View Details</p>
                  <div className="flex justify-center">
                    <motion.div 
                      className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      Explore NFT
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
            
            <div className="flex flex-col flex-grow p-6 bg-white/95 dark:bg-[#2a353a]/95 backdrop-blur-md">
              <div className="flex justify-between items-center mb-3">
                <h3 
                  className="text-lg font-bold text-[#2a353a] dark:text-white truncate" 
                  title={nft.name}
                  style={{ 
                    transformStyle: "preserve-3d", 
                    transform: "translateZ(10px)" 
                  }}
                >
                  {nft.name}
                </h3>
                <motion.div 
                  className="bg-[#6ad7b7]/10 p-1.5 rounded-full text-[#6ad7b7]"
                  whileHover={{ scale: 1.2, rotate: 180 }}
                  style={{ 
                    transformStyle: "preserve-3d", 
                    transform: "translateZ(15px)" 
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                      fill="#6ad7b7" stroke="#6ad7b7" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </div>
              
              {nft.description && (
                <motion.p 
                  className="text-sm text-[#5e6e6a] dark:text-[#b8c6c9] mb-3 line-clamp-2" 
                  title={nft.description}
                  style={{ 
                    transformStyle: "preserve-3d", 
                    transform: "translateZ(5px)" 
                  }}
                >
                  {nft.description}
                </motion.p>
              )}
              
              <div className="mt-auto">
                <div className="flex justify-between items-center pt-3 border-t border-[#e6f0ed] dark:border-[#232b2f]">
                  <a
                    href={`https://solscan.io/token/${nft.mint}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs bg-gradient-to-r from-[#6ad7b7] to-[#4bbd9b] bg-clip-text text-transparent font-bold hover:opacity-80 transition-opacity"
                    style={{ 
                      transformStyle: "preserve-3d", 
                      transform: "translateZ(10px)" 
                    }}
                  >
                    View on Solscan
                  </a>
                  <span className="text-xs text-[#5e6e6a] dark:text-[#b8c6c9] font-mono">
                    {nft.mint.substring(0, 4)}...{nft.mint.substring(nft.mint.length - 4)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* BACK CARD */}
          <motion.div 
            className="absolute inset-0 backface-hidden flex flex-col p-6 bg-gradient-to-br from-white/95 to-[#f9fcfb]/95 dark:from-[#2a353a]/95 dark:to-[#1e2a30]/95 backdrop-blur-md rounded-2xl border border-white/20 dark:border-[#232b2f]/50 overflow-hidden"
            style={{ 
              transform: "rotateY(180deg)", 
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden"
            }}
          >
            {/* Background pattern for the back of card */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjAyIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTRtMC0xNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNG0tMTQtMTRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTRtMTQgMTRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTRNMTAgMjBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTRtMTQgMTRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTRtLTE0IDE0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00bTE0LTE0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00bS0xNCAxNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNE0xMCAyMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNG0xNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNE0xMCAzNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNCIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <h3 
                className="text-lg font-bold bg-gradient-to-r from-[#2a353a] to-[#4a5a63] dark:from-white dark:to-[#b8c6c9] bg-clip-text text-transparent truncate"
                style={{ 
                  transformStyle: "preserve-3d", 
                  transform: "translateZ(15px)" 
                }}
              >
                {nft.name}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-[#6ad7b7]/10 p-1.5 rounded-full text-[#6ad7b7] hover:bg-[#6ad7b7]/20 transition-colors"
                style={{ 
                  transformStyle: "preserve-3d", 
                  transform: "translateZ(15px)" 
                }}
                onClick={() => setIsFlipped(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#6ad7b7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            </div>
            
            <div 
              className="mb-4 overflow-auto flex-grow"
              style={{ 
                transformStyle: "preserve-3d", 
                transform: "translateZ(5px)" 
              }}
            >
              <p className="text-sm font-semibold text-[#2a353a] dark:text-white mb-2">About this NFT:</p>
              <p className="text-xs text-[#5e6e6a] dark:text-[#b8c6c9] mb-4 max-h-24 overflow-y-auto">
                {nft.description || "No description available for this NFT."}
              </p>
              
              {nft.attributes && nft.attributes.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-[#2a353a] dark:text-white mb-2">Attributes:</p>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                    {nft.attributes.map((attr: { trait_type: string; value: string }, index: number) => (
                      <motion.div 
                        key={index} 
                        className="bg-gradient-to-br from-[#e6f0ed]/80 to-[#e6f0ed]/30 dark:from-[#232b2f]/80 dark:to-[#232b2f]/30 backdrop-blur-sm rounded-lg p-2 text-xs border border-white/20 dark:border-[#232b2f]/50"
                        whileHover={{ scale: 1.05 }}
                        style={{ 
                          transformStyle: "preserve-3d", 
                          transform: "translateZ(10px)" 
                        }}
                      >
                        <span className="font-semibold text-[#2a353a] dark:text-white block">{attr.trait_type}:</span>
                        <span className="text-[#5e6e6a] dark:text-[#b8c6c9]">{attr.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div 
              className="mt-auto pt-3 border-t border-[#e6f0ed] dark:border-[#232b2f] flex justify-between"
              style={{ 
                transformStyle: "preserve-3d", 
                transform: "translateZ(10px)" 
              }}
            >
              <a
                href={`https://solscan.io/token/${nft.mint}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 bg-gradient-to-r from-[#6ad7b7] to-[#4bbd9b] hover:from-[#4bbd9b] hover:to-[#3aa38a] text-white text-sm font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                View on Solscan
              </a>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-[#e6f0ed]/80 dark:bg-[#232b2f]/80 backdrop-blur-sm rounded-lg text-[#5e6e6a] dark:text-[#b8c6c9] hover:bg-[#e6f0ed] dark:hover:bg-[#232b2f] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export function NftGrid({ nfts, isLoading, error }: { nfts: DisplayNft[]; isLoading: boolean; error?: string | null }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNft, setSelectedNft] = useState<DisplayNft | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nftsPerPage = 8;
  
  // Calculate pagination
  const totalPages = Math.ceil(nfts.length / nftsPerPage);
  const indexOfLastNft = currentPage * nftsPerPage;
  const indexOfFirstNft = indexOfLastNft - nftsPerPage;
  const currentNfts = nfts.slice(indexOfFirstNft, indexOfLastNft);
  
  // Generate page numbers
  const pageNumbers: (number)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  // Determine displayed page numbers
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return pageNumbers;
    }
    
    if (currentPage <= 3) {
      return [...pageNumbers.slice(0, 5), '...' as const, totalPages];
    }
    
    if (currentPage >= totalPages - 2) {
      return [1, '...' as const, ...pageNumbers.slice(totalPages - 5)];
    }
    
    return [1, '...' as const, currentPage - 1, currentPage, currentPage + 1, '...' as const, totalPages];
  };
  
  const handleNftClick = (nft: DisplayNft) => {
    setSelectedNft(nft);
    setIsModalOpen(true);
  };
  
  const renderSkeletonLoader = () => {
    return Array(4).fill(0).map((_, i) => (
      <div key={`skeleton-${i}`} className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#e6f0ed]/50 to-[#b8c6c9]/50 dark:from-[#232b2f]/50 dark:to-[#1e2a30]/50 animate-pulse h-[420px]">
        <div className="w-full h-64 bg-[#e6f0ed]/80 dark:bg-[#232b2f]/80"></div>
        <div className="p-6 space-y-4">
          <div className="h-6 bg-[#e6f0ed] dark:bg-[#232b2f] rounded-md w-3/4"></div>
          <div className="h-4 bg-[#e6f0ed] dark:bg-[#232b2f] rounded-md w-full"></div>
          <div className="h-4 bg-[#e6f0ed] dark:bg-[#232b2f] rounded-md w-5/6"></div>
          <div className="h-10 mt-6 pt-4 flex justify-between items-center border-t border-[#e6f0ed]/30 dark:border-[#232b2f]/30">
            <div className="h-4 bg-[#e6f0ed] dark:bg-[#232b2f] rounded-md w-1/3"></div>
            <div className="h-4 bg-[#e6f0ed] dark:bg-[#232b2f] rounded-md w-1/4"></div>
          </div>
        </div>
      </div>
    ));
  };
  
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="w-full flex justify-center mt-8">
        <nav className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1 
                ? 'text-[#b8c6c9] dark:text-[#5e6e6a] cursor-not-allowed' 
                : 'text-[#2a353a] dark:text-white hover:bg-[#e6f0ed] dark:hover:bg-[#232b2f]'
            } transition-colors`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-4 py-2 text-[#5e6e6a] dark:text-[#b8c6c9]">...</span>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(Number(page))}
                  className={`w-10 h-10 rounded-lg ${
                    currentPage === page 
                      ? 'bg-[#6ad7b7] text-white font-bold shadow-lg' 
                      : 'text-[#2a353a] dark:text-white hover:bg-[#e6f0ed] dark:hover:bg-[#232b2f]'
                  } transition-colors`}
                >
                  {page}
                </motion.button>
              )}
            </React.Fragment>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${
              currentPage === totalPages 
                ? 'text-[#b8c6c9] dark:text-[#5e6e6a] cursor-not-allowed' 
                : 'text-[#2a353a] dark:text-white hover:bg-[#e6f0ed] dark:hover:bg-[#232b2f]'
            } transition-colors`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </nav>
      </div>
    );
  };
  
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-500 dark:text-red-300 text-center"
      >
        <h3 className="text-lg font-bold mb-2">Error loading NFTs</h3>
        <p className="text-sm whitespace-pre-wrap">{error}</p>
      </motion.div>
    );
  }
  
  if (isLoading) {
    return <NftLoading />;
  }
  
  if (!nfts.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 rounded-xl bg-gradient-to-br from-[#e6f0ed]/50 to-[#d1e6e0]/50 dark:from-[#232b2f]/50 dark:to-[#1e2a30]/50 border border-[#e6f0ed] dark:border-[#232b2f]/50 text-center"
      >
        <div className="mb-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto opacity-50">
            <path d="M19 16v3M14 16v6M9 16v4M4 16v7M4 12V3m0 5h16v8H4V8z" stroke="#6ad7b7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#2a353a] dark:text-white mb-2">No NFTs Found</h3>
        <p className="text-[#5e6e6a] dark:text-[#b8c6c9]">This wallet doesn't have any NFTs or they haven't been indexed yet.</p>
      </motion.div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentNfts.map(nft => (
          <NftCard 
            key={nft.mint} 
            nft={nft}
            onClick={() => handleNftClick(nft)}
          />
        ))}
      </div>
      
      {/* Pagination */}
      {renderPagination()}
      
      {/* NFT Detail Modal */}
      <NftDetailModal 
        nft={selectedNft} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
