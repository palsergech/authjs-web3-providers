'use client'

import { useSession } from 'next-auth/react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function ProfilePage() {
  const { data: session } = useSession()

  if (!session?.user) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Session Data</h3>
          <textarea 
            className="w-full h-32 p-2 text-sm font-mono bg-gray-50 border border-gray-200 rounded-md" 
            value={JSON.stringify(session, null, 2)} 
            readOnly
          />
        </div>
        <div className="space-y-4">
          {session.user.provider === 'github' && (
            <>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Username</h3>
                <p className="mt-1 text-sm text-gray-900">{session.user.username}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-sm text-gray-900">{session.user.email}</p>
              </div>
            </>
          )}
          {session.user.provider === 'siwe-csrf' && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="mt-1 text-sm font-mono text-gray-900">
                {session.user.address}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 