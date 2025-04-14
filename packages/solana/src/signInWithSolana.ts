import { PublicKey } from "@solana/web3.js";
import { signIn } from "next-auth/react";
import { SOLANA_PROVIDER_ID, SOLANA_STATEMENT } from "./constants";

export interface SignInWithSolanaOptions {
    address: string;
    signMessage: (message: Uint8Array) => Promise<Uint8Array>;
    csrfToken: () => Promise<string>;
}

export async function signInWithSolana(options: SignInWithSolanaOptions) {
    try {
        // Validate address
        new PublicKey(options.address);

        // Get nonce from CSRF token
        const nonce = await options.csrfToken();
        if (!nonce) {
            throw new Error("Missing nonce");
        }

        // Construct message with nonce and address
        const message = `${SOLANA_STATEMENT}\n\nNonce: ${nonce}\nAddress: ${options.address}`;

        // Request signature from wallet
        const signature = await options.signMessage(new TextEncoder().encode(message));
        const signatureBase64 = Buffer.from(signature).toString('base64');

        await signIn(SOLANA_PROVIDER_ID, {
            message,
            signature: signatureBase64,
            address: options.address,
            nonce,
            redirect: true,
            callbackUrl: "/"
        });
    } catch (error) {
        console.error("Error signing in with Solana:", error);
        throw error;
    }
}