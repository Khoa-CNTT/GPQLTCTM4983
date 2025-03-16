import { apiService } from '@/api'
import { USER_MODEL_KEY, USER_RETRY } from '@/core/users/constants'
import { useModelQuery } from '@/hooks/useQueryModel'
import { AUTH_FEATURE_4 } from '../constants'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

const authApi = apiService.authentication
export const useResendVerifyEmail = (email: string, enable: boolean) => {
  const {
    data: resendVerifyEmailData,
    isLoading: isSending,
    error: resendError,
    isSuccess
  } = useModelQuery<any>(AUTH_FEATURE_4, authApi.resendVerifyToken, {
    enable: !!email && enable === true,
    retry: USER_RETRY,
    params: {
      email: email
    }
  })

  useEffect(() => {
    if (resendError) {
      console.log('resendVerifyEmailData', resendVerifyEmailData)

      const errorMessage = (resendError as any)?.payload?.message || 'An error occurred. Please try again later!'
      toast.error(errorMessage)
    } else if (resendVerifyEmailData && enable === true) {
      toast.success('Please check your email to verify account!')
    }
  }, [resendError, resendVerifyEmailData])

  return { isSending, isSuccess, resendVerifyEmailData }
}
