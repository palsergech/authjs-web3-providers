import { verifySignature, SignatureVerificationError } from '../verifySignature';
import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';

describe('verifySignature', () => {
    // Test data setup
    const message = "Test message";
    const keypair = Keypair.generate();
    const address = keypair.publicKey.toString();
    
    // Helper function to create valid signature
    const createValidSignature = (msg: string): string => {
        const messageBytes = new TextEncoder().encode(msg);
        const signatureBytes = nacl.sign.detached(
            messageBytes,
            keypair.secretKey
        );
        return Buffer.from(signatureBytes).toString('base64');
    };

    it('should verify a valid signature', () => {
        const signature = createValidSignature(message);
        
        expect(() => {
            verifySignature({ message, signature, address });
        }).not.toThrow();
    });

    it('should return the address when verification succeeds', () => {
        const signature = createValidSignature(message);
        
        const result = verifySignature({ message, signature, address });
        expect(result).toBe(address);
    });

    it('should throw on invalid address', () => {
        const signature = createValidSignature(message);
        
        expect(() => {
            verifySignature({
                message,
                signature,
                address: 'invalid-address'
            });
        }).toThrow(SignatureVerificationError);
    });

    it('should throw on invalid signature format', () => {
        expect(() => {
            verifySignature({
                message,
                signature: 'invalid-base64!',
                address
            });
        }).toThrow(SignatureVerificationError);
    });

    it('should throw on wrong signature length', () => {
        expect(() => {
            verifySignature({
                message,
                signature: 'YQ==', // "a" in base64
                address
            });
        }).toThrow(SignatureVerificationError);
    });

    it('should throw on signature mismatch', () => {
        // Create signature for different message
        const signature = createValidSignature("Different message");
        
        expect(() => {
            verifySignature({ message, signature, address });
        }).toThrow(SignatureVerificationError);
    });

    it('should throw on missing parameters', () => {
        expect(() => {
            verifySignature({
                message: '',
                signature: createValidSignature(message),
                address
            });
        }).toThrow(SignatureVerificationError);
    });

    it('should throw when using different keypair', () => {
        const signature = createValidSignature(message);
        const differentKeypair = Keypair.generate();
        
        expect(() => {
            verifySignature({
                message,
                signature,
                address: differentKeypair.publicKey.toString()
            });
        }).toThrow(SignatureVerificationError);
    });

    it('should verify signature with special characters in message', () => {
        const specialMessage = "Special 🚀 message with ünicode";
        const signature = createValidSignature(specialMessage);
        
        expect(() => {
            verifySignature({
                message: specialMessage,
                signature,
                address
            });
        }).not.toThrow();
    });

    it('should throw when signature is valid length but invalid', () => {
        const signature = createValidSignature(message);
        // Replace 10th char with next alphabetical symbol to create invalid base64
        const invalidSignature = signature.substring(0, 9) + 
            String.fromCharCode(signature.charCodeAt(9) + 1) + 
            signature.substring(10);
        expect(() => {
            verifySignature({ message, signature: invalidSignature, address });
        }).toThrow(SignatureVerificationError);
        expect(() => {
            verifySignature({ message, signature: invalidSignature, address });
        }).toThrow("Invalid signature");
    });
}); 