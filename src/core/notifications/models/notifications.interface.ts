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

// export type TAccountSourceActions = 'getAllAccountSource' | 'getStatisticAccountBalance' | 'getAdvancedAccountSource'

export interface IDialogNotification {
  isDialogDetailBudgetPlanOpen: boolean
  // ...
}

export const initDialogNotification: IDialogNotification = {
  isDialogDetailBudgetPlanOpen: false
}

export const initDetailNotification: INotification = {
  id: '',
  userId: '',
  title: '',
  content: '',
  status: ENotificationStatus.UNREAD,
  timestamp: new Date()
}

export interface IUpdateNotificationForm {
  id: string,
  status?: ENotificationStatus,
  title?: string,
  content?: string,
  link?: string
}

export type TNotificationActions = 'getAdvancedNotifications'