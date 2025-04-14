import {CredentialsConfig, Provider} from "next-auth/providers"
import {Adapter, AdapterUser} from "next-auth/adapters";
import {CookieOption, RequestInternal, User,} from "next-auth";
import {getToken} from "next-auth/jwt";
import { parse } from "cookie";

export type CredentialsAccount = {
    providerAccountId: string,
    name: string,
    publicData?: any
    privateData?: any
}

export type EnhancedCredentialsConfig = 
    Omit<Omit<CredentialsConfig, "authorize">, "type">
    & {
        adapter?: Adapter
        sessionCookie?: CookieOption
        authorize(
            credentials: any,
            req: Pick<RequestInternal, "body" | "query" | "headers" | "method">,
        ): Promise<CredentialsAccount | null>
    }

export function EnhancedCredentialsProvider(options: EnhancedCredentialsConfig): Provider {
    const {adapter, sessionCookie} = options
    return {
        ...options,
        type: "credentials",
        async authorize(credentials, req) {
            try {
                const acc = await options.authorize(credentials, req)
                if (!acc) {
                    return null
                }
                if (!adapter) {
                    return {
                        id: "temp_user_id",
                        name: acc.name,
                        data: acc.publicData
                    }
                }
                const newUser = await saveUserToDb({providerId: options.id, credentialsUser: acc, adapter, sessionCookie, req})
                return {
                    id: newUser.id,
                    name: newUser.name,
                    data: acc.publicData
                }
            } catch (error) {
                console.log(`Failed to authorize with provider=${options.id}`, error)
                return null
            }
        },
    }
}
async function getCurrentUserId({sessionCookie, req}: {
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
    providerId: string,
    credentialsUser: CredentialsAccount,
    adapter: Adapter,
    sessionCookie?: CookieOption,
    req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
}) {
    const {credentialsUser, adapter, sessionCookie, req, providerId} = params
    const currentUserId = await getCurrentUserId({sessionCookie, req})
    let user = await adapter.getUserByAccount!!({
        providerAccountId: credentialsUser.providerAccountId,
        provider: providerId
    })
    if (!!user) {
        return user
    }
    user = currentUserId 
      ? await adapter.getUser!!(currentUserId)
      : await createUser({username: credentialsUser.name, adapter})
    if (!user) {
        throw new Error("User not found")
    }
    await adapter.linkAccount!!({
        providerAccountId: credentialsUser.providerAccountId,
        provider: providerId,
        userId: user.id,
        type: "email",
        id_token: JSON.stringify({
            publicData: credentialsUser.publicData,
            privateData: credentialsUser.privateData
        })
    })
    return user
}

async function createUser(params: {
    username: string,
    adapter: Adapter
}) {
    const {username, adapter} = params
    const createUserf = adapter.createUser!! as (user: Omit<AdapterUser, "id">) => Promise<AdapterUser>
    return await createUserf({
        name: username,
        email: "",
        emailVerified: null
    })
}
