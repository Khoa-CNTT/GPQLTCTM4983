import { expenditureFundRoutes } from '@/core/fund-saving-plant/configs'
import { FUND_SAVING_PLANT_RETRY_QUERY, GET_ALL_FUND_SAVING_PLANT_KEY } from '@/core/fund-saving-plant/constants'
import { IGetAllFundSavingPlantResponse, ISpendingPlan } from '@/core/fund-saving-plant/models'
import { useModelQuery } from '@/hooks/useQueryModel'

export const useGetAllFundSavingPlant = (userId: string) => {
    const {
        isPending: isGetAllPending,
        data: getAllData,
        refetch: refetchAllData
    } = useModelQuery<IGetAllFundSavingPlantResponse>(GET_ALL_FUND_SAVING_PLANT_KEY, expenditureFundRoutes.getAll, {
        enable: !!userId,
        retry: FUND_SAVING_PLANT_RETRY_QUERY,
        params: {
            userId
        }
    })
    return {
        isGetAllPending,
        getAllData,
        refetchAllData
    }
}