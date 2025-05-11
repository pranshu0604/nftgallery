'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

// Define types for NFT data
interface NftAttribute {
  trait_type: string;
  value: string;
}

interface JsonMetadata {
  name: string;
  image: string;
  attributes: NftAttribute[];
  description?: string;
  symbol?: string;
}

interface HeliusApiNftContent {
  json_uri: string;
}

interface HeliusApiNft {
  mint: string;
  content: HeliusApiNftContent;
}

interface DisplayNft {
  mint: string;
  name: string;
  imageUrl: string;
  attributes: NftAttribute[];
  description?: string;
}

export default function HomePage() {
  const { publicKey } = useWallet();
  const [isClient, setIsClient] = useState(false);
  const [nfts, setNfts] = useState<DisplayNft[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchNfts = async () => {
      if (!publicKey) {
        setNfts([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      setNfts([]);

      const heliusApiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
      if (!heliusApiKey) {
        setError("Helius API key is not configured. Please set NEXT_PUBLIC_HELIUS_API_KEY in your .env.local file.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.helius.xyz/v0/addresses/${publicKey.toBase58()}/nfts?api-key=${heliusApiKey}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch NFTs: ${response.statusText}`);
        }
        const data = await response.json();
        const heliusNfts: HeliusApiNft[] = data.nfts || [];

        if (heliusNfts.length === 0) {
          setIsLoading(false);
          return;
        }

        const fetchedNfts: DisplayNft[] = [];
        for (const heliusNft of heliusNfts) {
          try {
            const metadataResponse = await fetch(heliusNft.content.json_uri);
            if (!metadataResponse.ok) {
              console.warn(`Failed to fetch metadata for ${heliusNft.mint} from ${heliusNft.content.json_uri}`);
              continue;
            }
            const metadata: JsonMetadata = await metadataResponse.json();
            fetchedNfts.push({
              mint: heliusNft.mint,
              name: metadata.name,
              imageUrl: metadata.image,
              attributes: metadata.attributes || [],
              description: metadata.description,
            });
          } catch (e) {
            console.warn(`Error processing metadata for ${heliusNft.mint}:`, e);
          }
        }
        setNfts(fetchedNfts);
      } catch (e: any) {
        console.error("Error fetching NFTs:", e);
        setError(e.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isClient) {
      fetchNfts();
    }
  }, [publicKey, isClient]);

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

      {isClient && publicKey && (
        <div className="mt-20 lg:mt-4 mb-8 p-4 rounded-lg bg-white dark:bg-zinc-800 shadow-md w-full max-w-xl text-center">
          <p className="text-md font-semibold text-gray-800 dark:text-gray-200">Connected Wallet:</p>
          <p className="text-sm text-blue-600 dark:text-blue-400 break-all">{publicKey.toBase58()}</p>
        </div>
      )}

      <div className="w-full max-w-6xl">
        {isClient && !publicKey && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
              Please connect your wallet to see your NFTs.
            </p>
          </div>
        )}
        {isClient && publicKey && (
          <>
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-gray-200">My NFTs</h2>
            {isLoading && 
              <div className="flex justify-center items-center min-h-[40vh]">
                <p className="text-center text-xl text-gray-500 dark:text-gray-400">Loading NFTs...</p>
                 {/* You could add a spinner here */}
              </div>
            }
            {error && 
              <div className="flex justify-center items-center min-h-[40vh]">
                <p className="text-center text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300 p-4 rounded-md">Error: {error}</p>
              </div>
            }
            {!isLoading && !error && nfts.length === 0 && (
              <div className="flex justify-center items-center min-h-[40vh]">
                <p className="text-center text-xl text-gray-500 dark:text-gray-400">No NFTs found for this wallet.</p>
              </div>
            )}
            {!isLoading && !error && nfts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {nfts.map((nft) => (
                  <div 
                    key={nft.mint} 
                    className="border rounded-xl p-4 shadow-lg bg-white dark:bg-zinc-800 hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out flex flex-col"
                  >
                    <img 
                      src={nft.imageUrl} 
                      alt={nft.name} 
                      className="w-full h-56 object-cover rounded-lg mb-4 shadow-sm" 
                      onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300x400?text=No+Image')} // Fallback image
                    />
                    <div className="flex flex-col flex-grow">
                      <h3 className="text-lg font-semibold mb-1 truncate text-gray-800 dark:text-gray-100" title={nft.name}>{nft.name}</h3>
                      {nft.description && <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 flex-grow min-h-[3em] overflow-hidden" title={nft.description}>{nft.description}</p>}
                      {nft.attributes && nft.attributes.length > 0 && (
                        <div className="mt-auto pt-2 border-t border-gray-200 dark:border-zinc-700">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Attributes:</p>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 max-h-24 overflow-y-auto space-y-0.5">
                            {nft.attributes.map((attr, index) => (
                              <li key={index} className="truncate bg-gray-100 dark:bg-zinc-700 p-1 rounded-sm">
                                <span className="font-medium text-gray-700 dark:text-gray-300">{attr.trait_type}:</span> {attr.value}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}