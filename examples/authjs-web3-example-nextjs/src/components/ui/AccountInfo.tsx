import { Account } from '@/domain/user'
import { Card, CardHeader, CardTitle, CardContent } from './Card'
import { 
  UserCircleIcon,
  EnvelopeIcon, 
  WalletIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

const providerInfo = {
  'github': {
    name: 'GitHub',
    icon: GlobeAltIcon,
    color: 'text-gray-900'
  },
  'siwe-csrf': {
    name: 'Ethereum',
    icon: WalletIcon, 
    color: 'text-blue-600'
  },
  'solana': {
    name: 'Solana',
    icon: WalletIcon,
    color: 'text-purple-600'
  }
}

interface AccountInfoProps {
  account: Account
}

export function AccountInfo({ account }: AccountInfoProps) {
  const provider = providerInfo[account.provider]

  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          {account.provider === 'github' && (
            <>
              <div className="flex items-center space-x-3">
                <UserCircleIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Username</h3>
                  <p className="mt-1 text-sm text-gray-900">{account.visibleName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-sm text-gray-900">{account.email}</p>
                </div>
              </div>
            </>
          )}
          {account.provider === 'siwe-csrf' && (
            <div className="flex items-center space-x-3">
              <WalletIcon className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="mt-1 text-sm font-mono text-gray-900">
                  {account.address}
                </p>
              </div>
            </div>
          )}
          {account.provider === 'solana' && (
            <div className="flex items-center space-x-3">
              <WalletIcon className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Account</h3>
                <p className="mt-1 text-sm font-mono text-gray-900">
                  {account.account}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 