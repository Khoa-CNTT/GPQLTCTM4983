import { accountSourceRoutes } from '@/core/account-source/configs'
import { IAccountSourceBody, IAccountSourceResponse } from '@/core/account-source/models'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'

export const useUpdateAccountSource = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<IAccountSourceBody, IAccountSourceResponse>({
    pathUrl: accountSourceRoutes.updateAccountSource,
    method: 'patch'
  })
}
