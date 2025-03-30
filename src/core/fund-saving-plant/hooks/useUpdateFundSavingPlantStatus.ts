import { fundSavingPlantRoutes } from '@/api/fund-saving-plant'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { IUpdateFundSavingPlantStatusParams } from '../models'
import { fundSavingTargetRoutes } from '@/api/fund-saving-target'

export const useUpdateFundSavingPlantStatus = (opts?: IUseQueryHookOptions) => {
    return useMutationCustom<{ targetId: string }, any>({
        pathUrl: fundSavingTargetRoutes.updateStatus,
        method: 'patch',
        mutateOption: {
            onError: (error: AxiosError | any) => {
                if (error.response?.status === 401) {
                    return toast.error(`${error?.response?.data?.messages} !`)
                }
                opts?.callBackOnError?.()
            }
        }
    })
}