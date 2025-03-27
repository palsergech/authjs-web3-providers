'use client'

import {useAccount, useConnect, useSignMessage} from "wagmi";
import {signInWithEthereum} from "authjs-web3-providers-siwe/src";
import {getCsrfToken} from "next-auth/react";
import {Hex} from "viem";

export default function SignInWithEthereum() {
    const { address, chainId } = useAccount()
    const assertNoChainId = () => {
        throw new Error("Chain ID not found")
    }
    return <div>
        {address
            ? <LoginButton account={address} chainId={chainId ?? assertNoChainId()}/>
            : <WalletOptions/>}
    </div>
}

function LoginButton({ account, chainId }: { account: Hex, chainId: number }) {
    const { signMessageAsync } = useSignMessage()
    const csrfToken = async () => {
        const token = await getCsrfToken()
        if (!token) throw new Error("CSRF token not found")
        return token
    }
    const login = async () => {
        await signInWithEthereum({
            address: account,
            signMessage: (message) => signMessageAsync({account, message}),
            csrfToken,
            chainId,
        })
    }
    return <div>
        <button onClick={login}>Login with {account}</button>
    </div>
}

function WalletOptions() {
    const { connectors, connect } = useConnect()

    return <div>
        <ul>
            {
                connectors.map((connector) => (
                    <li key={connector.uid}>
                        <button onClick={() => connect({connector})}>
                            {connector.name}
                        </button>
                    </li>
                ))
            }
        </ul>
    </div>
}
