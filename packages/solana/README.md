# @authjs-web3-providers/solana

AuthJS Web3 Provider for Solana blockchain authentication. This package enables users to sign in to your application using their Solana wallet.

## Features

- 🔐 Secure authentication using Solana wallet signatures
- 🔄 Automatic session management
- 🛠️ Easy integration with Next.js applications
- 📦 Works with any Solana wallet (Phantom, Solflare, etc.)
- 🔗 Supports both mainnet and devnet

## Installation

```bash
pnpm add @authjs-web3-providers/solana @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-wallets @solana/web3.js
```

## Quick Start

1. Configure your Next.js application with the Solana provider:

```typescript
// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth"
import { SolanaProvider } from "@authjs-web3-providers/solana"
import { pgPool } from "@/tools/postgres/postgres"
import PostgresAdapter from "@auth/pg-adapter"

const adapter = PostgresAdapter(pgPool)

export default NextAuth({
  providers: [
    SolanaProvider({
      adapter,
      chainId: 101 // Solana Mainnet
    })
  ],
  adapter,
  session: {
    strategy: "jwt"
  }
})
```

2. Create a sign-in page with wallet connection:

```typescript
// pages/signin/solana.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SolanaSignIn() {
  const router = useRouter();
  const { publicKey, signMessage } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!publicKey || !signMessage) return;

    try {
      setIsLoading(true);
      const nonce = await fetch('/api/auth/csrf').then(res => res.json());
      const message = `Sign in with Solana to the app.\n\nNonce: ${nonce}\nAddress: ${publicKey.toString()}`;
      
      const signature = await signMessage(new TextEncoder().encode(message));
      
      const result = await signIn('solana', {
        message,
        signature: Buffer.from(signature).toString('base64'),
        redirect: false,
      });

      if (result?.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign in with Solana</h1>
      <button
        onClick={handleSignIn}
        disabled={!publicKey || isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign in with Solana'}
      </button>
    </div>
  );
}
```

3. Wrap your application with the Solana wallet provider:

```typescript
// _app.tsx
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { SessionProvider } from 'next-auth/react';

const network = WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);
const wallets = [new PhantomWalletAdapter()];

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <Component {...pageProps} />
        </WalletProvider>
      </ConnectionProvider>
    </SessionProvider>
  );
}
```

## Configuration Options

The Solana provider accepts the following options:

```typescript
interface SolanaProviderOptions {
  // Database adapter for storing user data
  adapter?: Adapter;
  
  // Session cookie configuration
  sessionCookie?: CookieOption;
  
  // Solana chain ID (default: 101 for mainnet)
  chainId?: number;
}
```

## Security Considerations

- Always verify the nonce in the signed message
- Use HTTPS in production
- Validate the wallet address and signature
- Consider rate limiting for authentication attempts

## Development

To run the development environment with hot reloading:

```bash
pnpm watch
```

## License

MIT 