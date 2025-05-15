import { apiService } from '@/api'
import { AUTH_LOGOUT } from '@/core/auth/constants'
import { useModelQuery } from '@/hooks/useQueryModel'
import { IUserGetMeResponse } from '@/types/user.i'
import Cookies from 'js-cookie'
import { removeTokensFromLocalStorage } from '@/libraries/helpers'

const authApi = apiService.authentication

export const useLogout = () => {
  const { data: userLogoutData, refetch } = useModelQuery<IUserGetMeResponse>(AUTH_LOGOUT, authApi.logOut, {
    enable: false
  })

  const executeLogout = () => {
    Cookies.remove('authTokenVerify')
    Cookies.remove('refreshToken')
    Cookies.remove('adminRole', { path: '/' })
    Cookies.remove('accessToken', { path: '/' })
    removeTokensFromLocalStorage()
    localStorage.removeItem('fundId')
    refetch()
  }

  return { userLogoutData, executeLogout }
}
