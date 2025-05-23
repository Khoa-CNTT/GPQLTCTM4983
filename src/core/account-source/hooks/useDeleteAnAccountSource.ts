import { accountSourceRoutes } from '@/core/account-source/configs'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseGetAdvancedProps, IUseQueryHookOptions } from '@/types/query.interface'
import toast from 'react-hot-toast'

export const useDeleteAnAccountSource = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom({
    pathUrl: accountSourceRoutes.deleteAccountSource,
    method: 'delete'
  })
}
