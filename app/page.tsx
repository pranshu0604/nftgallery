'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-black text-white">
      <WalletMultiButton />
    </main>
  );
}