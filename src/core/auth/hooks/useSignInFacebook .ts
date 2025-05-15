import { setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from '@/libraries/helpers'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { authServices } from '../configs'
import { AUTH_RETRY } from '@/core/auth/constants'
import { useState } from 'react'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { useUser } from '@/core/users/hooks'
import { ISignInFacebookBody, ISignInResponse } from '@/core/auth/models'
import Cookies from 'js-cookie'

export const useSignInFacebook = () => {
  const router = useRouter()
  const [executeGetMe, setExecuteGetMe] = useState<boolean>(false)
  const [countLogin, setCountLogin] = useState<number>(0)
  const params = useSearchParams()
  const redirect = params.get('redirect')
  const redirectUrl = redirect || '/dashboard/tracker-transaction?loggedIn=true'

  const mutation = useMutationCustom<ISignInFacebookBody, ISignInResponse>({
    pathUrl: authServices.loginFaceBook,
    mutateOption: {
    }
  })

  const { getMe } = useUser()
  getMe(executeGetMe, 'use-sign-in-facebook')

  return mutation
}
