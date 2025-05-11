'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { NftGrid, log } from '../components/NftGrid';
import { AddressInput } from '../components/AddressInput';
import { ConnectedWalletInfo } from '../components/ConnectedWalletInfo';
import type { DisplayNft } from '../components/types';

export default function HomePage() {
  const { publicKey } = useWallet();
  const [isClient, setIsClient] = useState(false);
  const [nfts, setNfts] = useState<DisplayNft[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualAddressInput, setManualAddressInput] = useState('');
  const [targetAddress, setTargetAddress] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

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
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setAddressError(null);
    setNfts([]);
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
        setIsLoading(false);
        return;
      }
      const shyftData = await shyftResp.json();
      log('Shyft API data', shyftData);
      if (!shyftData.result || shyftData.result.length === 0) {
        setNfts([]);
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
      setError(null);
    }
  }, [targetAddress, isClient]);

  // Handle manual address submit
  const handleManualAddressSubmit = async () => {
    if (!manualAddressInput.trim()) {
      setAddressError("Please enter a Solana wallet address.");
      setTargetAddress(null);
      setNfts([]);
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
    }
  };

  const clearAddressError = () => {
    setAddressError(null);
  };

  // --- MAIN COMPONENT RENDER ---
  if (!isClient) {
    // Prevent hydration mismatch by not rendering wallet/address/NFT UI until client-side
    return (
      <main className="flex min-h-screen flex-col items-center p-6 bg-gray-50 dark:bg-black">
        <div className="z-10 w-full max-w-6xl items-center justify-between font-mono text-sm lg:flex mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center lg:text-left py-4 lg:py-0 fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            Solana NFT Gallery
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
            Loading client...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gray-50 dark:bg-black">
      <div className="z-10 w-full max-w-6xl items-center justify-between font-mono text-sm lg:flex mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center lg:text-left py-4 lg:py-0 fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Solana NFT Gallery
        </h1>
        <div className="fixed bottom-0 left-0 flex h-32 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none lg:h-auto">
          {isClient && <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !py-2 !px-4 !rounded-lg" />}
        </div>
      </div>

      {/* Manual address input UI */}
      <AddressInput
        manualAddressInput={manualAddressInput}
        setManualAddressInput={setManualAddressInput}
        addressError={addressError}
        isLoading={isLoading}
        handleManualAddressSubmit={handleManualAddressSubmit}
        targetAddress={targetAddress}
        clearAddressError={() => setAddressError(null)}
      />

      {/* Connected wallet info and switch button */}
      {isClient && publicKey && (
        <ConnectedWalletInfo
          publicKey={publicKey}
          targetAddress={targetAddress}
          isLoading={isLoading}
          setTargetAddress={setTargetAddress}
          setManualAddressInput={setManualAddressInput}
          setAddressError={setAddressError}
        />
      )}

      <div className="w-full max-w-6xl">
        {isClient && !targetAddress && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
              Please connect your wallet or enter an address to see NFTs.
            </p>
          </div>
        )}
        {isClient && targetAddress && (
          <>
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-gray-200">
              {targetAddress === publicKey?.toBase58() ? "My NFTs" : `NFTs for ${targetAddress.substring(0, 4)}...${targetAddress.substring(targetAddress.length - 4)}`}
            </h2>
            {isLoading && (
              <div className="flex justify-center items-center min-h-[40vh]">
                <p className="text-center text-xl text-gray-500 dark:text-gray-400">Loading NFTs...</p>
              </div>
            )}
            {error && (
              <div className="flex justify-center items-center min-h-[40vh]">
                <p className="text-center text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300 p-4 rounded-md">Error: {error}</p>
              </div>
            )}
            {!isLoading && !error && nfts.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[40vh]">
                <p className="text-center text-xl text-gray-500 dark:text-gray-400">
                  No NFTs found for this address: {targetAddress ? `${targetAddress.substring(0, 6)}...${targetAddress.substring(targetAddress.length - 6)}` : ''}
                </p>
              </div>
            )}
            {!isLoading && !error && nfts.length > 0 && (
              <NftGrid nfts={nfts} />
            )}
          </>
        )}
      </div>
    </main>
  );
}