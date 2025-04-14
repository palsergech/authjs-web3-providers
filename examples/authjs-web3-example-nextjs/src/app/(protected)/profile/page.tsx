'use client'

import { useSession } from 'next-auth/react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { TextArea } from '@/components/ui/TextArea'
import { AccountInfo } from '@/components/ui/AccountInfo'
import { Account } from '@/domain/user'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [loginAccount, setLoginAccount] = useState<Account | null>(null)

  useEffect(() => {
    if (session?.user?.loginAccount) {
      setLoginAccount(session.user.loginAccount as Account)
    }
  }, [session, status])

  const sessionString = JSON.stringify(session, null, 2)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <TextArea
              label="Session Data"
              value={sessionString}
              readOnly
            />
          </div>
          {loginAccount && (
            <div>
              <h3>Logged In with</h3>
              <AccountInfo account={loginAccount} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 