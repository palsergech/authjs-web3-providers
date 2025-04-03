import {Provider} from "next-auth/providers"
import {SiweMessage} from "siwe"
import {getCsrfToken} from "next-auth/react"
import {SIWE_PROVIDER_ID, SIWE_PROVIDER_NAME, SIWE_STATEMENT} from "./constants"
import {Adapter} from "next-auth/adapters";

type SiweOptions = {
    adapter?: Adapter
}

function SiweProvider(options: SiweOptions = {}): Provider {
    const {adapter} = options
    return {
        id: SIWE_PROVIDER_ID,
        type: "credentials",
        name: SIWE_PROVIDER_NAME,
        credentials: {
            message: {label: "Message", type: "text"},
            signedMessage: {label: "Signed Message", type: "text"},
        },
        async authorize(credentials, req) {
            try {
                return await doAuthorize(credentials, req, adapter)
            } catch (error) {
                console.log("Failed to authorize with SIWE", error)
                return null
            }
        },
    }
}

async function doAuthorize(credentials: any, req: any, adapter?: Adapter) {
    const siwe = new SiweMessage(JSON.parse(credentials?.message))
    const nonce = await getCsrfToken({req: {headers: req.headers}})
    if (!nonce) {
        throw new Error("Missing nonce")
    }
    await verifySignature({siwe, credentials, nonce})
    if (!adapter) {
        return {
            id: siwe.address,
            address: siwe.address
        }
    }
    return saveUserToDb(siwe, adapter)
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

async function saveUserToDb(siwe: SiweMessage, adapter: Adapter) {
    const user = await adapter.getUserByAccount!!({
        providerAccountId: siwe.address,
        provider: SIWE_PROVIDER_ID
    })
    if (user) {
        return {
            id: user.id,
            address: siwe.address
        }
    }
    const newUser = await adapter.createUser!!({
        id: crypto.randomUUID(),
        name: siwe.address,
        email: siwe.address,
        emailVerified: null
    })
    await adapter.linkAccount!!({
        userId: newUser.id,
        type: "email",
        providerAccountId: siwe.address,
        provider: SIWE_PROVIDER_ID,
    })
    return {
        id: newUser.id,
        name: siwe.address,
        address: siwe.address,
    }
}

export default SiweProvider