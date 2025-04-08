import {Provider} from "next-auth/providers"
import {SiweMessage} from "siwe"
import {getCsrfToken} from "next-auth/react"
import {SIWE_PROVIDER_ID, SIWE_PROVIDER_NAME, SIWE_STATEMENT} from "./constants"
import {Adapter} from "next-auth/adapters";
import {CookieOption, RequestInternal,} from "next-auth";
import {getToken} from "next-auth/jwt";
import { parse } from "cookie";

export type Web3ProviderOptions = {
    sessionCookie?: CookieOption
    adapter?: Adapter
}

function SiweProvider(options: Web3ProviderOptions = {}): Provider {
    const {adapter, sessionCookie} = options
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
                return await doAuthorize({credentials, req, adapter, sessionCookie})
            } catch (error) {
                console.log("Failed to authorize with SIWE", error)
                return null
            }
        },
    }
}

async function doAuthorize({credentials, req, adapter, sessionCookie}: {
    credentials: any,
    req: Pick<RequestInternal, "body" | "query" | "headers" | "method">,
    adapter?: Adapter,
    sessionCookie?: CookieOption
}) {
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
    return saveUserToDb({siwe, adapter, sessionCookie, req})
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

async function getCurrentSession({sessionCookie, req}: {
    sessionCookie?: CookieOption,
    req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
}) {
    const headers = req.headers ?? {}
    const cookies = parse(headers?.cookie ?? "")
    const defaultSecureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ??
        !!process.env.VERCEL
    const defaultSessionCookie = defaultSecureCookie
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token"
    const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET
    const token = await getToken({
        cookieName: sessionCookie?.name ?? defaultSessionCookie,
        secureCookie: sessionCookie?.options.secure ?? defaultSecureCookie,
        // @ts-expect-error
        req: {
            cookies,
            headers
        },
        secret
    })
    console.log("CURRENT TOKEN", token)
    if (!token) {
        return null
    }
    return token.sub
}

async function saveUserToDb(params: {
    siwe: SiweMessage,
    adapter: Adapter,
    sessionCookie?: CookieOption,
    req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
}) {
    const {siwe, adapter, sessionCookie, req} = params
    const userId = await getCurrentSession({sessionCookie, req})
    if (!userId) {
        throw new Error("No user id found")
    }
    return linkAccountIfNeeded({siwe, adapter, currentUserId: userId, sessionCookie, req})
}

async function linkAccountIfNeeded(params: {
    siwe: SiweMessage,
    adapter: Adapter,
    currentUserId: string,
    sessionCookie?: CookieOption,
    req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
}) {
    const {siwe, adapter, sessionCookie, req, currentUserId} = params
    const web3Account = await adapter.getUserByAccount!!({
        providerAccountId: siwe.address,
        provider: SIWE_PROVIDER_ID
    })
    if (web3Account) {
        return {
            id: web3Account.id,
            address: siwe.address
        }
    }
    const storedUser = await adapter.getUser!!(currentUserId)
    if (!storedUser) {
        throw new Error("User not found")
    }
    await adapter.linkAccount!!({
        userId: currentUserId,
        type: "email",
        providerAccountId: siwe.address,
        provider: SIWE_PROVIDER_ID,
    })
    return {
        id: currentUserId,
        address: siwe.address
    }
}

export default SiweProvider