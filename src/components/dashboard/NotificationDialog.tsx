'use client'
import React from 'react'
import CustomDialog from './Dialog'
import { IDialogNotification, INotification } from '@/core/notifications/models'
import { Bell, CalendarIcon, CreditCard, ExternalLink } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '../ui/button'

interface INotificationDialogProps {
  detailDialog: {
    data: INotification
  }
  commonProps: {
    isDialogOpen: IDialogNotification
    setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogNotification>>
  }
}

export function NotificationDialog({ detailDialog, commonProps }: INotificationDialogProps) {
  const formatDate = (date: Date) =>
    new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

  const formattedContent = (content: string) => {
    return content.split('\n\n').map((paragraph, i) => {
      // Nếu đoạn này bắt đầu bằng số và dấu chấm, coi như danh sách
      if (/^\d+\.\s/.test(paragraph)) {
        const listItems = paragraph.split('\n').map((item, j) => {
          // Highlight text trong dấu ngoặc kép
          const highlightedItem = item.replace(
            /"([^"]+)"/g,
            '<span class="text-red-600 dark:text-red-400 font-medium">$1</span>'
          )

          return (
            <li
              key={j}
              className='mb-2 text-gray-700 dark:text-gray-300'
              dangerouslySetInnerHTML={{ __html: highlightedItem }}
            />
          )
        })

        return (
          <ul key={i} className='mb-4 list-disc space-y-1 pl-5 marker:text-red-500 dark:marker:text-red-400'>
            {listItems}
          </ul>
        )
      }

      // Đoạn văn thường, cũng highlight nội dung trong ngoặc kép
      const highlightedParagraph = paragraph.replace(
        /"([^"]+)"/g,
        '<span class="text-red-600 dark:text-red-400 font-medium">$1</span>'
      )

      return (
        <p
          key={i}
          className='mb-4 text-gray-700 dark:text-gray-300'
          dangerouslySetInnerHTML={{ __html: highlightedParagraph }}
        />
      )
    })
  }

  const detailBudgetPlanNotificationConfig = {
    isOpen: commonProps.isDialogOpen.isDialogDetailBudgetPlanOpen,
    title: 'Notification Details',
    description: 'Details of the notification',
    content: (
      <div className='py-2'>
        <div className='space-y-5'>
          {/* Title section with icon */}
          <div className='flex items-start gap-3 pb-2'>
            <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30'>
              <Bell size={16} className='text-red-600 dark:text-red-400' />
            </div>
            <div className='flex-1'>
              <h3 className='mb-1 text-base font-semibold text-gray-800 dark:text-gray-100'>
                {detailDialog.data.title}
              </h3>
              <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
                <CalendarIcon size={12} />
                <span>{formatDate(detailDialog.data.timestamp)}</span>
              </div>
            </div>
          </div>

          <Separator className='bg-gray-100 dark:bg-gray-700' />

          {/* Content section */}
          <div className='space-y-4'>
            <div className='px-1 text-sm leading-relaxed'>{formattedContent(detailDialog.data.content)}</div>
          </div>
        </div>
      </div>
    ),
    className: 'sm:max-w-[425px]',
    footer: (
      <Button variant='destructive' className='text-sm font-medium' tabIndex={-1}>
        <CreditCard className='mr-2 h-4 w-4' />
        <span className='text-sm font-medium'>Paid</span>
      </Button>
    ),
    onClose: () => commonProps.setIsDialogOpen((prev) => ({ ...prev, isDialogDetailBudgetPlanOpen: false }))
  }
  return (
    <div>
      <CustomDialog config={detailBudgetPlanNotificationConfig} />
    </div>
  )
}
