import { IUseQueryHookOptions } from '@/types/query.interface'
import { useDeleteAgentSubcription } from './useDeleteAgentSubcription'
import { useCreateAgenSubscribe } from './useCreateAgenSubscribe'
import { useGetAgentSubscription } from './useGetAgentSubscription'

export const useAgent = (opts?: IUseQueryHookOptions) => {
  const { mutate: subscribeToAgent, isPending: isSubscribing } = useCreateAgenSubscribe(opts)
  return {
    useGetAgentSubscription,
    isSubscribing,
    subscribeToAgent,
    useDeleteAgentSubcription
  }
}
