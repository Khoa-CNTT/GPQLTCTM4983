'use client'

import { useGetAdvancedAccountSource } from '@/core/account-source/hooks/useGetAdvancedAccountSource'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { useGetAdvancedNotifications } from './useGetAdvancedNotifications'

export const useNotification = (opts?: IUseQueryHookOptions) => {
  return {
    getAdvancedNotifications: useGetAdvancedNotifications
  }
}
