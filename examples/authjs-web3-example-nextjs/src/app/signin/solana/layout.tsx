'use client';

import { SolanaWalletProvider } from '@/components/solana/SolanaWalletProvider';

export default function SolanaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SolanaWalletProvider>
        {children}
    </SolanaWalletProvider>
  );
}
