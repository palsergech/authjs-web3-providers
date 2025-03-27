'use client'

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {wagmiConfig} from "@/tools/wagmi/config";
import React from "react";
import {WagmiProvider} from "wagmi";

const queryClient = new QueryClient()

export default function WalletProvider({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}