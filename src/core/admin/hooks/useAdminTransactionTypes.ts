import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { trackerTransactionTypesRoutes } from '@/api/tracker-transaction-type'
import httpService, { mutateData } from '@/libraries/http'
import toast from 'react-hot-toast'
import { ITrackerTransactionTypeBody } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'

export interface AdminTransactionType {
  id: string
  name: string
  description: string
  type: string
  trackerType: string
}

interface UseAdminTransactionTypesProps {
  type?: string
  trackerType?: string
}

export const useAdminTransactionTypes = ({ type, trackerType }: UseAdminTransactionTypesProps = {}) => {
  const queryClient = useQueryClient()
  
  const queryParams = new URLSearchParams()
  if (type) queryParams.append('type', type)
  if (trackerType) queryParams.append('trackerType', trackerType)
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'transaction-types', type, trackerType],
    queryFn: async () => {
      const { payload } = await httpService.get<{ data: AdminTransactionType[] }>(
        `${trackerTransactionTypesRoutes.adminGetAll}${queryString}`
      )
      return payload.data || []
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: ITrackerTransactionTypeBody) => {
      return mutateData({
        url: trackerTransactionTypesRoutes.adminCreate,
        method: 'post',
        body: data,
        params: {}
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'transaction-types'] })
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: ITrackerTransactionTypeBody }) => {
      return mutateData({
        url: trackerTransactionTypesRoutes.adminUpdate.replace(':id', id),
        method: 'patch',
        body: data,
        params: {}
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'transaction-types'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return mutateData({
        url: trackerTransactionTypesRoutes.adminDelete.replace(':id', id),
        method: 'delete',
        body: {},
        params: {}
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'transaction-types'] })
    }
  })

  return {
    transactionTypes: data || [],
    isLoading,
    error,
    refetch,
    createTransactionType: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateTransactionType: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteTransactionType: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending
  }
} 