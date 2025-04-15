'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Logo } from '@/components/ui/Logo'
import { FeatureList } from '@/components/ui/FeatureList'
import Link from 'next/link'

const features = [
  'Ethereum wallet authentication',
  'Solana wallet authentication',
  'GitHub OAuth integration',
  'Secure session management'
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen py-12">
          <div className="text-center space-y-8">
            {/* Logo and Title */}
            <div className="space-y-4">
              <Logo size="lg" className="mx-auto" />
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                AuthJS Web3 Providers
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                A powerful authentication solution for Web3 applications, supporting Ethereum and Solana wallets.
              </p>
            </div>

            {/* Demo Info */}
            <Card variant="info" className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-blue-900">Demo Project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  This is a demonstration of the AuthJS Web3 Providers library. Experience seamless authentication with:
                </p>
                <FeatureList features={features} />
              </CardContent>
            </Card>

            {/* Login Button */}
            <div className="pt-8">
              <Link href="/signin">
                <Button size="lg" className="px-8">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 