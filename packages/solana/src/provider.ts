import {Provider} from "next-auth/providers"
import {PublicKey} from "@solana/web3.js"
import {getCsrfToken} from "next-auth/react"
import {SOLANA_PROVIDER_ID, SOLANA_PROVIDER_NAME, SOLANA_STATEMENT} from "./constants"
import {Adapter} from "next-auth/adapters";
import {CookieOption} from "next-auth";
import {EnhancedCredentialsProvider, CredentialsAccount} from "@authjs-web3-providers/core";
import nacl from "tweetnacl";

export type SolanaProviderOptions = {
    sessionCookie?: CookieOption
    adapter?: Adapter
    chainId?: number
}

function SolanaProvider(options: SolanaProviderOptions = {}): Provider {
    const {adapter, sessionCookie, chainId = 101} = options
    return EnhancedCredentialsProvider({
        id: SOLANA_PROVIDER_ID,
        name: SOLANA_PROVIDER_NAME,
        credentials: {
            message: {label: "Message", type: "text"},
            signature: {label: "Signature", type: "text"},
        },
        adapter,
        sessionCookie,
        async authorize(credentials, req) {
            try {
                const message = credentials?.message;
                const address = credentials?.address;
                const signature = credentials?.signature;
                
                if (!message || !signature) {
                    throw new Error("Missing message or signature");
                }

                const nonce = await getCsrfToken({req: {headers: req.headers}})
                if (!nonce) {
                    throw new Error("Missing nonce")
                }

                await verifySignature({message, signature, nonce, address})

                const account: CredentialsAccount = {
                    providerAccountId: `${SOLANA_PROVIDER_ID}:${address}`,
                    name: address,
                    publicData: {
                        address: address,
                        chainId: chainId
                    }
                }
                return account
            } catch (error) {
                console.error("Solana sign in error:", error);
                return null;
            }
        },
    })
}

async function verifySignature({message, signature, nonce, address}: {
    message: string;
    signature: string;
    nonce: string
    address: string
}): Promise<string> {
    if (!message.includes(nonce)) {
        throw new Error("Nonce mismatch");
    }

    if (message !== SOLANA_STATEMENT) {
        throw new Error("Statement mismatch");
    }

    const publicKey = new PublicKey(address);
    const messageBytes = new TextEncoder().encode(message);
    const s = signature + "112"
    const signatureBytes = Buffer.from(s, 'base64');
    const publicKeyBytes = publicKey.toBytes();

    const isValid = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
    );

    if (!isValid) {
        throw new Error("Invalid signature");
    }

    return address;
}

export default SolanaProvider