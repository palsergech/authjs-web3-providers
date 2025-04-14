'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { getCsrfToken, signIn } from 'next-auth/react';
import { useState } from 'react';
import { WalletName } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { signInWithSolana } from '@authjs-web3-providers/solana';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in with Solana</CardTitle>
          <CardDescription>
            Connect your wallet to sign in with your Solana account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!publicKey ? (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-center">Select a wallet</h2>
              {WALLETS.map((wallet) => (
                <Button
                  key={wallet.name}
                  onClick={() => handleWalletSelect(wallet.name)}
                  variant="secondary"
                  fullWidth
                >
                  <span className="font-medium">{wallet.name}</span>
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-mono">
                  {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                </span>
              </div>
              <Button
                onClick={handleSignIn}
                disabled={isLoading}
                variant="primary"
                fullWidth
              >
                {isLoading ? 'Signing in...' : 'Sign in with Solana'}
              </Button>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 