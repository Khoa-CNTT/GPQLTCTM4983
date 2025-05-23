import { useMutationCustom } from '../../../hooks/useMutationCustom'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { ICreateFundSavingTargetRequest } from '../models'
import { fundSavingTargetRoutes } from '@/api/fund-saving-target'

export const useCreateFundSavingTarget = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<ICreateFundSavingTargetRequest, any>({
    pathUrl: fundSavingTargetRoutes.create
  })
}
