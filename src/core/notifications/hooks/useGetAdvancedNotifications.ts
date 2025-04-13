import { GET_ADVANCED_NOTIFICATIONS_KEY, NOTIFICATIONS_RETRY_QUERY } from '../constants'
import { notificationsRoutes } from '../configs'
import { IAdvancedNotificationsResponse } from '../models'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getAccessTokenFromLocalStorage, getBaseUrl } from '@/libraries/helpers'

const baseUrl = getBaseUrl()
const accessToken = getAccessTokenFromLocalStorage()

export const useGetAdvancedNotifications = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery<IAdvancedNotificationsResponse>({
      queryKey: [GET_ADVANCED_NOTIFICATIONS_KEY],
      retry: NOTIFICATIONS_RETRY_QUERY,
      queryFn: async ({ pageParam = 1 }) => {
        const response = await fetch(`${baseUrl}/${notificationsRoutes.getAdvanced}?page=${pageParam}&limit=5`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        return response.json()
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.pagination && lastPage.pagination.currentPage < lastPage.pagination.totalPage) {
          return lastPage.pagination.currentPage + 1
        }
        return undefined
      },
      initialPageParam: 1
    })

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  }
}
