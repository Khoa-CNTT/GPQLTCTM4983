import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { ITrackerTransactionTypeBody } from '../models/tracker-transaction-type.interface'
import { trackerTransactionTypeRoutes } from '../configs'

export const useCreateTrackerTxType = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<ITrackerTransactionTypeBody, any>({
    pathUrl: trackerTransactionTypeRoutes.create
  })
}
