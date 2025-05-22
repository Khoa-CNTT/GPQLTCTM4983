import { fundSavingTargetRoutes } from '@/api/fund-saving-target'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'

export const useRestoreFundSavingTarget = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<{ fundId: string }, any>({
    pathUrl: fundSavingTargetRoutes.restore,
    method: 'patch'
  })
}
