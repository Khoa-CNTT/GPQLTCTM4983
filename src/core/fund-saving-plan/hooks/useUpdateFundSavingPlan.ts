import { fundSavingPlanRoutes } from '@/api/fund-saving-plant'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { IUpdateFundSavingPlanRequest } from '../models'

export const useUpdateFundSavingPlan = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<IUpdateFundSavingPlanRequest, any>({
    pathUrl: fundSavingPlanRoutes.update,
    method: 'patch'
  })
}
