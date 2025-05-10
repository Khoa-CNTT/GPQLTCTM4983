import { apiService } from '@/api'
import { USER_QUERY_ME, USER_RETRY } from '@/core/users/constants'
import { useModelQuery } from '@/hooks/useQueryModel'
import { FUND_ID_STORAGE_KEY, useStoreLocal } from '@/hooks/useStoreLocal'
import { isClient, setDefaultFundIdToLocalStorage, setUserInfoToLocalStorage } from '@/libraries/helpers'
import { IUserGetMeResponse } from '@/types/user.i'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const userApi = apiService.user

export const useGetMeUser = (execute: boolean) => {
  const router = useRouter()
  const { setUser, setFundId } = useStoreLocal()
  const {
    isPending: isGetMeUserPending,
    data: userGetMeData,
    refetch
  } = useModelQuery<IUserGetMeResponse>(USER_QUERY_ME, userApi.getMe, {
    enable: !!execute,
    condition: 'me',
    retry: USER_RETRY
  })

  const executeGetMe = () => {
    refetch()
  }

  useEffect(() => {
    if (!isGetMeUserPending && userGetMeData) {
      setUserInfoToLocalStorage(userGetMeData.data)
      console.log(
        '🚀 ~ file: useQueryUser.ts:20 ~ useEffect ~ userGetMeData:',
        userGetMeData.data.defaultExpenditureFundId
      )

      setDefaultFundIdToLocalStorage(userGetMeData.data.defaultExpenditureFundId)
      setFundId(userGetMeData.data.defaultExpenditureFundId)
      setUser(userGetMeData.data)
      if (userGetMeData?.data?.provider !== null && userGetMeData?.data?.isChangeNewPassword)
        router.push('/dashboard/profile?openTab=password')
    }
  }, [userGetMeData, isGetMeUserPending])

  return { isGetMeUserPending, userGetMeData, refetch, executeGetMe }
}
