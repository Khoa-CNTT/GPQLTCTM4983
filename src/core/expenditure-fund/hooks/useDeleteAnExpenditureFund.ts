import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import toast from 'react-hot-toast'
import { expenditureFundRoutes } from '../configs'

export const useDeleteAnExpenditureFund = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom({
    pathUrl: expenditureFundRoutes.deleteExpenditureFund,
    method: 'delete'
  })
}
