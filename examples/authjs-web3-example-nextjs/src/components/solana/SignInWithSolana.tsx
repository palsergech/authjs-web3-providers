'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { getCsrfToken, signIn } from 'next-auth/react';
import { useState } from 'react';
import { WalletName } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { signInWithSolana } from '@authjs-web3-providers/solana';

const WALLETS = [
  {
    name: 'Phantom' as WalletName,
    adapter: new PhantomWalletAdapter(),
  },
  {
    name: 'Solflare' as WalletName,
    adapter: new SolflareWalletAdapter(),
  },
];

export default function SignInWithSolana() {
  const { publicKey, signMessage, connect, select, wallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!publicKey || !signMessage) return;

    try {
      setIsLoading(true);
      setError(null);
      const nonce = await fetch('/api/auth/csrf').then(res => res.json());
      const message = `Sign in with Solana to the app.\n\nNonce: ${nonce}\nAddress: ${publicKey.toString()}`;
      const csrfToken = async () => {
        const token = await getCsrfToken()
        if (!token) throw new Error("CSRF token not found")
        return token
      }
      await signInWithSolana({
        address: publicKey.toString(),
        signMessage: (message) => signMessage(message),
        csrfToken,
      })
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletSelect = async (walletName: WalletName) => {
    try {
      setError(null);
      const selectedWallet = WALLETS.find(w => w.name === walletName);
      if (!selectedWallet) return;

      await select(selectedWallet.name);
      await connect();
    } catch (error) {
      console.error('Wallet connection error:', error);
      setError('Failed to connect wallet. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Sign in with Solana</h1>
      
      {!publicKey ? (
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-lg font-semibold text-center">Select a wallet</h2>
          <div className="grid grid-cols-1 gap-4">
            {WALLETS.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => handleWalletSelect(wallet.name)}
                className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">{wallet.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm text-gray-600">
            Connected: {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </p>
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in with Solana'}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 text-red-500 text-center">{error}</p>
      )}
    </div>
  );
} 