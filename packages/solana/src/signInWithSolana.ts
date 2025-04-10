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

        const message = SOLANA_STATEMENT

        // Request signature from wallet
        const signature = await options.signMessage(new TextEncoder().encode(message));

        await signIn(SOLANA_PROVIDER_ID, {
            message,
            signature: Buffer.from(signature).toString("base64"),
            address: options.address,
            redirect: true,
            callbackUrl: "/"
        });
    } catch (error) {
        console.error("Error signing in with Solana:", error);
        throw error;
    }
}