import { accountSourceRoutes } from '@/core/account-source/configs'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseGetAdvancedProps, IUseQueryHookOptions } from '@/types/query.interface'
import toast from 'react-hot-toast'
import { trackerTransactionRoutes } from '../configs'

export const useDeleteAnTrackerTransaction = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom({
    pathUrl: trackerTransactionRoutes.deleteAnTrackerTransaction,
    method: 'delete'
  })
}
