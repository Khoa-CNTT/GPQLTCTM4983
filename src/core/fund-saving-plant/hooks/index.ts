import { IUseQueryHookOptions } from '@/types/query.interface'
import { useGetAllFundSavingPlan } from './useGetAllFundSavingPlan'
import { useCreateFundSavingPlan } from './useCreateFundSavingPlan'
import { useUpdateFundSavingPlan } from './useUpdateFundSavingPlan'
import { useRestoreFundSavingPlan } from './useRestoreFundSavingPlan'
import { useUpdateFundSavingPlanStatus } from './useUpdateFundSavingPlanStatus'
import { useDeleteFundSavingPlan } from './useDeleteFundSavingPlan'

export const useFundSavingPlan = (opts?: IUseQueryHookOptions) => {
    const { mutate: createFundSavingPlan, status: statusCreate } = useCreateFundSavingPlan(opts)
    const { mutate: updateFundSavingPlan, status: statusUpdate } = useUpdateFundSavingPlan(opts)
    const { mutate: deleteFundSavingPlan, status: statusDelete } = useDeleteFundSavingPlan(opts)
    const { mutate: restoreFundSavingPlan, status: statusRestore } = useRestoreFundSavingPlan(opts)
    const { mutate: updateFundSavingPlanStatus, status: statusUpdateStatus } = useUpdateFundSavingPlanStatus(opts)

    return {
        createFundSavingPlan,
        statusCreate,
        updateFundSavingPlan,
        statusUpdate,
        deleteFundSavingPlan,
        statusDelete,
        restoreFundSavingPlan,
        statusRestore,
        updateFundSavingPlanStatus,
        statusUpdateStatus,
        getAllFundSavingPlan: useGetAllFundSavingPlan,
    }
}
