import NextAuth, {NextAuthOptions} from "next-auth"
import GithubProvider from "next-auth/providers/github"
import {SiweProvider} from "authjs-web3-providers-siwe/src";
import {pgPool} from "@/tools/postgres/postgres";
import PostgresAdapter from "@auth/pg-adapter";

const adapter = PostgresAdapter(pgPool)

const githubProvider = GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID ?? "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
})

const siweProvider = SiweProvider({adapter})

export const authOptions: NextAuthOptions = {
    providers: [
        githubProvider,
        siweProvider
    ],
    adapter,
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/signin"
    },
    callbacks: {
        async signIn({user, account, profile, email, credentials}) {
            traceSignIn(user, account, profile, email, credentials)
            return true
        },
        async jwt({ token, account, user, session, profile, trigger }) {
            traceJwt(token, account, user, session, profile, trigger)
            return token;
        },
        async session({ session, token, newSession, trigger }) {
            traceSession(session, token, newSession, trigger)
            session.user = token
            return session;
        },
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

function traceSignIn(user: unknown, account: unknown, profile: unknown, email: unknown, credentials: unknown) {
    console.log("SIGN_IN user", JSON.stringify(user))
    console.log("SIGN_IN account", JSON.stringify(account))
    console.log("SIGN_IN profile", JSON.stringify(profile))
    console.log("SIGN_IN email", JSON.stringify(email))
    console.log("SIGN_IN credentials", JSON.stringify(credentials))
}

function traceSession(session: unknown, token: unknown, newSession: unknown, trigger: unknown) {
    console.log("SESSION session", JSON.stringify(session))
    console.log("SESSION newSession", JSON.stringify(newSession))
    console.log("SESSION token", JSON.stringify(token))
    console.log("SESSION trigger", JSON.stringify(trigger))
}

function traceJwt(token: unknown, account: unknown, user: unknown, session: unknown, profile: unknown, trigger: unknown) {
    console.log("JWT user", JSON.stringify(user))
    console.log("JWT account", JSON.stringify(account))
    console.log("JWT token", JSON.stringify(token))
    console.log("JWT session", JSON.stringify(session))
    console.log("JWT profile", JSON.stringify(profile))
    console.log("JWT trigger", JSON.stringify(trigger))
}