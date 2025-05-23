import { trackerTransactionTypesRoutes } from '@/api/tracker-transaction-type'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import toast from 'react-hot-toast'

export const useDeleteTrackerType = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom({
    pathUrl: trackerTransactionTypesRoutes.delete,
    method: 'delete'
  })
}
