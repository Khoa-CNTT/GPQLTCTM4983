import { IBaseResponseData } from '@/types/common.i'

export type INotificationsResponse = IBaseResponseData<INotification>
export type IAdvancedNotificationsResponse = IBaseResponseData<{ data: INotification[]; unreadCount: number }>

export interface INotification {
  id: string
  userId: string
  title: string
  content: string
  link?: string
  status: ENotificationStatus
  timestamp: Date
}

export enum ENotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ'
}

export type TAccountSourceActions = 'getAllAccountSource' | 'getStatisticAccountBalance' | 'getAdvancedAccountSource'
