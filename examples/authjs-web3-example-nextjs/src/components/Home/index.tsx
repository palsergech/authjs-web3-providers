'use client'

import {signIn, signOut, useSession} from "next-auth/react";
import React from "react";

export default function Home() {
    const session = useSession()
    return (
        <div>
            <p> {JSON.stringify(session)}</p>
            <div>
                <button onClick={() => signIn()}>Login</button>
            </div>
            <div>
                <button onClick={() => signOut()}>Sign out</button>
            </div>
        </div>
    )
}
