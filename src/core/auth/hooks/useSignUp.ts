'use client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authServices } from '../configs'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { ISignUpBody, ISignUpResponse } from '@/core/auth/models'
import { useMutationCustom } from '@/hooks/useMutationCustom'

export const useSignUp = (opts?: IUseQueryHookOptions) => {
  const router = useRouter()
  return useMutationCustom<ISignUpBody, ISignUpResponse>({
    pathUrl: authServices.signUp,
    mutateOption: {
      onSuccess: (data) => {
        toast.success('Account created successfully - Please Check your email to verify your account')
        router.push('/sign-in')
      }
    }
  })
}
