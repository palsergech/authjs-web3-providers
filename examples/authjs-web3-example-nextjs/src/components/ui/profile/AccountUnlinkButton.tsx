import { Spinner } from "../Spinner"
import { TrashIcon } from "@heroicons/react/24/outline"
import { Button } from "../Button"
import { AccountView } from "@/lib/user"
import { unlinkAccount } from "@/actions/profile"
import { useState } from "react"

export default function AccountUnlinkButton({ account, onUnlink }: { account: AccountView, onUnlink?: () => void }) {
    const [isLoading, setIsLoading] = useState(false)
    function unlink() {
      setIsLoading(true)
      unlinkAccount(account.provider, account.providerAccountId)
        .then(() => {
            onUnlink?.()
        })
        .catch((error) => {
          alert('Failed to unlink account')
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
    return isLoading ? (
        <Spinner className="h-5 w-5 text-red-600" />
    ) : (
          <Button variant="outline" onClick={unlink}>
            <TrashIcon className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-600">Unlink</span>
          </Button>
    )
  }     