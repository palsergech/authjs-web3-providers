'use client'

import {signIn, signOut, useSession} from "next-auth/react";
import React from "react";
import {User} from "@/domain/user";

export default function UserInfo() {
    const session = useSession()
    switch (session?.status) {
        case 'authenticated': {
            const user = session.data.user as User
            return <UserPanel user={user}/>
        }
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
    const login = async () => {
        await signIn()
    }
    return (
        <div>
            <p>Not logged in</p>
            <button onClick={login}>Login</button>
        </div>
    )
}

function UserPanel(props: { user: User }) {
    return (
        <div>
            <UserDetails user={props.user}/>
            <button onClick={() => signOut()}>Sign out</button>
        </div>
    )
}

function UserDetails(props: { user: User }) {
    switch (props.user.provider) {
        case "github":
            return <GitHubUserDetails user={props.user}/>
        default:
            return <div>Unknown provider: {props.user.provider}</div>
    }
}

function GitHubUserDetails(props: { user: User }) {
    const user = props.user
    return (
        <div>
            <p>GitHub user: {JSON.stringify(user)}</p>
            <p>GitHub user: {user.visibleName}</p>
            <p>Email: {user.email}</p>
            <img src={user.image} alt="avatar"/>
        </div>
    )
}