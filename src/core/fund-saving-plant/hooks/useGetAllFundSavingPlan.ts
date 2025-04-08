import { FUND_SAVING_PLANT_RETRY_QUERY, GET_ALL_FUND_SAVING_PLANT_KEY } from '@/core/fund-saving-plant/constants'
import { useModelQuery } from '@/hooks/useQueryModel'
import { IGetAllFundSavingPlanResponse } from '../models'
import { fundSavingPlanRoutes } from '@/api/fund-saving-plant'

export const useGetAllFundSavingPlan = (fundId: string) => {
    const {
        isPending: isGetAllPending,
        data: getAllData,
        refetch: refetchAllData
    } = useModelQuery<IGetAllFundSavingPlanResponse>(GET_ALL_FUND_SAVING_PLANT_KEY, fundSavingPlanRoutes.getAll, {
        enable: !!fundId,
        retry: FUND_SAVING_PLANT_RETRY_QUERY,
        params: {
            fundId
        }
    })
    return {
        isGetAllPending,
        getAllData,
        refetchAllData
    }
}
