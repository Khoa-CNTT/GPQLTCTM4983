import { userRoutes } from '@/api/user'
import { ICommonInformationForm } from '@/core/users/models/user.interface'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import toast from 'react-hot-toast'

export const useUpdateUser = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<ICommonInformationForm, any>({
    pathUrl: userRoutes.updateUser,
    method: 'patch',
    mutateOption: {
      onError: (error) => {
        if (error.response?.status) {
          return toast.error(`${(error.response?.data as { message: string }).message} !`)
        }
        opts?.callBackOnError?.()
      }
    }
  })
}

interface ISyncBalanceResponse {
  message: string;
  data: {
    message: string;
    amount: number;
  };
  statusCode: number;
}

export const useSyncBalance = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<{ accountSourceId: string }, ISyncBalanceResponse>({
    pathUrl: 'account-sources/sync-balance/:accountSourceId',
    method: 'post',
    mutateOption: {
      onSuccess: (data) => {
        toast.success(data.message)
        opts?.callBackOnSuccess?.()
      },
      onError: (error) => {
        if (error.response?.status) {
          return toast.error(`${(error.response?.data as { message: string }).message} !`)
        }
        opts?.callBackOnError?.()
      }
    }
  })
}
