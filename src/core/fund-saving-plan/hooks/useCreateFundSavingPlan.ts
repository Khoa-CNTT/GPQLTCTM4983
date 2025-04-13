import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { ICreateFundSavingPlanRequest } from '../models'
import { fundSavingPlanRoutes } from '@/api/fund-saving-plant'

export const useCreateFundSavingPlan = (opts?: IUseQueryHookOptions) => {
    return useMutationCustom<ICreateFundSavingPlanRequest, any>({
        pathUrl: fundSavingPlanRoutes.create,
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
