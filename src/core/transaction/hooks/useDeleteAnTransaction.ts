import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import toast from 'react-hot-toast'
import { ITransaction, IUpdateTransactionBody } from '../models'
import { transactionRoutes } from '../configs'

export const useDeleteAnTransaction = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom({
    pathUrl: transactionRoutes.deleteAnTransaction,
    method: 'delete'
  })
}
