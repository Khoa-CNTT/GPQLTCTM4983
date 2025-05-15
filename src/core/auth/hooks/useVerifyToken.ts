import { useModelQuery } from '@/hooks/useQueryModel'
import { authServices } from '../configs'
import { AUTH_RETRY, AUTH_FEATURE_3 } from '@/core/auth/constants'
import toast from 'react-hot-toast'
import { useEffect, useCallback, useState } from 'react'
import { IUserGetMeResponse } from '@/types/user.i'
import { useRouter } from 'next/navigation'
import { setAccessTokenToLocalStorage } from '@/libraries/helpers'
import Cookies from 'js-cookie'

export const useVerifyToken = () => {
  const refreshToken = Cookies.get('refreshToken')
  const accessToken = Cookies.get('accessToken')
  const router = useRouter()
  
  const [hasTokens] = useState(() => Boolean(refreshToken && accessToken))
  
  // Luôn gọi useModelQuery để tránh lỗi rules-of-hooks, nhưng sử dụng enable để kiểm soát
  const {
    isPending: isVerifyingToken,
    data: verifyTokenData,
    error: verifyTokenError
  } = useModelQuery<IUserGetMeResponse>(
    AUTH_FEATURE_3, 
    authServices.verifyToken, 
    {
      retry: AUTH_RETRY,
      enable: hasTokens // Sử dụng enable thay vì enabled
    }
  );
  
  useEffect(() => {
    if (verifyTokenData) {
      const { accessToken } = verifyTokenData.data
      setAccessTokenToLocalStorage(accessToken as string)
    }
  }, [verifyTokenData])

  const handleRedirectToLogin = useCallback(() => {
    if (!verifyTokenError) return
    
    const errorMessage = (verifyTokenError as any)?.payload?.message || 'Session expired. Please log in again.'
    toast.error(errorMessage)
    router.push('/sign-in')
  }, [verifyTokenError, router])

  if (!hasTokens) {
    return {
      isVerifyingToken: false,
      verifyTokenData: null,
      verifyTokenError: null,
      handleRedirectToLogin: () => router.push('/sign-in')
    }
  }

  return {
    isVerifyingToken,
    verifyTokenData,
    verifyTokenError,
    handleRedirectToLogin
  }
}
