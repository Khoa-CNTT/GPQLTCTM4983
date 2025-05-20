import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { fundSavingTargetRoutes } from '@/api/fund-saving-target'

export const useUpdateFundSavingPlanStatus = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<{ fundId: string }, any>({
    pathUrl: fundSavingTargetRoutes.updateStatus,
    method: 'patch'
  })
}
