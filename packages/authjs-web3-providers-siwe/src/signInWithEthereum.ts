import {SiweMessage} from "siwe";
import {signIn} from "next-auth/react";
import {SIWE_PROVIDER_ID, SIWE_STATEMENT} from "./constants";

export default async function signInWithEthereum(
    options: {
        address: string,
        csrfToken: () => Promise<string>,
        chainId: number,
        signMessage: (message: string) => Promise<string>,
    }
) {
    const message = new SiweMessage({
        domain: window.location.host,
        uri: window.location.origin,
        version: "1",
        address: options.address,
        statement: SIWE_STATEMENT,
        nonce: await options.csrfToken(),
        chainId: options.chainId,
        expirationTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    });
    const signedMessage = await options.signMessage(message.prepareMessage())
    await signIn(SIWE_PROVIDER_ID, {
        message: JSON.stringify(message),
        signedMessage,
        redirect: true,
        callbackUrl: "/"
    })
}