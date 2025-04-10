import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

export interface SignatureVerificationParams {
    message: string;
    signature: string;
    address: string;
}

export class SignatureVerificationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SignatureVerificationError';
    }
}

/**
 * Verifies a Solana message signature
 * @param params - The verification parameters
 * @throws {SignatureVerificationError} If verification fails
 * @returns The verified address if successful
 */
export function verifySignature({
    message,
    signature,
    address,
}: SignatureVerificationParams): string {
    // Validate inputs
    if (!message || !signature || !address) {
        throw new SignatureVerificationError("Missing required parameters");
    }

    let publicKey: PublicKey;
    try {
        publicKey = new PublicKey(address);
    } catch (error) {
        throw new SignatureVerificationError("Invalid Solana address");
    }

    const messageBytes = new TextEncoder().encode(message);
    
    let signatureBytes: Uint8Array;
    try {
        signatureBytes = Buffer.from(signature, 'base64');
        if (signatureBytes.length !== 64) { // Solana signatures are 64 bytes
            throw new SignatureVerificationError("Invalid signature length");
        }
    } catch (error) {
        if (error instanceof SignatureVerificationError) {
            throw error;
        }
        throw new SignatureVerificationError("Invalid signature format");
    }
    
    const publicKeyBytes = publicKey.toBytes();

    const isValid = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
    );

    if (!isValid) {
        throw new SignatureVerificationError("Invalid signature");
    }

    return address;
} 