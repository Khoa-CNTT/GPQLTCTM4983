
import { fundSavingPlantRoutes } from '@/api/fund-saving-plant'
import { useModelQuery } from '@/hooks/useQueryModel'
import { IGetFundSavingTargettByIdParams } from '../models'
import { FUND_SAVING_TARBY_BY_ID_QUERY_KEY } from '../constants'
import { fundSavingTargetRoutes } from '@/api/fund-saving-target'

export const useGetFundSavingTargetById = ({ targetId, enable = true, condition = null }: IGetFundSavingTargettByIdParams) => {
    const { data, status: isPending } = useModelQuery(FUND_SAVING_TARBY_BY_ID_QUERY_KEY, fundSavingTargetRoutes.getById, {
        params: { targetId },
        enable,
        condition
    })
    return {
        data,
        isPending
    }
}