'use client'
import { useSignInGoogle } from './useSignInGoogle'
import { useState } from 'react'
import { useSignIn } from '@/core/auth/hooks/useSignIn'
import { useSignUp } from '@/core/auth/hooks/useSignUp'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { useForgotPassword } from '@/core/auth/hooks/useForgotPassword'
import { useResetPassword } from '@/core/auth/hooks/useResetPassword'
import { useVerifyEmail } from '@/core/auth/hooks/useVerifyEmail'
import { useLogout } from '@/core/auth/hooks/useLogout'
import { useResendVerifyEmail } from './useResendVerifyEmail'
import { useVerifyToken } from './useVerifyToken'
import { useSignInFacebook } from './useSignInFacebook '

export const useAuth = (opts?: IUseQueryHookOptions) => {
  const [isRememberMe, setIsRememberMe] = useState(true)
  const { mutate: signIn, isPending: isSigningIn } = useSignIn(isRememberMe, opts)
  const { mutate: signUp, isPending: isSigningUp } = useSignUp(opts)
  const { mutate: resetPassword, isPending: isResetPassword } = useResetPassword()
  const { mutate: signInGoogle, isPending: isSigningInGoogle } = useSignInGoogle()
  const { mutate: signInFacebook, isPending: isSigningInFacebook } = useSignInFacebook()
  return {
    signIn,
    isSigningIn,
    isRememberMe,
    setIsRememberMe,
    signUp,
    isSigningUp,
    forgotPassword: useForgotPassword,
    resetPassword,
    isResetPassword,
    useVerifyEmail,
    useLogout,
    signInGoogle,
    isSigningInGoogle,
    resendVerifyEmail: useResendVerifyEmail,
    useVerifyToken,
    signInFacebook,
    isSigningInFacebook
  }
}
