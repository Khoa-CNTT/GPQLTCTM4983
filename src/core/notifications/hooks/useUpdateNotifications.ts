import { notificationsRoutes } from '../configs'
import { IUpdateNotificationForm } from '../models'
import { getAccessTokenFromLocalStorage, getBaseUrl } from '@/libraries/helpers'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import toast from 'react-hot-toast'
import { IUseQueryHookOptions } from '@/types/query.interface'

const baseUrl = getBaseUrl()
const accessToken = getAccessTokenFromLocalStorage()

export const useUpdatedNotifications = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<IUpdateNotificationForm, any>({
    pathUrl: notificationsRoutes.update,
    method: 'patch'
  })
}
