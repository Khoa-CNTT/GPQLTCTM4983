import { fundSavingPlanRoutes } from '@/api/fund-saving-plant'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'

export const useRestoreFundSavingPlan = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<{ fundId: string }, any>({
    pathUrl: fundSavingPlanRoutes.restore,
    method: 'patch'
  })
}
