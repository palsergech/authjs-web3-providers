'use client'

import { useSession } from 'next-auth/react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { TextArea } from '@/components/ui/TextArea'
import { AccountInfo } from '@/components/ui/profile/AccountInfo'
import { AccountView, AuthUser } from '@/domain/user'
import { useEffect, useState } from 'react'
import { getCurrentUserName, getLinkedAccounts } from '@/actions/profile'

export default function ProfilePage() {
  const { data: session } = useSession()

  const user = session?.user as AuthUser | undefined

  const [username, setUsername] = useState<string | null>(null)
  useEffect(() => {
    if (!user) return

    getCurrentUserName()
      .then(setUsername)
      .catch(e => alert("Failed to get username: " + e.message))
  }, [user?.id])

  const [linkedAccounts, setLinkedAccounts] = useState<AccountView[]>([])
  useEffect(() => {
    if (!user) return

    getLinkedAccounts()
      .then(setLinkedAccounts)
      .catch(e => alert("Failed to get linked accounts: " + e.message))
  }, [user?.id])

  const sessionString = JSON.stringify(session, null, 2)

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
            {linkedAccounts.map(account => (
              <div key={account.providerAccountId} className="mb-4">
                <AccountInfo 
                  account={account}
                  isLoginAccount={
                    account.providerAccountId === user?.loginAccount.providerAccountId 
                      && account.provider === user?.loginAccount.provider  }
                  unlinkable={linkedAccounts.length > 1}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 