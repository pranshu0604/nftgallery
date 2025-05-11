import React from 'react';

export function AddressInput({
  manualAddressInput,
  setManualAddressInput,
  addressError,
  isLoading,
  handleManualAddressSubmit,
  targetAddress,
  clearAddressError
}: {
  manualAddressInput: string;
  setManualAddressInput: (v: string) => void;
  addressError: string | null;
  isLoading: boolean;
  handleManualAddressSubmit: () => void;
  targetAddress: string | null;
  clearAddressError: () => void;
}) {
  console.log('[NFT-GALLERY] Rendering AddressInput', { manualAddressInput, addressError, isLoading, targetAddress });
  return (
    <div className="mb-8 p-4 rounded-lg bg-white dark:bg-zinc-800 shadow-md w-full max-w-xl text-center">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">View NFTs by Address</h2>
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
        <input
          type="text"
          value={manualAddressInput}
          onChange={(e) => {
            setManualAddressInput(e.target.value);
            clearAddressError();
          }}
          placeholder="Enter Solana Wallet Address"
          className="flex-grow p-2 border border-gray-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={() => {
            try {
              handleManualAddressSubmit();
            } catch (err) {
              console.error('[NFT-GALLERY] 500 error in AddressInput handleManualAddressSubmit', err);
              alert('500 error: Something went wrong. See console for details.');
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto"
          disabled={isLoading}
        >
          {isLoading && targetAddress === manualAddressInput.trim() ? 'Fetching...' : 'Fetch NFTs'}
        </button>
      </div>
      {addressError && <p className="text-red-500 text-sm mt-2">{addressError}</p>}
    </div>
  );
}
