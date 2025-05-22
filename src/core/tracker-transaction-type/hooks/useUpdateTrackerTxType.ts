import { useMutationCustom } from '@/hooks/useMutationCustom'
import toast from 'react-hot-toast'
import { ITrackerTransactionTypeBody } from '../models/tracker-transaction-type.interface'
import { trackerTransactionTypeRoutes } from '../configs'
import { IUseQueryHookOptions } from '@/types/query.interface'

export const useUpdateTrackerTxType = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<ITrackerTransactionTypeBody, any>({
    pathUrl: trackerTransactionTypeRoutes.update,
    method: 'patch'
  })
}
