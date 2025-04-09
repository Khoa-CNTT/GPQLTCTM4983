'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useNotification } from '@/core/notifications/hooks'
import { INotification, ENotificationStatus } from '@/core/notifications/models'

export default function NotificationDropdown() {
  // states
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)

  // hooks
  const { getAdvancedNotifications } = useNotification()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = getAdvancedNotifications()

  // effects
  useEffect(() => {
    console.log('>>>>>', notifications)
    if (notifications.length > 0) {
      const unread = notifications.filter((n) => n.status === ENotificationStatus.UNREAD).length
      setUnreadCount(unread)
    }
  }, [notifications])

  useEffect(() => {
    if (data) setNotifications((prev) => [...prev, ...data.pages[0].data])
  }, [data])

  // functions
  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='mt-0.5 h-7 select-none rounded-full !border-0 p-0 outline-none hover:bg-transparent focus:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
        >
          <Bell className='h-4 w-4' />
          {unreadCount > 0 && <span className='absolute right-0 top-0 me-[5px] mt-[5px] h-2 w-2 rounded-full' />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-60 md:w-80'>
        <DropdownMenuLabel style={{ userSelect: 'none' }}>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div
          className='max-h-[400px] overflow-y-auto'
          onScroll={(e) => {
            const target = e.target as HTMLDivElement
            if (
              target.scrollHeight - target.scrollTop <= target.clientHeight + 50 &&
              hasNextPage &&
              !isFetchingNextPage
            ) {
              fetchNextPage()
            }
          }}
        >
          {status === 'pending' ? (
            <div className='p-3 text-center text-sm text-muted-foreground'>Loading notifications...</div>
          ) : status === 'error' ? (
            <div className='p-3 text-center text-sm text-red-500'>Error loading notifications</div>
          ) : notifications.length === 0 ? (
            <div className='p-3 text-center text-sm text-muted-foreground'>No notifications</div>
          ) : (
            <>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className='flex cursor-pointer items-start space-x-3 p-3'
                  onClick={() => markAsRead(notification.id)}
                >
                  <div
                    className={`mt-1.5 h-2 w-2 rounded-full ${notification.status === ENotificationStatus.READ ? 'bg-gray-300' : 'bg-blue-500'}`}
                  />
                  <div className='flex-1 space-y-1'>
                    <p
                      className={`text-sm font-medium ${notification.status === ENotificationStatus.READ ? 'text-muted-foreground' : ''}`}
                    >
                      {notification.title}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {notification.content.length > 80
                        ? `${notification.content.slice(0, 80)}...`
                        : notification.content}
                    </p>
                    <p className='text-xs text-muted-foreground'>{formatTimestamp(notification.timestamp)}</p>
                  </div>
                </DropdownMenuItem>
              ))}
              {isFetchingNextPage && (
                <div className='p-3 text-center text-sm text-muted-foreground'>Loading more...</div>
              )}
            </>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer text-center font-medium'>View all notifications</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
