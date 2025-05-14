import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { IAgentSubscriptionBody, IAgentSubscriptionResponse } from '../models/agent.interface'
import { agentRoutes } from '../configs'

export const useCreateAgentSubscribe = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<IAgentSubscriptionBody, IAgentSubscriptionResponse>({
    pathUrl: agentRoutes.subscribe,
    mutateOption: {
      onError: (error: AxiosError | any) => {
        if (error.response?.status === 401) {
          return toast.error(`${error?.response?.data?.messages} !`)
        }
        toast.error(error?.response?.data?.message || 'Failed to subscribe to AI Agent')
        opts?.callBackOnError?.()
      },
      onSuccess: (data) => {
        toast.success('Successfully subscribed to AI Agent service')
        opts?.callBackOnError?.()
      }
    }
  })
}
