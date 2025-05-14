'use client'

import { useGetAdvancedAccountSource } from '@/core/account-source/hooks/useGetAdvancedAccountSource'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { useGetAdvancedNotifications } from './useGetAdvancedNotifications'
import { useUpdatedNotifications } from './useUpdateNotifications'

export const useNotification = (opts?: IUseQueryHookOptions) => {
  const { status: statusUpdate, mutate: updateNotification } = useUpdatedNotifications(opts)
  return {
    getAdvancedNotifications: useGetAdvancedNotifications,
    updateNotification,
    statusUpdate
  }
}
