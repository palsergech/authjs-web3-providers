import {EthereumUser, GitHubUser, User} from "@/domain/user";
import {signOut} from "next-auth/react";
import React from "react";

export default function UserProfile(props: { user: User }) {
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
        case "siwe-csrf":
            return <SiweCsrfUserDetails user={props.user}/>
        default:
            return <div>Unknown provider: {props.user}</div>
    }
}

function SiweCsrfUserDetails(props: { user: EthereumUser }) {
    const user = props.user
    return (
        <div>
            <p>Ethereum user: {user.address}</p>
        </div>
    )
}

function GitHubUserDetails(props: { user: GitHubUser }) {
    const user = props.user
    return (
        <div>
            <p>GitHub user: {user.visibleName}</p>
            <p>Email: {user.email}</p>
            <img src={user.image} alt="avatar"/>
        </div>
    )
}