import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import toast from 'react-hot-toast'
import { trackerTransactionRoutes } from '../configs'
import { ITrackerTransaction, IUpdateTrackerTransactionBody } from '../models/tracker-transaction.interface'

export const useUpdateTrackerTransaction = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<IUpdateTrackerTransactionBody, ITrackerTransaction>({
    pathUrl: trackerTransactionRoutes.update,
    method: 'patch'
  })
}
