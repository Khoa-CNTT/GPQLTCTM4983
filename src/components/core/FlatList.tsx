'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import Image from 'next/image'
import NoDataPlaceHolder from '@/images/2.png'
import { cn, formatDateTimeVN } from '@/libraries/utils'
import { Atom } from 'react-loading-indicators'
import { emptyStateItemVariants, emptyStateVariants } from '../dashboard/DataTable'
import EmptyBox from '@/images/empty-box.png'
import { useTranslation } from 'react-i18next'

export interface IFlatListData {
  id: string
  amount: string
  accountNo: string
  direction: ETypeOfTrackerTransactionType
  transactionDateTime: string
}
interface IFlatListProps {
  data: IFlatListData[]
  onClick?: (item: IFlatListData) => void
  isLoading?: boolean
  className?: string
  viewportHeight?: number
}

export default function FlatList({ data, onClick, isLoading, className, viewportHeight }: IFlatListProps) {
  const [heightFlatList, setHeightFlatList] = useState('')
  const { t } = useTranslation(['common', 'trackerTransaction'])

  useEffect(() => {
    if (viewportHeight && viewportHeight >= 600 && viewportHeight <= 771) {
      setHeightFlatList('py-4 min-h-[166px] max-h-[200px]')
    } else if (viewportHeight && viewportHeight >= 1000) {
      setHeightFlatList('py-4 min-h-[300px] max-h-[400px]')
    } else if (viewportHeight && viewportHeight >= 926) {
      setHeightFlatList('py-4 min-h-[250px] max-h-[400px]')
    } else if (viewportHeight && viewportHeight >= 800) {
      setHeightFlatList('py-4 min-h-[208px] max-h-[400px]')
    } else if (viewportHeight && viewportHeight >= 772) {
      setHeightFlatList('py-4 min-h-[200px] max-h-[400px]')
    } else {
      setHeightFlatList('py-10 min-h-[168px] max-h-[200px]')
    }
  }, [viewportHeight])
  return (
    <Card className='w-50px h-full to-muted/20'>
      {data?.length > 0 ? (
        <ScrollArea className={cn('h-[220px] max-h-[220px] w-full rounded-md p-3', className)}>
          {data.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Card
                onClick={(e) => {
                  e.stopPropagation()
                  if (onClick) onClick(item)
                }}
                className={cn(
                  'mb-2 cursor-pointer border-l-4 bg-card/50 bg-gradient-to-b from-background transition-all duration-300 hover:scale-[1.01]',
                  `${item.direction === ETypeOfTrackerTransactionType.EXPENSE ? 'border-l-rose-600 dark:border-l-rose-800' : 'border-l-[#047858]'}`
                )}
              >
                <CardHeader className='py-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div
                        className={`${
                          item.direction === ETypeOfTrackerTransactionType.EXPENSE
                            ? 'text-destructive'
                            : 'text-secondary'
                        }`}
                      >
                        {item.direction === ETypeOfTrackerTransactionType.EXPENSE ? '↓' : '↑'}
                      </div>
                      <div className='flex flex-col'>
                        <CardTitle className='text-base font-bold tracking-tight max-sm:text-sm'>
                          {item.direction === ETypeOfTrackerTransactionType.EXPENSE ? '- ' : '+ '}
                          {item.amount}
                        </CardTitle>
                        <span className='text-[11px] text-muted-foreground max-sm:hidden'>
                          {item.direction === ETypeOfTrackerTransactionType.INCOMING ? 'To' : 'From'}:{' '}
                          {item.accountNo ? item.accountNo : 'N/A'}{' '}
                        </span>
                      </div>
                    </div>
                    <div className='flex flex-col items-end gap-1'>
                      <div className='flex items-center gap-1'>
                        <Badge
                          variant={item.direction === ETypeOfTrackerTransactionType.EXPENSE ? 'default' : 'secondary'}
                          className='font-sm'
                        >
                          {item.direction === ETypeOfTrackerTransactionType.EXPENSE
                            ? t('expense', { ns: 'trackerTransaction' })
                            : t('incoming', { ns: 'trackerTransaction' })}
                        </Badge>
                      </div>
                      <div className='flex items-center gap-1 text-[11px] text-muted-foreground max-sm:hidden'>
                        <Clock className='h-3 w-3' />
                        <span>{formatDateTimeVN(item.transactionDateTime, true)}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </ScrollArea>
      ) : isLoading ? (
        <motion.div
          initial='hidden'
          animate='visible'
          variants={emptyStateVariants}
          className='flex h-full items-center justify-center'
        >
          <motion.div variants={emptyStateItemVariants}>
            <Atom color='#be123c' size='small' textColor='#be123c' />
          </motion.div>
          <motion.span variants={emptyStateItemVariants} className='font-semibold'>
            {t('loading')}
          </motion.span>
        </motion.div>
      ) : (
        <div className={`flex flex-col items-center justify-center ${heightFlatList}`}>
          <div className='relative'>
            <Image
              priority
              src={NoDataPlaceHolder}
              alt='No data available'
              width={100}
              height={100}
              className='opacity-80'
            />
          </div>
          <p className='text-xs text-muted-foreground'>{t('noTransactionsAvailable')}</p>
        </div>
      )}
    </Card>
  )
}
