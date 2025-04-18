import {Provider} from "next-auth/providers"
import {PublicKey} from "@solana/web3.js"
import {getCsrfToken} from "next-auth/react"
import {SOLANA_PROVIDER_ID, SOLANA_PROVIDER_NAME, SOLANA_STATEMENT} from "./constants"
import {Adapter} from "next-auth/adapters";
import {CookieOption} from "next-auth";
import {EnhancedCredentialsProvider, CredentialsAccount} from "@authjs-web3-providers/core";
import { verifySignature } from './utils/verifySignature';

export type SolanaProviderOptions = {
    sessionCookie?: CookieOption
    adapter?: Adapter
}

function SolanaProvider(options: SolanaProviderOptions = {}): Provider {
    const {adapter, sessionCookie} = options
    return EnhancedCredentialsProvider({
        id: SOLANA_PROVIDER_ID,
        name: SOLANA_PROVIDER_NAME,
        credentials: {
            message: {label: "Message", type: "text"},
            signature: {label: "Signature", type: "text"},
            address: {label: "Address", type: "text"},
            nonce: {label: "Nonce", type: "text"},
        },
        adapter,
        sessionCookie,
        async authorize(credentials, req) {
            try {
                const message = credentials?.message;
                const address = credentials?.address;
                const signature = credentials?.signature;
                const nonce = credentials?.nonce;
                
                if (!message || !signature || !address || !nonce) {
                    throw new Error("Missing required credentials");
                }

                // Verify the nonce matches the CSRF token
                const expectedNonce = await getCsrfToken({req: {headers: req.headers}});
                if (nonce !== expectedNonce) {
                    throw new Error("Invalid nonce");
                }

                // Verify the address in the message matches the provided address
                const messageLines = message.split('\n');
                const messageAddress = messageLines.find((line: string) => line.startsWith('Address: '))?.split('Address: ')[1];
                if (messageAddress !== address) {
                    throw new Error("Address mismatch");
                }

                // Verify the signature
                verifySignature({message, signature, address});

                const account: CredentialsAccount = {
                    providerAccountId: `${SOLANA_PROVIDER_ID}:${address}`,
                    name: address,
                    publicData: { address }
                }
                return account;
            } catch (error) {
                console.error("Solana sign in error:", error);
                return null;
            }
        },
    })
}

export default SolanaProvider