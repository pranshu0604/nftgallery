import './globals.css';
import WalletContextProvider from '@/providers/walletContextProvider';
import { ThemeProvider } from 'next-themes';
import '@solana/wallet-adapter-react-ui/styles.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NFT Gallery',
  description: 'Solana NFT Viewer by Notorious Pran',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WalletContextProvider>
            {children}
          </WalletContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}