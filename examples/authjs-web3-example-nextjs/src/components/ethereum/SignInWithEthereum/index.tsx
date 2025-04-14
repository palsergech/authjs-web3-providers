'use client'

import {useAccount, useConnect, useSignMessage} from "wagmi";
import {signInWithEthereum} from "@authjs-web3-providers/siwe";
import {getCsrfToken} from "next-auth/react";
import {Hex} from "viem";
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SignInWithEthereum() {
    const { address, chainId } = useAccount()
    const assertNoChainId = () => {
        throw new Error("Chain ID not found")
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Sign in with Ethereum</CardTitle>
                    <CardDescription>
                        Connect your wallet to sign in with your Ethereum account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {address
                        ? <LoginButton account={address} chainId={chainId ?? assertNoChainId()}/>
                        : <WalletOptions/>}
                </CardContent>
            </Card>
        </div>
    )
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
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-mono">
                    {account.slice(0, 6)}...{account.slice(-4)}
                </span>
            </div>
            <Button
                onClick={login}
                variant="primary"
                fullWidth
            >
                Sign in with Ethereum
            </Button>
        </div>
    )
}

function WalletOptions() {
    const { connectors, connect } = useConnect()

    return (
        <div className="space-y-3">
            {connectors.map((connector) => (
                <Button
                    key={connector.uid}
                    onClick={() => connect({connector})}
                    variant="secondary"
                    fullWidth
                >
                    <span className="font-medium">{connector.name}</span>
                </Button>
            ))}
        </div>
    )
}
