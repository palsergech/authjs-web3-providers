# @authjs-web3-providers/siwe

[![npm version](https://badge.fury.io/js/@authjs-web3-providers%2Fsiwe.svg)](https://badge.fury.io/js/@authjs-web3-providers%2Fsiwe)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

Sign-In with Ethereum (SIWE) provider for Auth.js (NextAuth.js).

## Features

- 🔐 Seamless integration with Auth.js
- 🌐 Web3 authentication using SIWE
- 📦 TypeScript support
- 🔄 Automatic session management
- 🛡️ Secure by default

## Installation

```bash
npm install @authjs-web3-providers/siwe
# or
yarn add @authjs-web3-providers/siwe
# or
pnpm add @authjs-web3-providers/siwe
```

## Quick Start

```typescript
import { SiweProvider } from '@authjs-web3-providers/siwe';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    SiweProvider({
      // Optional: Customize session cookie
      sessionCookie: {
        name: 'custom-session',
        options: {
          secure: process.env.NODE_ENV === 'production'
        }
      },
      // Optional: Add database adapter
      adapter: yourAdapter
    })
  ],
  session: {
    strategy: 'jwt'
  }
};
```

## Configuration Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `sessionCookie` | CookieOption | Customize session cookie settings | Uses NextAuth defaults |
| `adapter` | Adapter | Database adapter for user persistence | Optional |

## API Reference

### SiweProvider

```typescript
interface Web3ProviderOptions {
  sessionCookie?: CookieOption;
  adapter?: Adapter;
}

function SiweProvider(options?: Web3ProviderOptions): Provider;
```

## Examples

### Basic Usage with Default Settings

```typescript
import { SiweProvider } from '@authjs-web3-providers/siwe';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    SiweProvider()
  ],
  session: {
    strategy: 'jwt'
  }
};
```

### With Custom Session Cookie

```typescript
import { SiweProvider } from '@authjs-web3-providers/siwe';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    SiweProvider({
      sessionCookie: {
        name: 'custom-session',
        options: {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  }
};
```

## Contributing

Contributions are welcome! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

This package is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

## Security

If you discover any security related issues, please email security@yourdomain.com instead of using the issue tracker.

## Support

For support, please open an issue in the GitHub repository or contact us at support@yourdomain.com. 