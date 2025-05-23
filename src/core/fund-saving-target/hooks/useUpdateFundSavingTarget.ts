import { useMutationCustom } from '@/hooks/useMutationCustom'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { fundSavingTargetRoutes } from '@/api/fund-saving-target'
import { IUpdateFundSavingTargetRequest } from '../models'

export const useUpdateFundSavingTarget = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<IUpdateFundSavingTargetRequest, any>({
    pathUrl: fundSavingTargetRoutes.update,
    method: 'patch'
  })
}
