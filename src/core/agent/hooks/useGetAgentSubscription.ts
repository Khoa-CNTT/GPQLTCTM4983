import { useModelQuery } from '@/hooks/useQueryModel'
import { AGENT_MODEL_RETRY, AGENT_SUBSCRIPTION_KEY } from '../constants'
import { agentRoutes } from '../configs'
import { IAgentSubscriptionStatus } from '../models/agent.interface'
import { IBaseResponseData } from '@/types/common.i'
import { IUseGetAdvancedProps } from '@/types/query.interface'

export const useGetAgentSubscription = (props: IUseGetAdvancedProps) => {
  const {
    data: getAllDataAgent,
    status: isCheckingSubscription,
    refetch: refetchSubscriptionStatus
  } = useModelQuery<IBaseResponseData<IAgentSubscriptionStatus[]>>(
    AGENT_SUBSCRIPTION_KEY,
    agentRoutes.checkSubscription,
    {
      retry: AGENT_MODEL_RETRY,
      query: props.query,
      enable: !!props.fundId,
      params: {
        fundId: props.fundId
      }
    }
  )

  return {
    getAllDataAgent,
    isCheckingSubscription,
    refetchSubscriptionStatus
  }
}
