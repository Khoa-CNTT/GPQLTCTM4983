import { useModelQuery } from '@/hooks/useQueryModel'
import { FUND_SAVING_TARGET_QUERY_KEY, FUND_SAVING_TARGET_RETRY } from '../constants'
import { fundSavingTargetRoutes } from '@/api/fund-saving-target'

export const useGetAllFundSavingTarget = (userId: string) => {
    const {
        isPending: isGetAllPending,
        data: getAllData,
        refetch: refetchAllData
    } = useModelQuery(FUND_SAVING_TARGET_QUERY_KEY, fundSavingTargetRoutes.getAll, {
        enable: !!userId,
        retry: FUND_SAVING_TARGET_RETRY,
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