import { expenditureFundRoutes } from '../configs'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { ICreateFundSavingPlantRequest } from '../models'

export const useCreateFundSavingPlant = (opts?: IUseQueryHookOptions) => {
    return useMutationCustom<ICreateFundSavingPlantRequest, any>({
        pathUrl: expenditureFundRoutes.create,
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