import { accountSourceRoutes } from '@/core/account-source/configs'
import { IAccountSourceTransfer, IAccountSourceTransferResponse } from '@/core/account-source/models'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import toast from 'react-hot-toast'

export const useTransferAccountSource = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<IAccountSourceTransfer, IAccountSourceTransferResponse>({
    pathUrl: accountSourceRoutes.transferAccountSource,
    method: 'patch',
    mutateOption: {
      onError: (error: Error | any) => {
        if (error.response?.status === 401) {
          return toast.error(`${error?.response?.data?.messages} !`)
        }
        opts?.callBackOnError?.()
      }
    }
  })
} 