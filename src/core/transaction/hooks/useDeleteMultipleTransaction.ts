import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import toast from 'react-hot-toast'
import { transactionRoutes } from '../configs'

export const useDeleteMultipleTransaction = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom({
    pathUrl: transactionRoutes.deleteMultipleTransaction,
    method: 'delete'
  })
}
