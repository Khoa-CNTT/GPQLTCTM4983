import { fundSavingPlantRoutes } from '@/api/fund-saving-plant'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import toast from 'react-hot-toast'

export const useDeleteFundSavingPlant = (opts?: IUseQueryHookOptions) => {
    return useMutationCustom({
        pathUrl: fundSavingPlantRoutes.delete,
        method: 'delete',
        mutateOption: {
            onError: (error: Error | any) => {
                if (error.response?.status === 401) {
                    return toast.error(`${error?.response?.data?.messages} !`)
                }
                opts?.callBackOnError?.()
            }
        }
    })
}