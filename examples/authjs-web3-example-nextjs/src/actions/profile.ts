'use server'

import { adapter, authOptions } from '@/authOptions'
import { AccountView } from '@/domain/user'
import { pgPool } from '@/tools/postgres/postgres'
import { getServerSession, Session } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { AdapterAccount } from 'next-auth/adapters'
import { OAuthConfig } from 'next-auth/providers/oauth'


async function requireCurrentUserId() {
  const session = await getServerSession(authOptions)
  // @ts-expect-error
  const userId = session?.user?.id
  if (!userId) {
    throw new Error('No user id found in the session')
  }
  return userId
}

export async function getCurrentUserName(): Promise<string | null> {
  const userId = await requireCurrentUserId()
  const user = await adapter.getUser!!(userId)
  return user?.name || null
}

export async function updateCurrentUserName(name: string): Promise<void> {
  const userId = await requireCurrentUserId()
  const user = await adapter.getUser!!(userId)
  if (!user) {
    throw new Error('User not found')
  }
  await adapter.updateUser!!({...user, name})
  revalidatePath('/profile')
}

export async function getLinkedAccounts(): Promise<AccountView[]> {
  const userId = await requireCurrentUserId()
  const accounts = await pgPool.query('select * from accounts where "userId" = $1', [userId])
  return Promise.all(accounts.rows.map(toAuthAccount))
}

export async function unlinkAccount(provider: string, providerAccountId: string) {
  const userId = await requireCurrentUserId()

  const account: AdapterAccount | null = await pgPool.query(
    'select * from accounts where "provider" = $1 and "providerAccountId" = $2',
    [provider, providerAccountId]
  ).then((res) => res.rows[0] as AdapterAccount | null)
  if (!account) {
    throw new Error('Account not found')
  }
  if (String(account.userId) !== userId) {
    throw new Error('Account not found')
  }
  await adapter.unlinkAccount!!({
    provider,
    providerAccountId
  })
} 

async function toAuthAccount(account: AdapterAccount): Promise<AccountView> {
  function requireCredentialsAccountData(account: AdapterAccount) {
    if (account.type !== 'email') {
      throw new Error(`Unknown account type: ${account.type}`)
    }
    return JSON.parse(account.id_token!!)
  }
  async function requireOauthAccountData(account: AdapterAccount) { 
    if (account.type !== "oauth") {
      throw new Error(`Unknown account type: ${account.type}`)
    }
    const provider = authOptions.providers.find(p => p.id === account.provider)
    if (!provider) {
      throw new Error(`Unknown provider: ${account.provider}`)
    }
    const oauthProvider = provider as OAuthConfig<any>
    if (typeof oauthProvider.userinfo === 'string') {
      throw new Error(`Userinfo endpoint is not set for provider: ${account.provider}`)
    }
    const res = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${account.access_token}`
      }
    })
    if (!res.ok) {
      throw new Error(`Failed to fetch user info for provider: ${account.provider}`)
    }
    const emailRes = await fetch("https://api.github.com/user/emails", {  
      headers: {
        Authorization: `Bearer ${account.access_token}`
      }
    })
    if (!emailRes.ok) {
      throw new Error(`Failed to fetch user emails for provider: ${account.provider}`)
    }
    return {
      ...(await res.json()),
      email: (await emailRes.json()).filter((e: any) => e.primary)[0]?.email
    }
  }
  switch(account.provider) {
    case 'github': {
      const data = await requireOauthAccountData(account)
      console.log("GITHUB DATA", data)
      return {
        provider: 'github',
        providerAccountId: account.providerAccountId,
        visibleName: data?.name ?? "",
        email: data.email,
        image: data.avatar_url ?? ""
      }
    }
    case 'solana': {
      const data = requireCredentialsAccountData(account)
      return {
        provider: 'solana',
        providerAccountId: account.providerAccountId,
        account: data.publicData.address
      }
    }
    case 'siwe-csrf': {
      const data = requireCredentialsAccountData(account)
      return {
        provider: 'siwe-csrf',
        providerAccountId: account.providerAccountId,
        address: data.publicData.address,
        chainId: 12
      }
    }
    default:
      throw new Error(`Unknown provider: ${account.provider}`)
  }
}