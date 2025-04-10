import WalletProvider from "@/components/ethereum/EthereumWalletProvider";
import {ReactNode} from "react";

export default function SiweLoginLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <div>
            <WalletProvider>
                {children}
            </WalletProvider>
        </div>
    )
}
