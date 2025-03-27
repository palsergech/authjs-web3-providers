
export type User =
    {
        provider: "github",
        id: string,
        username: string,
        visibleName: string,
        email: string,
        image?: string
    }