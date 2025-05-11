'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { NftGrid, log } from '../components/NftGrid';
import { AddressInput } from '../components/AddressInput';
import { ConnectedWalletInfo } from '../components/ConnectedWalletInfo';
import ThemeToggle from '../components/ThemeToggle';
import { motion } from 'framer-motion';
import type { DisplayNft } from '../components/types';
import NftDetailModal from '../components/NftDetailModal';
import FilterSortControls from '../components/FilterSortControls';

export default function HomePage() {
  const { publicKey } = useWallet();
  const [isClient, setIsClient] = useState(false);
  const [nfts, setNfts] = useState<DisplayNft[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<DisplayNft[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualAddressInput, setManualAddressInput] = useState('');
  const [targetAddress, setTargetAddress] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [selectedNft, setSelectedNft] = useState<DisplayNft | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update targetAddress when wallet connects/disconnects
  useEffect(() => {
    if (publicKey) {
      setTargetAddress(publicKey.toBase58());
      setManualAddressInput('');
      setAddressError(null);
    } else {
      if (!manualAddressInput) {
        setTargetAddress(null);
      }
    }
  }, [publicKey]);

  // Fetch NFTs for any address
  const fetchNftsByAddress = async (address: string) => {
    if (!address) {
      setNfts([]);
      setFilteredNfts([]);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setAddressError(null);
    setNfts([]);
    setFilteredNfts([]);
    // Only use Shyft API
    const shyftApiKey = process.env.NEXT_PUBLIC_SHYFT_API_KEY;
    if (!shyftApiKey) {
      setError("Shyft API key is not configured. Please set NEXT_PUBLIC_SHYFT_API_KEY in your .env.local file.");
      setIsLoading(false);
      return;
    }
    try {
      log('Fetching NFTs for address (Shyft)', address);
      // Validate address
      try {
        new (await import('@solana/web3.js')).PublicKey(address);
      } catch (e) {
        log('Invalid Solana address format', address, e);
        setAddressError('Invalid Solana address format.');
        setIsLoading(false);
        return;
      }
      const shyftResp = await fetch(
        `https://api.shyft.to/sol/v1/nft/read_all?network=mainnet-beta&address=${address}`,
        {
          headers: {
            'x-api-key': shyftApiKey,
          },
        }
      );
      log('Shyft API response', shyftResp.status, shyftResp.statusText);
      if (!shyftResp.ok) {
        const shyftErr = await shyftResp.text();
        log('Shyft API error body', shyftErr);
        setError(`Shyft NFT API failed.\n${shyftErr}`);
        setNfts([]);
        setFilteredNfts([]);
        setIsLoading(false);
        return;
      }
      const shyftData = await shyftResp.json();
      log('Shyft API data', shyftData);
      if (!shyftData.result || shyftData.result.length === 0) {
        setNfts([]);
        setFilteredNfts([]);
        setIsLoading(false);
        return;
      }
      // Map Shyft NFT data to DisplayNft
      const fetchedNfts: DisplayNft[] = shyftData.result.map((nft: any) => ({
        mint: nft.mint,
        name: nft.name || 'Unnamed NFT',
        imageUrl: nft.image_uri || 'https://via.placeholder.com/300x400?text=No+Image',
        attributes: nft.attributes || [],
        description: nft.description || '',
      }));
      setNfts(fetchedNfts);
      setFilteredNfts(fetchedNfts);
    } catch (e) {
      log('Unexpected error in fetchNftsByAddress', e);
      let shyftErrorMsg = 'unknown error';
      if (e && typeof e === 'object' && 'message' in e) {
        shyftErrorMsg = (e as any).message;
      } else if (typeof e === 'string') {
        shyftErrorMsg = e;
      }
      setError(`Shyft NFT API failed.\n${shyftErrorMsg}`);
      setNfts([]);
      setFilteredNfts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch NFTs when targetAddress changes
  useEffect(() => {
    if (isClient && targetAddress) {
      fetchNftsByAddress(targetAddress);
    } else if (!targetAddress) {
      setNfts([]);
      setFilteredNfts([]);
      setError(null);
    }
  }, [targetAddress, isClient]);

  // Handle manual address submit
  const handleManualAddressSubmit = async () => {
    if (!manualAddressInput.trim()) {
      setAddressError("Please enter a Solana wallet address.");
      setTargetAddress(null);
      setNfts([]);
      setFilteredNfts([]);
      return;
    }
    try {
      // Use the same validation as in fetchNftsByAddress
      new (await import('@solana/web3.js')).PublicKey(manualAddressInput.trim());
      setTargetAddress(manualAddressInput.trim());
      setAddressError(null);
    } catch (e) {
      setAddressError("Invalid Solana address format.");
      setTargetAddress(null);
      setNfts([]);
      setFilteredNfts([]);
    }
  };

  const clearAddressError = () => {
    setAddressError(null);
  };
  
  // Handle NFT selection for modal
  const handleNftSelect = (nft: DisplayNft) => {
    setSelectedNft(nft);
    setIsModalOpen(true);
  };
  
  // Handle filtering and sorting of NFTs
  const handleFilterSort = (filteredAndSortedNfts: DisplayNft[]) => {
    setFilteredNfts(filteredAndSortedNfts);
  };

  // --- MAIN COMPONENT RENDER ---
  return (
    <main className="flex min-h-screen flex-col items-center bg-[url('/bg-pattern.svg')] bg-fixed bg-cover bg-center bg-opacity-50 bg-white dark:bg-[#121a1d] p-0 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
        <div className="absolute top-[5%] left-[10%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-[#6ad7b7]/30 to-transparent blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[35rem] h-[35rem] rounded-full bg-gradient-to-br from-[#81a4f8]/20 to-transparent blur-3xl"></div>
        <div className="absolute top-[30%] right-[15%] w-[25rem] h-[25rem] rounded-full bg-gradient-to-br from-[#f1c3f1]/10 to-transparent blur-3xl"></div>
      </div>
      
      {/* Header Bar with glass effect and theme toggle */}
      <header className="w-full backdrop-blur-md bg-white/70 dark:bg-[#1a2327]/80 border-b border-[#e6f0ed]/50 dark:border-[#232b2f]/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 sm:px-8 py-6 md:py-5">
          <div className="flex items-center">
            <motion.div 
              className="mr-3 bg-gradient-to-br from-[#6ad7b7] to-[#4bbd9b] p-2 rounded-lg shadow-lg"
              whileHover={{ 
                scale: 1.05,
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 0.5 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
                <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#2a353a] dark:text-white tracking-tight flex items-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2a353a] to-[#4a5a63] dark:from-white dark:to-[#b8c6c9]">Solana</span>
                <span className="text-[#6ad7b7] ml-2">Gallery</span>
              </h1>
              <p className="text-sm text-[#5e6e6a] dark:text-[#b8c6c9] font-medium hidden md:block">Discover remarkable NFT treasures</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4 items-center">
            <ThemeToggle />
            {isClient && <WalletMultiButton className="!bg-gradient-to-r !from-[#6ad7b7] !to-[#4bbd9b] hover:!from-[#4bbd9b] hover:!to-[#3aa38a] !text-white !font-bold !py-2.5 !px-6 !rounded-xl !shadow-lg !transition" />}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 py-12 md:py-20">
        <div className="flex flex-col items-center text-center">
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-[#2a353a] dark:text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Explore Your <span className="text-[#6ad7b7]">NFT Collection</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-[#5e6e6a] dark:text-[#b8c6c9] max-w-2xl mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Connect your wallet or enter a Solana address to view NFTs with stunning visual effects and detailed information.
          </motion.p>
          
          <motion.div 
            className="w-full max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AddressInput 
              manualAddressInput={manualAddressInput}
              setManualAddressInput={setManualAddressInput}
              addressError={addressError}
              isLoading={isLoading}
              handleManualAddressSubmit={handleManualAddressSubmit}
              targetAddress={targetAddress}
              clearAddressError={clearAddressError}
            />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-8 pb-20">
        {/* Connected Wallet Info */}
        {targetAddress && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ConnectedWalletInfo 
              publicKey={publicKey}
              targetAddress={targetAddress}
              isLoading={isLoading}
              setTargetAddress={setTargetAddress}
              setManualAddressInput={setManualAddressInput}
              setAddressError={setAddressError}
            />
          </motion.div>
        )}
        
        {/* Filter & Sort Controls (only shown when NFTs are loaded) */}
        {nfts.length > 0 && !isLoading && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FilterSortControls nfts={nfts} onFilterSort={handleFilterSort} />
          </motion.div>
        )}
        
        {/* NFT Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <NftGrid 
            nfts={filteredNfts} 
            isLoading={isLoading} 
            error={error} 
          />
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="w-full bg-white/80 dark:bg-[#1a2327]/80 backdrop-blur-md border-t border-[#e6f0ed]/50 dark:border-[#232b2f]/50 py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center justify-center md:justify-start">
              <div className="mr-3 bg-gradient-to-br from-[#6ad7b7] to-[#4bbd9b] p-1.5 rounded-lg shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
                  <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#2a353a] dark:text-white">
                Solana Gallery
              </h3>
            </div>
            <p className="text-sm text-[#5e6e6a] dark:text-[#b8c6c9] mt-2 text-center md:text-left">
              Explore Solana NFTs with modern UI and interactive features
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-[#5e6e6a] dark:text-[#b8c6c9] hover:text-[#6ad7b7] dark:hover:text-[#6ad7b7] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="text-[#5e6e6a] dark:text-[#b8c6c9] hover:text-[#6ad7b7] dark:hover:text-[#6ad7b7] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="text-[#5e6e6a] dark:text-[#b8c6c9] hover:text-[#6ad7b7] dark:hover:text-[#6ad7b7] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="text-[#5e6e6a] dark:text-[#b8c6c9] hover:text-[#6ad7b7] dark:hover:text-[#6ad7b7] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
            <p className="text-xs text-[#5e6e6a] dark:text-[#b8c6c9]">
              © {new Date().getFullYear()} Solana NFT Gallery. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      {/* NFT Detail Modal */}
      <NftDetailModal 
        nft={selectedNft} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}