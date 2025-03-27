
import {Provider} from "next-auth/providers"
import {SiweMessage} from "siwe"
import {getCsrfToken} from "next-auth/react"
import {SIWE_PROVIDER_ID, SIWE_PROVIDER_NAME, SIWE_STATEMENT} from "./constants"

const SiweProvider: Provider = {
    id: SIWE_PROVIDER_ID,
    type: "credentials",
    name: SIWE_PROVIDER_NAME,
    credentials: {
        message: {label: "Message", type: "text"},
        signedMessage: {label: "Signed Message", type: "text"},
    },
    async authorize(credentials, req) {
        if (!credentials?.signedMessage || !credentials?.message) {
            return null
        }

        try {
            const siwe = new SiweMessage(JSON.parse(credentials?.message))
            const result = await siwe.verify({
                signature: credentials.signedMessage,
                nonce: await getCsrfToken({req}),
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
            return {
                id: siwe.address
            }
        } catch (error) {
            console.log(error)
            return null
        }
    },
}

export default SiweProvider