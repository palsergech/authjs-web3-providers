import NextAuth, {NextAuthOptions} from "next-auth"
import GithubProvider from "next-auth/providers/github"
import {User} from "@/domain/user";

const githubProvider = GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID!!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!!,
})

export const authOptions: NextAuthOptions = {
    providers: [
        githubProvider
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.provider = account.provider;
            }
            return token;
        },
        async session({ session, token }) {
            const userData: Record<string, User> = {
                "github": {
                    provider: "github",
                    id: token.sub as string,
                    username: token.username as string,
                    visibleName: token.name ?? "unknown",
                    email: token.email ?? "unknown",
                    image: token.picture as string
                }
            }
            const ud = userData[token.provider as string]
            console.log(JSON.stringify(ud))
            session.user = ud
            return session;
        },
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
