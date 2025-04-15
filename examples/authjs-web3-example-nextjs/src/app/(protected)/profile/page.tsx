'use client'

import { useSession } from 'next-auth/react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { TextArea } from '@/components/ui/TextArea'
import { AccountInfo } from '@/components/ui/profile/AccountInfo'
import { AccountView, AuthUser } from '@/lib/user'
import { useEffect, useState } from 'react'
import { getCurrentUserName, getLinkedAccounts } from '@/actions/profile'
import { providerInfo } from '@/lib/providerInfo'
export default function ProfilePage() {
  const { data: session } = useSession()
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const user = session?.user as AuthUser | undefined
  useEffect(() => {
    if (!user) return

    getCurrentUserName()
      .then(setUsername)
      .catch(e => alert("Failed to get username: " + e.message))
  }, [user?.id])

  const updateLinkedAccounts = () => {
    setLoading(true)
    getLinkedAccounts()
      .then(setLinkedAccounts)
      .catch(e => alert("Failed to get linked accounts: " + e.message))
      .finally(() => setLoading(false))
  }

  const [linkedAccounts, setLinkedAccounts] = useState<AccountView[]>([])
  useEffect(() => {
    if (!user) return
    updateLinkedAccounts()
  }, [user?.id])

  const sessionString = JSON.stringify(session, null, 2)

  const linkedAccountsByProvider = Object.keys(providerInfo)
      .map(provider => ({
        providerId: provider,
        account: linkedAccounts.find(account => account.provider === provider)
      }))
      .sort((a, b) => {
        if (a.account && !b.account) return -1
        if (!a.account && b.account) return 1
        return 0
      })


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                <p className="mt-1 text-sm font-mono text-gray-900">
                  {user?.id}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Username</h3>
                <p className="mt-1 text-sm font-mono text-gray-900">
                  {username ?? 'Not set'}
                </p>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <TextArea
              label="Session Data"
              value={sessionString}
              readOnly
            />
          </div>
          <div>
            <h3>Linked Accounts</h3>
            {linkedAccountsByProvider.map(account => (
              <div key={account.providerId} className="mb-4">
                <AccountInfo 
                  account={account.account}
                  providerId={account.providerId as keyof typeof providerInfo}
                  isLoginAccount={
                    account.account?.providerAccountId === user?.loginAccount.providerAccountId 
                      && account.account?.provider === user?.loginAccount.provider  }
                  unlinkable={linkedAccounts.length > 1}
                  onUnlink={() => {
                    alert("Account unlinked")
                    updateLinkedAccounts()
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 