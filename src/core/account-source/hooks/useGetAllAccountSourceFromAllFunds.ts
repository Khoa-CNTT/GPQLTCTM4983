import { accountSourceRoutes } from '@/core/account-source/configs'
import { ACCOUNT_SOURCE_RETRY_QUERY, GET_ALL_ACCOUNT_SOURCE_KEY } from '@/core/account-source/constants'
import { IAdvancedAccountSourceResponse } from '@/core/account-source/models'
import { useModelQuery } from '@/hooks/useQueryModel'

export const useGetAllAccountSourceFromAllFunds = () => {
  const {
    isPending: isGetAllFundsPending,
    data: getAllFundsData,
    refetch: refetchAllFundsData
  } = useModelQuery<IAdvancedAccountSourceResponse>(
    `${GET_ALL_ACCOUNT_SOURCE_KEY}_all_funds`,
    accountSourceRoutes.getAllFromAllFunds,
    {
      enable: true,
      retry: ACCOUNT_SOURCE_RETRY_QUERY
    }
  )
  
  return {
    isGetAllFundsPending,
    getAllFundsData,
    refetchAllFundsData
  }
} 