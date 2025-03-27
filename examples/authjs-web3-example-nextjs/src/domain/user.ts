export type User =
    | GitHubUser
    | EthereumUser

export type GitHubUser = {
    provider: "github",
    id: string,
    username: string,
    visibleName: string,
    email: string,
    image?: string
}

export type EthereumUser = {
    provider: "siwe-csrf",
    address: string
}