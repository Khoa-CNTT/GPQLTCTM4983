import { fundSavingPlantRoutes } from '@/api/fund-saving-plant'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { IUpdateFundSavingPlantParams } from '../models'

export const useUpdateFundSavingPlant = (opts?: IUseQueryHookOptions) => {
    return useMutationCustom<IUpdateFundSavingPlantParams, any>({
        pathUrl: fundSavingPlantRoutes.update,
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