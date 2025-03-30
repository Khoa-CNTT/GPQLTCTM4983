import { IUseQueryHookOptions } from '@/types/query.interface'
import { useCreateFundSavingPlant } from './useCreateFundSavingPlant'
import { useGetAllFundSavingPlant } from './useGetAllFundSavingPlant'
import { useUpdateFundSavingPlant } from './useUpdateFundSavingPlant'
import { useDeleteFundSavingPlant } from './useDeleteFundSavingPlant'
import { useRestoreFundSavingPlant } from './useRestoreFundSavingPlant'
import { useUpdateFundSavingPlantStatus } from './useUpdateFundSavingPlantStatus'
import { useGetFundSavingPlantById } from './useGetFundSavingPlantById'

export const useFundSavingPlant = (opts?: IUseQueryHookOptions) => {
    const { mutate: createFundSavingPlant, status: statusCreate } = useCreateFundSavingPlant(opts)
    const { mutate: updateFundSavingPlant, status: statusUpdate } = useUpdateFundSavingPlant(opts)
    const { mutate: deleteFundSavingPlant, status: statusDelete } = useDeleteFundSavingPlant(opts)
    const { mutate: restoreFundSavingPlant, status: statusRestore } = useRestoreFundSavingPlant(opts)
    const { mutate: updateFundSavingPlantStatus, status: statusUpdateStatus } = useUpdateFundSavingPlantStatus(opts)

    return {
        createFundSavingPlant,
        statusCreate,
        updateFundSavingPlant,
        statusUpdate,
        deleteFundSavingPlant,
        statusDelete,
        restoreFundSavingPlant,
        statusRestore,
        updateFundSavingPlantStatus,
        statusUpdateStatus,
        getAllFundSavingPlant: useGetAllFundSavingPlant,
        getFundSavingPlantById: useGetFundSavingPlantById
    }
}