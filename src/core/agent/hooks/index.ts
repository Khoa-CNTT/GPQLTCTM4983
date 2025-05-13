import { IUseQueryHookOptions } from '@/types/query.interface'
import { useDeleteAgentSubscription } from './useDeleteAgentSubscription'
import { useCreateAgentSubscribe } from './useCreateAgentSubscribe'
import { useGetAgentSubscription } from './useGetAgentSubscription'

export const useAgent = (opts?: IUseQueryHookOptions) => {
  const { mutate: subscribeToAgent, isPending: isSubscribing } = useCreateAgentSubscribe(opts)
  return {
    useGetAgentSubscription,
    isSubscribing,
    subscribeToAgent,
    useDeleteAgentSubscription
  }
}
