'use client'
import React, { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  CalendarIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  PiggyBankIcon,
  InfoIcon,
  UserIcon,
  ClockIcon,
  CreditCardIcon,
  ArrowLeftIcon,
  Banknote,
  CheckIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { IClassifyTransactionBody, IUnclassifiedTransaction } from '@/core/transaction/models'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { classifyTransactionSchema } from '@/core/transaction/constants/classify-transaction.constant'
import { Combobox } from '@/components/core/Combobox'
import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog from '../EditTrackerType'
import { translate } from '@/libraries/utils'
import { IDialogTrackerTransaction } from '@/core/tracker-transaction/models/tracker-transaction.interface'

interface Transaction {
  id: number
  date: Date
  description: string
  accountNumber: string
  type: 'incoming' | 'outgoing'
  amount: number
  category: string
  reason: string
  bankName?: string
  benAccountNo?: string
}

// Hàm định dạng số tiền
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

interface AgentDetailDialogProps {
  isOpen: boolean
  setOpen: (open: boolean) => void
  transaction: IUnclassifiedTransaction | null
  trackerTypeProps: any
  onClose: () => void
  isLoading: boolean
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
  setSelectedTransaction: React.Dispatch<React.SetStateAction<IUnclassifiedTransaction | null>>
}

export function AgentDetailDialog({
  isOpen,
  setOpen,
  transaction,
  trackerTypeProps,
  setIsDialogOpen,
  setSelectedTransaction
}: AgentDetailDialogProps) {
  const t = translate(['transaction', 'common'])
  const { incomeTrackerType, handleClassifyTransaction } = trackerTypeProps
  const agentSuggest = useMemo(() => transaction?.agentSuggest || [], [transaction?.agentSuggest])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleSelect = (index: number) => {
    if (index === selectedIndex) setSelectedIndex(-1)
    else setSelectedIndex(index)
  }
  const [typeOfEditTrackerType, setTypeOfEditTrackerType] = useState<ETypeOfTrackerTransactionType>(
    incomeTrackerType.find((item: any) => transaction?.agentSuggest[0].trackerTypeId === item.id)
      ? ETypeOfTrackerTransactionType.INCOMING
      : ETypeOfTrackerTransactionType.EXPENSE || ETypeOfTrackerTransactionType.INCOMING
  )
  const [selectedCategory, setSelectedCategory] = useState(transaction?.agentSuggest[0].trackerTypeName || '')
  const [key, setKey] = useState(0)

  const handleConfirmCategory = () => {
    console.log('Đã xác nhận phân loại:', selectedCategory)
    setOpen(false)
  }

  const defaultValues = {}

  const form = useForm<z.infer<typeof classifyTransactionSchema>>({
    resolver: zodResolver(classifyTransactionSchema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  const handleClassify = (e: React.FormEvent) => {
    e.preventDefault()

    form.handleSubmit((data) => {
      try {
        handleClassifyTransaction({ ...data, transactionId: transaction?.id } as IClassifyTransactionBody)
      } catch (error) {
        console.error('Error updating plan:', error)
      }
    })()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className='max-h-[850px] overflow-hidden rounded-xl sm:max-w-[550px]'>
        <DialogHeader className='mb-1'>
          <Button variant='ghost' size='icon' className='absolute left-3 top-3' onClick={() => setOpen(false)}>
            <ArrowLeftIcon className='h-4 w-4' />
          </Button>
          <DialogTitle className='flex items-center justify-center text-xl font-semibold text-primary/90'>
            Chi tiết giao dịch
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className='h-[850px] pr-4 pt-2'>
          <div className='space-y-4 px-1'>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn('flex flex-col items-center justify-center rounded-xl border p-4 shadow-sm')}
            >
              <div
                className={cn(
                  'mb-3 flex h-10 w-10 items-center justify-center rounded-full',
                  transaction?.direction === ETypeOfTrackerTransactionType.INCOMING ? 'bg-green-100' : 'bg-red-100'
                )}
              >
                {transaction?.direction === ETypeOfTrackerTransactionType.INCOMING ? (
                  <ArrowDownIcon className='h-4 w-4 text-green-600' />
                ) : (
                  <ArrowUpIcon className='h-4 w-4 text-rose-600' />
                )}
              </div>

              <h3 className='mb-1 text-lg font-medium'>{transaction?.agentSuggest[0].reasonName}</h3>

              <div
                className={cn(
                  'mb-3 mt-1 text-xl font-bold',
                  transaction?.direction === ETypeOfTrackerTransactionType.INCOMING ? 'text-green-600' : 'text-red-600'
                )}
              >
                {transaction?.direction === ETypeOfTrackerTransactionType.INCOMING ? '+' : '-'}
                {formatCurrency(transaction?.amount || 0)}
              </div>

              <Badge
                className={cn(
                  'px-3 py-1 text-xs text-white',
                  transaction?.direction === ETypeOfTrackerTransactionType.INCOMING
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                )}
              >
                {transaction?.direction === ETypeOfTrackerTransactionType.INCOMING ? 'Giao dịch nhận' : 'Giao dịch chi'}
              </Badge>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className='space-y-3 rounded-xl border border-accent/10 bg-accent/20 p-4'
            >
              <h4 className='flex items-center text-sm font-semibold'>
                <InfoIcon className='mr-2 h-4 w-4 text-primary/90' />
                Thông tin giao dịch
              </h4>

              <div className='grid grid-cols-1 gap-3 text-sm'>
                <div className='flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-accent/10'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <CalendarIcon className='h-4 w-4' />
                    <span>Ngày giao dịch</span>
                  </div>
                  <div className='font-medium'>
                    {format(transaction?.transactionDateTime || new Date(), 'dd/MM/yyyy', { locale: vi })}
                  </div>
                </div>

                <div className='flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-accent/10'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <ClockIcon className='h-4 w-4' />
                    <span>Thời gian</span>
                  </div>
                  <div className='font-medium'>
                    {format(transaction?.transactionDateTime || new Date(), 'HH:mm:ss', { locale: vi })}
                  </div>
                </div>

                <div className='flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-accent/10'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <CreditCardIcon className='h-4 w-4' />
                    <span>Số tài khoản</span>
                  </div>
                  <div className='font-mono font-medium'>{transaction?.ofAccount?.accountNo}</div>
                </div>

                {transaction?.accountBank.type && (
                  <div className='flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-accent/10'>
                    <div className='flex items-center gap-2 text-muted-foreground'>
                      <Banknote className='h-4 w-4' />
                      <span>Ngân hàng</span>
                    </div>
                    <div className='font-medium'>{transaction?.accountBank.type ? 'MB Bank' : ''}</div>
                  </div>
                )}

                {transaction?.toAccountNo && (
                  <div className='flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-accent/10'>
                    <div className='flex items-center gap-2 text-muted-foreground'>
                      <UserIcon className='h-4 w-4' />
                      <span>TK đối tác</span>
                    </div>
                    <div className='font-mono font-medium'>{transaction?.toAccountNo}</div>
                  </div>
                )}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className='relative space-y-3 rounded-xl border border-accent/10 bg-accent/20 p-4'
            >
              <div className='absolute right-2 top-2 mr-2 mt-2'>
                <Button
                  onClick={() => {
                    // truyền index suggest (nếu chọn)
                    setIsDialogOpen((prev) => ({
                      ...prev,
                      isDialogClassifyTransactionOpen: true
                    }))
                  }}
                  variant='blueVin'
                  className='transform-none transition-colors focus:outline-none focus:ring-0 active:translate-y-0'
                  size='sm'
                >
                  Classify
                </Button>
              </div>
              {/* Reason Names Row */}
              <div className='space-y-1'>
                <h3 className='text-xs font-medium text-foreground/70'>Reason Names</h3>
                <div className='flex flex-wrap gap-2'>
                  {agentSuggest.map((suggestion, index) => (
                    <motion.div
                      key={`reason-${index}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={`cursor-pointer rounded-full px-3 py-1 text-sm transition-colors ${
                        selectedIndex === index
                          ? 'text-blue-900 dark:bg-gradient-to-r dark:from-purple-700 dark:via-indigo-800 dark:to-blue-900 dark:text-white'
                          : 'bg-accent/50 hover:bg-accent'
                      }`}
                      onClick={() => handleSelect(index)}
                    >
                      {suggestion.reasonName}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Category Names Row */}
              <div className='space-y-1'>
                <h3 className='text-xs font-medium text-foreground/70'>Category Names</h3>
                <div className='flex flex-wrap gap-2'>
                  {agentSuggest.map((suggestion, index) => (
                    <motion.div
                      key={`category-${index}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                      className={`cursor-pointer rounded-full px-3 py-1 text-sm transition-colors ${
                        selectedIndex === index
                          ? 'text-blue-900 dark:bg-gradient-to-r dark:from-purple-700 dark:via-indigo-800 dark:to-blue-900 dark:text-white'
                          : 'bg-accent/50 hover:bg-accent'
                      }`}
                      onClick={() => handleSelect(index)}
                    >
                      {suggestion.trackerTypeName}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Messages Row */}
              <div className='space-y-1'>
                <h3 className='text-xs font-medium text-foreground/70'>Messages</h3>
                <div className='space-y-2'>
                  {agentSuggest.map((suggestion, index) => (
                    <motion.div
                      key={`message-${index}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                      className={`cursor-pointer rounded-lg p-2 text-sm transition-colors ${
                        selectedIndex === index
                          ? 'border border-blue-300 bg-blue-50 text-blue-900 shadow dark:border-blue-500 dark:bg-accent/30 dark:text-foreground/80'
                          : 'bg-accent/30 text-foreground/80 hover:bg-accent/50 dark:bg-accent/10 dark:text-foreground/60 dark:hover:bg-accent/20'
                      }`}
                      onClick={() => handleSelect(index)}
                    >
                      {suggestion.message}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
