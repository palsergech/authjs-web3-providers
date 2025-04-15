export type AccountView =
    | GitHubAccount
    | SolanaAccount
    | EvmAccount

export type BaseAccount<P extends string> = {
    provider: P,
    providerAccountId: string,
}

export type GitHubAccount = BaseAccount<"github"> & {
    visibleName: string,
    email: string,
    image?: string
}

export type SolanaAccount = BaseAccount<"solana"> & {
    account: string
}

export type EvmAccount = BaseAccount<"siwe-csrf"> & {
    address: string,
    chainId: number
}

export type AuthUser = {
    id: string,
    loginAccount: AccountView
}