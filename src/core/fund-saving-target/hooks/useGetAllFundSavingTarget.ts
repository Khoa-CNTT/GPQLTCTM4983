import { useModelQuery } from '@/hooks/useQueryModel'
import { FUND_SAVING_TARGET_QUERY_KEY, FUND_SAVING_TARGET_RETRY } from '../constants'
import { fundSavingTargetRoutes } from '@/api/fund-saving-target'
import { IGetAllDataFundSavingTargetResponse } from '../models'

export const useGetAllFundSavingTarget = (fundId: string) => {
    const {
        isPending: isGetAllPending,
        data: getAllData,
        refetch: refetchAllData
    } = useModelQuery<IGetAllDataFundSavingTargetResponse>(FUND_SAVING_TARGET_QUERY_KEY, fundSavingTargetRoutes.getAll, {
        enable: !!fundId,
        retry: FUND_SAVING_TARGET_RETRY,
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
