import { useModelQuery } from '@/hooks/useQueryModel'
import { agentRoutes } from '../configs'
import { IAgentSubscriptionResponse, IAgentSubscriptionStatus } from '../models/agent.interface'
import { IBaseResponseData } from '@/types/common.i'
import { AGENT_MODEL_RETRY, AGENT_SUBSCRIPTION_KEY } from '../constants'

export const useDeleteAgentSubcription = (id?: string) => {
  const {
    data: unsubscribeResult,
    status: isUnsubscribing,
    refetch: executeUnsubscribe
  } = useModelQuery<IBaseResponseData<IAgentSubscriptionResponse>>(AGENT_SUBSCRIPTION_KEY, agentRoutes.unsubscribe, {
    retry: AGENT_MODEL_RETRY
  })

  return {
    unsubscribeResult,
    isUnsubscribing,
    executeUnsubscribe
  }
}
