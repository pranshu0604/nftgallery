import React from 'react';

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
    <div className="mb-8 p-4 rounded-lg bg-white dark:bg-zinc-800 shadow-md w-full max-w-xl text-center">
      <p className="text-md font-semibold text-gray-800 dark:text-gray-200">Connected Wallet:</p>
      <p className="text-sm text-blue-600 dark:text-blue-400 break-all">{publicKey.toBase58()}</p>
      {targetAddress !== publicKey.toBase58() && (
        <button
          onClick={() => {
            setTargetAddress(publicKey.toBase58());
            setManualAddressInput('');
            setAddressError(null);
          }}
          className="mt-2 text-sm text-blue-500 hover:underline"
          disabled={isLoading && targetAddress === publicKey.toBase58()}
        >
          {isLoading && targetAddress === publicKey.toBase58() ? 'Loading your NFTs...' : 'Show my connected wallet NFTs'}
        </button>
      )}
    </div>
  );
}
