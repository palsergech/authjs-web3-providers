'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function HomePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to AuthJS Web3 Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This is a demonstration of the AuthJS Web3 Providers library. You are now authenticated and can access protected routes.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Ethereum wallet authentication</li>
            <li>Solana wallet authentication</li>
            <li>GitHub OAuth integration</li>
            <li>Secure session management</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
} 