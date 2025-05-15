import { useModelQuery } from '@/hooks/useQueryModel'
import { authServices } from '../configs'
import { AUTH_RETRY, AUTH_FEATURE_3 } from '@/core/auth/constants'
import toast from 'react-hot-toast'
import { useEffect, useCallback } from 'react'
import { IUserGetMeResponse } from '@/types/user.i'
import { useRouter } from 'next/navigation'
import { setAccessTokenToLocalStorage } from '@/libraries/helpers'
import Cookies from 'js-cookie'

export const useVerifyToken = () => {
  const refreshToken = Cookies.get('refreshToken')
  const accessToken = Cookies.get('accessToken')

  if (!refreshToken || !accessToken) {
    return {
      isVerifyingToken: false,
      verifyTokenData: null,
      verifyTokenError: null
    }
  }
  const router = useRouter()
  const {
    isPending: isVerifyingToken,
    data: verifyTokenData,
    error: verifyTokenError
  } = useModelQuery<IUserGetMeResponse>(AUTH_FEATURE_3, authServices.verifyToken, {
    retry: AUTH_RETRY
  })
  useEffect(() => {
    if (verifyTokenData) {
      const { accessToken } = verifyTokenData.data
      setAccessTokenToLocalStorage(accessToken as string)
    }
  }, [verifyTokenData])

  const handleRedirectToLogin = useCallback(() => {
    const errorMessage = (verifyTokenError as any)?.payload?.message || 'Session expired. Please log in again.'
    toast.error(errorMessage)
    router.push('/sign-in')
  }, [verifyTokenError, router])

  return {
    isVerifyingToken,
    verifyTokenData,
    verifyTokenError,
    handleRedirectToLogin
  }
}
