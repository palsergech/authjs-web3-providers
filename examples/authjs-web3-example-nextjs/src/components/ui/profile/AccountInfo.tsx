import { AccountView, BaseAccount } from '@/lib/user'
import { Card, CardHeader, CardTitle, CardContent } from '../Card'
import {
  UserCircleIcon,
  EnvelopeIcon,
  WalletIcon,
  GlobeAltIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import AccountUnlinkButton from './AccountUnlinkButton'
import { mainnet } from 'viem/chains'
import { Chain } from 'viem'
import { useMemo } from 'react'
import { AddAccount } from './AddAccount'
import { providerInfo } from '@/lib/providerInfo'

function EvmChainIdToName(chainId: number): Chain {
  return mainnet
}

interface AccountInfoProps {
  providerId: keyof typeof providerInfo,
  account?: AccountView,
  unlinkable?: boolean,
  isLoginAccount?: boolean,
  onUnlink?: () => void
}

export function AccountInfo({ 
  providerId,
  account,
  isLoginAccount,
  unlinkable,
  onUnlink
}: AccountInfoProps) {
  const provider = providerInfo[providerId]

  const chain = useMemo(() => {
    if (account?.provider === 'siwe-csrf') {
      return EvmChainIdToName(account.chainId)
    }
    return null
  }, [account])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          {provider.icon && (
            <provider.icon className={`h-5 w-5 ${provider.color}`} />
          )}
          <span className="font-bold">
            {provider.name}
          </span>
          {isLoginAccount && (
            <CheckIcon className="h-5 w-5 text-green-600" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {
          account ? (
            <div className="space-y-4">
              {account.provider === 'github' && account.image && (
                <div className="flex items-center space-x-3">
                  <img
                    src={account.image}
                    alt={`${account.visibleName}'s avatar`}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2"  >
                      <UserCircleIcon className="h-5 w-5 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900">{account.visibleName}</p>
                    </div>
                    <div className="flex items-center space-x-2"  >
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900">{account.email}</p>
                    </div>
                  </div>
                  {unlinkable && <AccountUnlinkButton account={account} onUnlink={onUnlink}/>}
                </div>
              )}
              {account.provider === 'siwe-csrf' && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-3">
                    <div>
                      {chain && <p className="mt-1 text-sm font-mono text-gray-900">
                        {chain.name}
                      </p>}
                      <p className="mt-1 text-sm font-mono text-gray-900">
                        {account.address}
                      </p>
                    </div>
                  </div>
                  {unlinkable && <AccountUnlinkButton account={account} onUnlink={onUnlink} />}
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
                  {unlinkable && <AccountUnlinkButton account={account} onUnlink={onUnlink} />}
                </div>
              )}
            </div>
          ) : <AddAccount providerId={providerId} mode="link" />
        }
      </CardContent>
    </Card>
  )
}
