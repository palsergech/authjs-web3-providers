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
            console.log("AUTHORIZE", credentials)
            if (!credentials?.signedMessage || !credentials?.message) {
                console.log("AUTHORIZE", "ERR")
                return null
            }

            try {
                const siwe = new SiweMessage(JSON.parse(credentials?.message))
                const result = await siwe.verify({
                    signature: credentials.signedMessage,
                    nonce: await getCsrfToken({req: {headers: req.headers}}),
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
                if (!adapter) {
                    return {
                        id: siwe.address,
                        address: siwe.address
                    }
                }

                return saveUserToDb(siwe, adapter)
            } catch (error) {
                console.log(error)
                return null
            }
        },
    }
}

function validateCredentials(credentials: any) {
    if (!credentials?.signedMessage || !credentials?.message) {
        throw new Error("Missing credentials")
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