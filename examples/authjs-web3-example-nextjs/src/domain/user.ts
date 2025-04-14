export type Account =
    | GitHubAccount
    | SolanaAccount
    | EvmAccount

export type GitHubAccount = {
    provider: "github",
    visibleName: string,
    email: string,
    image?: string
}

export type SolanaAccount = {
    provider: "solana",
    account: string
}

export type EvmAccount = {
    provider: "siwe-csrf",
    address: string,
    chainId: number
}

export type Session = {
    loginAccount: Account
}