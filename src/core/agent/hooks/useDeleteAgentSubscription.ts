import { useModelQuery } from '@/hooks/useQueryModel'
import { agentRoutes } from '../configs'
import { IAgentSubscriptionResponse } from '../models/agent.interface'
import { IBaseResponseData } from '@/types/common.i'
import { AGENT_MODEL_RETRY, AGENT_SUBSCRIPTION_KEY } from '../constants'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

export const useDeleteAgentSubscription = (props: {
  unsubscribeData: {
    id: string
    execute: boolean
  }
  setUnsubscribeData: React.Dispatch<
    React.SetStateAction<{
      id: string
      execute: boolean
    }>
  >
  refetchSubscriptionStatus: () => void
}) => {
  const {
    isPending: isUnsubscribing,
    data: unsubscribeResult,
    error: unsubscribeError
  } = useModelQuery<IBaseResponseData<IAgentSubscriptionResponse>>(AGENT_SUBSCRIPTION_KEY, agentRoutes.unsubscribe, {
    enable: !!props.unsubscribeData.id && !!props.unsubscribeData.execute,
    params: { id: props.unsubscribeData.id },
    retry: AGENT_MODEL_RETRY
  })

  useEffect(() => {
    if (unsubscribeError) {
      const errorMessage = (unsubscribeError as any)?.payload?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau!'
      toast.error(errorMessage)
    } else if (unsubscribeResult) {
      toast.success('Hủy đăng ký thành công!')
      props.setUnsubscribeData({ id: '', execute: false })
      props.refetchSubscriptionStatus()
    }
  }, [unsubscribeError, unsubscribeResult])

  return { isUnsubscribing, unsubscribeResult }
}
