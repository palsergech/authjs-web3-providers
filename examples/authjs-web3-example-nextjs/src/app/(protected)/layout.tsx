import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">AuthJS Web3</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
              <Link href="/api/auth/signout">
                <Button variant="outline">Sign Out</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
} 