'use client'

import {signIn} from "next-auth/react"
import Link from "next/link"

export default function SignIn() {
    return (
        <>
            <h1>Sign In</h1>
            <div>
                <div>
                    <button onClick={() => signIn("github", {
                        redirect: false,
                        callbackUrl: "/"
                    })}>Github</button>
                </div>
                <div>
                    <Link href="/signin/siwe">SIWE</Link>
                </div>
                <div>
                    <Link href="/signin/solana">Solana</Link>
                </div>
            </div>
        </>
    )
}
