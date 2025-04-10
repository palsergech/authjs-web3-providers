import {Provider} from "next-auth/providers"
import {SiweMessage} from "siwe"
import {getCsrfToken} from "next-auth/react"
import {SIWE_PROVIDER_ID, SIWE_PROVIDER_NAME, SIWE_STATEMENT} from "./constants"
import {Adapter} from "next-auth/adapters";
import {CookieOption, RequestInternal} from "next-auth";
import {EnhancedCredentialsProvider, CredentialsAccount} from "@authjs-web3-providers/core";

export type Web3ProviderOptions = {
    sessionCookie?: CookieOption
    adapter?: Adapter
}

function SiweProvider(options: Web3ProviderOptions = {}): Provider {
    const {adapter, sessionCookie} = options
    return EnhancedCredentialsProvider({
        id: SIWE_PROVIDER_ID,
        name: SIWE_PROVIDER_NAME,
        credentials: {
            message: {label: "Message", type: "text"},
            signedMessage: {label: "Signed Message", type: "text"},
        },
        adapter,
        sessionCookie,
        async authorize(credentials, req) {
            const siwe = new SiweMessage(JSON.parse(credentials?.message))
            const nonce = await getCsrfToken({req: {headers: req.headers}})
            if (!nonce) {
                throw new Error("Missing nonce")
            }
            await verifySignature({siwe, credentials, nonce})
            const u: CredentialsAccount = {
                providerAccountId: `${SIWE_PROVIDER_ID}:${siwe.address}`,
                name: siwe.address,
                publicData: {
                    address: siwe.address
                }
            }
            return u
        },
    })
}

async function verifySignature({siwe, credentials, nonce}: {
    siwe: SiweMessage,
    credentials: any,
    nonce: string
}) {
    const result = await siwe.verify({
        signature: credentials.signedMessage,
        nonce,
    })
    if (!result.success) {
        throw new Error("Invalid signature")
    }
    if (SIWE_STATEMENT !== result.data.statement) {
        throw new Error("Statement mismatch")
    }
    if (new Date(result.data.expirationTime as string) < new Date()) {
        throw new Error("Signature expired")
    }
}

export default SiweProvider