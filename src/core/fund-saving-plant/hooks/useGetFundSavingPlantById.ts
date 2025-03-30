import { fundSavingPlantRoutes } from '@/api/fund-saving-plant'
import { useModelQuery } from '@/hooks/useQueryModel'
import { IGetFundSavingPlantByIdParams, ISpendingPlan } from '../models'

export const useGetFundSavingPlantById = ({ plantId, enable = true, condition = null }: IGetFundSavingPlantByIdParams) => {
    const { data, isPending } = useModelQuery<ISpendingPlan>('fund-saving-plant', fundSavingPlantRoutes.getById, {
        params: { plantId },
        enable,
        condition
    })
    return {
        data,
        isPending
    }
}