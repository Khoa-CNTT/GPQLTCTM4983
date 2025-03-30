import { IUseQueryHookOptions } from '@/types/query.interface'
import { useCreateFundSavingTarget } from './useCreateFundSavingTarget'
import { useGetAllFundSavingTarget } from './useGetAllFundSavingTarget'
import { useUpdateFundSavingTarget } from './useUpdateFundSavingTarget'
import { useDeleteFundSavingTarget } from './useDeleteFundSavingTarget'
import { useRestoreFundSavingTarget } from './useRestoreFundSavingTarget'
import { useGetFundSavingTargetById } from './useGetFundSavingTargetById'
import { useUpdateFundSavingTargetStatus } from './useUpdateFundSavingTargetStatus'

export const useFundSavingTarget = (opts?: IUseQueryHookOptions) => {
    const { mutate: createFundSavingTarget, status: statusCreate } = useCreateFundSavingTarget(opts)
    const { mutate: updateFundSavingTarget, status: statusUpdate } = useUpdateFundSavingTarget(opts)
    const { mutate: deleteFundSavingTarget, status: statusDelete } = useDeleteFundSavingTarget(opts)
    const { mutate: restoreFundSavingTarget, status: statusRestore } = useRestoreFundSavingTarget(opts)
    const { mutate: updateFundSavingTargetStatus, status: statusUpdateStatus } = useUpdateFundSavingTargetStatus(opts)

    return {
        createFundSavingTarget,
        statusCreate,
        updateFundSavingTarget,
        statusUpdate,
        deleteFundSavingTarget,
        statusDelete,
        restoreFundSavingTarget,
        statusRestore,
        updateFundSavingTargetStatus,
        statusUpdateStatus,
        getAllFundSavingTarget: useGetAllFundSavingTarget,
        getFundSavingTargetById: useGetFundSavingTargetById
    }
}