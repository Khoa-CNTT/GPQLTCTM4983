import { fundSavingPlanRoutes } from '@/api/fund-saving-plant'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import toast from 'react-hot-toast'

export const useDeleteFundSavingPlan = (opts?: IUseQueryHookOptions) => {
    return useMutationCustom<{ id: string }, any>({
        pathUrl: fundSavingPlanRoutes.delete,
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
