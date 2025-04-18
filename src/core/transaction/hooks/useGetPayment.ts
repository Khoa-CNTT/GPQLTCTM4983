import { transactionRoutes } from '@/api/transaction'
import { GET_ALL_PAYMENT_KEY, TRANSACTION_RETRY } from '@/core/transaction/constants'
import { IGetTransactionResponse } from '@/core/transaction/models'
import { useModelQuery } from '@/hooks/useQueryModel'
import { IDynamicType } from '@/types/common.i'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export const useGetAllPayment = (query: IDynamicType) => {
  const {
    isPending: isGetPayment,
    data: dataPayment,
    error
  } = useModelQuery<IGetTransactionResponse>(GET_ALL_PAYMENT_KEY, transactionRoutes.getAllPayment, {
    query,
    retry: TRANSACTION_RETRY
  })

  useEffect(() => {
    if (error) {
      toast.error('Failed to get payment !')
    }
  }, [error])

  return { isGetPayment, dataPayment }
}
