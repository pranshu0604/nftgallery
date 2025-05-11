import React from 'react';
import type { DisplayNft } from './types';

export function log(...args: any[]) {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('[NFT-GALLERY]', ...args);
  }
}

export function NftCard({ nft }: { nft: DisplayNft }) {
  log('Rendering NFT Card', nft);
  return (
    <div
      key={nft.mint}
      className="border rounded-xl p-4 shadow-lg bg-white dark:bg-zinc-800 hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out flex flex-col"
    >
      <img
        src={nft.imageUrl}
        alt={nft.name}
        className="w-full h-56 object-cover rounded-lg mb-4 shadow-sm"
        onError={(e) => {
          log('Image error for', nft.mint, nft.imageUrl);
          (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image';
        }}
      />
      <div className="flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-1 truncate text-gray-800 dark:text-gray-100" title={nft.name}>{nft.name}</h3>
        {nft.description && <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 flex-grow min-h-[3em] overflow-hidden" title={nft.description}>{nft.description}</p>}
        {nft.attributes && nft.attributes.length > 0 && (
          <div className="mt-auto pt-2 border-t border-gray-200 dark:border-zinc-700">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Attributes:</p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 max-h-24 overflow-y-auto space-y-0.5">
              {nft.attributes.map((attr: { trait_type: string; value: string }, index: number) => (
                <li key={index} className="truncate bg-gray-100 dark:bg-zinc-700 p-1 rounded-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{attr.trait_type}:</span> {attr.value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export function NftGrid({ nfts }: { nfts: DisplayNft[] }) {
  log('Rendering NFT Grid', nfts.length);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {nfts.map((nft) => <NftCard key={nft.mint} nft={nft} />)}
    </div>
  );
}
