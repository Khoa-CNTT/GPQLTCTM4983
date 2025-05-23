import { accountSourceRoutes } from '@/core/account-source/configs'
import { IAccountSourceBody, IAccountSourceResponse } from '@/core/account-source/models'
import { handleQueryError } from '@/errorHandler'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import axios from 'axios'
import toast from 'react-hot-toast'

export const useCreateAccountSource = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<IAccountSourceBody, IAccountSourceResponse>({
    pathUrl: accountSourceRoutes.createAccountSource
  })
}
