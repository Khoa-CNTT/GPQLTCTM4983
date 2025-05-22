'use client'

import { useCreateAccountSource } from '@/core/account-source/hooks/useCreateAccountSource'
import { useGetAccountSourceById } from '@/core/account-source/hooks/useGetAccountSourceById'
import { useGetAdvancedAccountSource } from '@/core/account-source/hooks/useGetAdvancedAccountSource'
import { useUpdateAccountSource } from '@/core/account-source/hooks/useUpdateAccountSource'
import { useTransferAccountSource } from '@/core/account-source/hooks/useTransferAccountSource'
import { useGetAllAccountSourceFromAllFunds } from '@/core/account-source/hooks/useGetAllAccountSourceFromAllFunds'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { useGetAllAccountSource } from './useGetAllAccountSource'
import { useDeleteAnAccountSource } from './useDeleteAnAccountSource'
import { useDeleteMultipleAccountSource } from './useDeleteMultipleAccountSource'
import { useGetStatisticAccountBalance } from './useGetStatisticAccountBalance'

export const useAccountSource = (opts?: IUseQueryHookOptions) => {
  const { mutate: createAccountSource, isPending: isCreating } = useCreateAccountSource(opts)
  const { mutate: updateAccountSource, isPending: isUpdating } = useUpdateAccountSource(opts)
  const { mutate: deleteAnAccountSource, isPending: isDeletingOne } = useDeleteAnAccountSource(opts)
  const { mutate: deleteMultipleAccountSource, isPending: isDeletingMultiple } = useDeleteMultipleAccountSource(opts)
  const { mutate: transferAccountSource, isPending: isTransferring } = useTransferAccountSource(opts)

  return {
    createAccountSource,
    isCreating,
    updateAccountSource,
    isUpdating,
    useGetAccountSourceById,
    getAdvancedAccountSource: useGetAdvancedAccountSource,
    getAllAccountSource: useGetAllAccountSource,
    getAllAccountSourceFromAllFunds: useGetAllAccountSourceFromAllFunds,
    deleteAnAccountSource,
    isDeletingOne,
    deleteMultipleAccountSource,
    isDeletingMultiple,
    getStatisticAccountBalance: useGetStatisticAccountBalance,
    transferAccountSource,
    isTransferring
  }
}
