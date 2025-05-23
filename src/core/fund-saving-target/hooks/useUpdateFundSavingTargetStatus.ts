import { fundSavingTargetRoutes } from '@/api/fund-saving-target'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'

export const useUpdateFundSavingTargetStatus = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<{ fundId: string }, any>({
    pathUrl: fundSavingTargetRoutes.updateStatus,
    method: 'patch'
  })
}
