# @authjs-web3-providers/core

Core functionality for AuthJS Web3 Providers. This package provides enhanced credentials provider implementation for NextAuth.js that supports Web3 authentication.

## Features

- Enhanced credentials provider for NextAuth.js
- Support for Web3 authentication flows
- Flexible adapter integration
- Customizable session handling
- Type-safe implementation

## Installation

```bash
pnpm add @authjs-web3-providers/core
```

## Usage

```typescript
import { EnhancedCredentialsProvider } from '@authjs-web3-providers/core';
import { NextAuth } from 'next-auth';

const auth = new NextAuth({
  providers: [
    EnhancedCredentialsProvider({
      id: 'web3',
      name: 'Web3',
      credentials: {
        // Your credentials configuration
      },
      async authorize(credentials, req) {
        // Your authorization logic
        return {
          providerAccountId: 'unique-id',
          name: 'user-name',
          publicData: {
            // Any public user data
          }
        };
      }
    })
  ]
});
```

## API

### EnhancedCredentialsProvider

Enhanced credentials provider that extends NextAuth.js credentials provider with additional features:

```typescript
type EnhancedCredentialsConfig = {
  id: string;
  name: string;
  credentials: Record<string, CredentialInput>;
  adapter?: Adapter;
  sessionCookie?: CookieOption;
  authorize: (
    credentials: any,
    req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
  ) => Promise<CredentialsAccount | null>;
};
```

### CredentialsAccount

Type representing a user account in the credentials flow:

```typescript
type CredentialsAccount = {
  providerAccountId: string;
  name: string;
  publicData?: any;
  privateData?: any;
};
```

## License

MIT 