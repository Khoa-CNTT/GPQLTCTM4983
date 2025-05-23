import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { ITrackerTransactionResponse } from '../models/tracker-transaction.interface'
import { trackerTransactionRoutes } from '../configs'
import { ICreateTrackerTransactionBody } from '@/core/transaction/models'

export const useCreateTrackerTransaction = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<ICreateTrackerTransactionBody, ITrackerTransactionResponse>({
    pathUrl: trackerTransactionRoutes.create
  })
}
