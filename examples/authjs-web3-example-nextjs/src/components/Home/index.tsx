'use client'

import {signIn, useSession} from "next-auth/react";
import React, {useEffect} from "react";
import {User} from "@/domain/user";
import UserProfile from "@/components/UserProfile";

export default function Home() {
    const session = useSession()
    useEffect(() => {
        if (session?.status === 'unauthenticated') {
            signIn()
        }
    }, [session.status]);
    switch (session?.status) {
        case 'authenticated':
            return <UserProfile user={session.data.user as User}/>
        case 'unauthenticated':
            return <LoginButton/>
        default:
            return <UserInfoLoading/>
    }
}

function UserInfoLoading() {
    return (
        <div>
            <p>Loading...</p>
        </div>
    )
}

function LoginButton() {
    return (
        <div>
            <p>Not logged in</p>
            <button onClick={() => signIn()}>Login
            </button>
        </div>
    )
}
