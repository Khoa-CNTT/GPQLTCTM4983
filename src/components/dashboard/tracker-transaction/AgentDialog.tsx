import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  CalendarIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  PiggyBankIcon,
  ShoppingBagIcon,
  CoffeeIcon,
  HomeIcon,
  CarIcon,
  FileTextIcon,
  SearchIcon,
  TrendingUpIcon,
  Loader2Icon,
  SmileIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Input } from '@/components/ui/input'
import agentGif from '@/images/gif/agent1.gif'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { AgentDetailDialog } from './AgentDetailDialog'
import Image from 'next/image'
import { IClassifyTransactionBody, IUnclassifiedTransaction } from '@/core/transaction/models'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { ITrackerTransactionTypeBody } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { IDialogTrackerTransaction } from '@/core/tracker-transaction/models/tracker-transaction.interface'

// Định nghĩa kiểu dữ liệu nhóm transaction
interface TransactionGroup {
  date: Date
  transactions: IUnclassifiedTransaction[]
}

// Hàm nhóm các giao dịch theo ngày
const groupTransactionsByDate = (transactions: IUnclassifiedTransaction[]): TransactionGroup[] => {
  const groups: Record<string, IUnclassifiedTransaction[]> = {}

  transactions.forEach((transaction) => {
    const dateString = format(transaction.transactionDateTime, 'yyyy-MM-dd')
    if (!groups[dateString]) {
      groups[dateString] = []
    }
    groups[dateString].push(transaction)
  })

  // Sắp xếp các ngày theo thứ tự giảm dần
  const sortedGroups = Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  return sortedGroups.map((date) => ({
    date: new Date(date),
    transactions: groups[date]
  }))
}

// Hàm chọn icon cho category
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'mua sắm':
      return <ShoppingBagIcon className='h-3 w-3' />
    case 'ăn uống':
      return <CoffeeIcon className='h-3 w-3' />
    case 'nhà cửa':
      return <HomeIcon className='h-3 w-3' />
    case 'phương tiện':
      return <CarIcon className='h-3 w-3' />
    case 'thu nhập':
    case 'chuyển khoản':
      return <PiggyBankIcon className='h-3 w-3' />
    case 'hoá đơn':
      return <FileTextIcon className='h-3 w-3' />
    default:
      return <ShoppingBagIcon className='h-3 w-3' />
  }
}

// Hàm định dạng số tiền
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

interface AgentDialogProps {
  selectedTransaction: IUnclassifiedTransaction | null
  setSelectedTransaction: React.Dispatch<React.SetStateAction<IUnclassifiedTransaction | null>>
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
  isClassifying: boolean
  isOpen: boolean
  setOpen: (open: boolean) => void
  data?: {
    transactions?: IUnclassifiedTransaction[]
    messageAnalysis?: string
  } | null
  isLoading: boolean
  callBack: {
    handleCreateTrackerType: (
      data: ITrackerTransactionTypeBody,
      setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
    ) => void
    handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => void
    handleDeleteTrackerType: (id: string) => void
    handleClassifyTransaction: (data: IClassifyTransactionBody) => void
  }
  incomeTrackerType: ITrackerTransactionTypeBody[]
  expenseTrackerType: ITrackerTransactionTypeBody[]
  expenditureFund: { label: string; value: string | number }[]
  detailDialogOpen: boolean
  setDetailDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AgentDialog({
  setIsDialogOpen,
  isOpen,
  setOpen,
  data,
  isLoading,
  callBack,
  incomeTrackerType,
  expenseTrackerType,
  expenditureFund,
  detailDialogOpen,
  setDetailDialogOpen,
  isClassifying,
  selectedTransaction,
  setSelectedTransaction
}: AgentDialogProps) {
  // Sử dụng dữ liệu mẫu hoặc data từ props
  const transactions = data?.transactions || []
  const groupedTransactions = groupTransactionsByDate(transactions)
  const [openEditTrackerTxTypeDialog, setOpenEditTrackerTxTypeDialog] = useState<boolean>(false)

  // Tính tổng thu nhập và chi tiêu
  const totalIncoming = transactions
    .filter((t) => t.direction === ETypeOfTrackerTransactionType.INCOMING)
    .reduce((sum, t) => sum + t.amount, 0)

  const totalOutgoing = transactions
    .filter((t) => t.direction === ETypeOfTrackerTransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0)

  // Số giao dịch hôm nay
  const todayTransactions = transactions.filter((t) => {
    const today = new Date()
    const transactionDateTime = new Date(t.transactionDateTime)
    return (
      transactionDateTime.getDate() === today.getDate() &&
      transactionDateTime.getMonth() === today.getMonth() &&
      transactionDateTime.getFullYear() === today.getFullYear()
    )
  })

  const handleTransactionClick = (transaction: IUnclassifiedTransaction) => {
    setSelectedTransaction(transaction)
    setDetailDialogOpen(true)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent className='max-h-[850px] overflow-hidden rounded-xl border-primary/10 shadow-lg shadow-primary/5 sm:max-w-[850px]'>
          <DialogHeader className='mb-1'>
            <DialogTitle className='flex items-center text-xl font-semibold text-primary/90'>
              <div className='mr-2 rounded-md bg-primary/40 p-1.5'>
                <TrendingUpIcon className='h-5 w-5 text-primary/90' />
              </div>
              Phân tích giao dịch
            </DialogTitle>
          </DialogHeader>

          <div className='flex flex-col gap-5 border-b pb-5 md:flex-row md:items-start'>
            <div className='hidden flex-shrink-0 flex-col items-center space-y-3 md:flex'>
              <div className='flex h-32 w-32 items-center justify-center p-1.5'>
                <Image
                  src={agentGif.src}
                  alt='Agent Animation'
                  width={120}
                  height={120}
                  className='rounded-full object-contain'
                />
              </div>

              <div className='w-full space-y-2'>
                <div className='flex items-center justify-between text-xs font-medium'>
                  <span className='flex items-center text-green-600'>
                    <ArrowDownIcon className='mr-1 h-3 w-3' />
                    Thu
                  </span>
                  <span>{formatCurrency(totalIncoming)}</span>
                </div>
                <div className='flex items-center justify-between text-xs font-medium'>
                  <span className='flex items-center text-red-600'>
                    <ArrowUpIcon className='mr-1 h-3 w-3' />
                    Chi
                  </span>
                  <span>{formatCurrency(totalOutgoing)}</span>
                </div>
                <div className='border-t pt-1'>
                  <div className='flex items-center justify-between text-xs font-semibold'>
                    <span className='me-2 text-green-500'>Chênh lệch </span>
                    <span>{formatCurrency(totalIncoming - totalOutgoing)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex-1'>
              <div className='space-y-4'>
                <div className='rounded-xl bg-primary/10 p-4'>
                  <h3 className='mb-2 flex items-center text-sm font-medium text-primary/90'>
                    <CalendarIcon className='mr-2 h-4 w-4 text-primary/80' />
                    Hôm nay: {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: vi })}
                  </h3>

                  <div className='mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
                    <Badge variant='outline' className='border-primary/20 bg-primary/5 px-2.5 py-1 text-primary/80'>
                      <PiggyBankIcon className='mr-1.5 h-3 w-3' />
                      <span>MB Bank</span>
                    </Badge>
                    <span>•</span>
                    <span className='font-medium'>Đã phân tích {transactions.length} giao dịch</span>
                    {transactions.length > 0 && (
                      <>
                        <span>•</span>
                        <span className='font-medium text-green-500'>+{formatCurrency(totalIncoming)}</span>
                        <span>•</span>
                        <span className='font-medium text-red-600'>-{formatCurrency(totalOutgoing)}</span>
                      </>
                    )}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className='relative rounded-lg border border-primary/20 bg-primary/10 p-3.5 shadow-sm'
                  >
                    <div className='absolute left-3 top-3.5 flex items-center justify-center'>
                      <div className='h-2 w-2 animate-pulse rounded-full bg-amber-400'></div>
                      <div
                        className='absolute h-2 w-2 animate-pulse rounded-full bg-amber-300'
                        style={{ animationDelay: '300ms' }}
                      ></div>
                    </div>
                    <p className='pl-5 text-xs font-semibold italic text-green-600'>{data?.messageAnalysis}</p>
                  </motion.div>
                </div>

                <div className='relative'>
                  <SearchIcon className='absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70' />
                  <Input
                    placeholder='Tìm kiếm theo mô tả, số tài khoản, số tiền...'
                    className='h-10 rounded-lg border-primary/20 bg-primary/5 pl-9 pr-4 text-xs transition-colors hover:bg-primary/10 focus:border-primary/30'
                  />
                </div>
              </div>
            </div>
          </div>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='flex h-[400px] flex-col items-center justify-center space-y-4 px-4 text-center'
            >
              <div className='relative'>
                <Loader2Icon className='h-10 w-10 animate-spin text-primary' />
                <SmileIcon className='absolute bottom-0 right-0 h-5 w-5 text-yellow-500' />
              </div>
              <p className='text-base font-medium text-primary/80'>
                Uniko đang chuẩn bị giao dịch cho bạn, vui lòng đợi một tý nhé
              </p>
            </motion.div>
          ) : (
            <ScrollArea className='h-[400px] pr-4 pt-2'>
              <div className='space-y-6'>
                {groupedTransactions.map((group, groupIndex) => (
                  <motion.div
                    key={groupIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: groupIndex * 0.1 }}
                    className='space-y-2.5'
                  >
                    <div className='sticky top-0 z-10 rounded-md bg-accent/70 p-2.5 backdrop-blur-sm'>
                      <h3 className='flex items-center text-xs font-medium text-white'>
                        <CalendarIcon className='mr-2 h-3.5 w-3.5 text-white' />
                        {format(group.date, 'EEEE, dd MMMM yyyy', { locale: vi })}
                      </h3>
                    </div>

                    <div className='space-y-3 px-5'>
                      {group.transactions.map((transaction, idx) => (
                        <motion.div
                          key={transaction.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className={cn(
                            'group cursor-pointer rounded-xl border p-2 shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow',
                            transaction.direction === ETypeOfTrackerTransactionType.INCOMING
                              ? 'border-accent/40 bg-accent/40 hover:from-green-50/50'
                              : 'border-accent/40 bg-accent/40 hover:from-red-50/50'
                          )}
                          onClick={() => handleTransactionClick(transaction)}
                        >
                          <div className='flex items-center justify-between gap-3'>
                            <div className='flex items-center gap-3.5'>
                              <div
                                className={cn(
                                  'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-sm'
                                )}
                              >
                                {transaction.direction === ETypeOfTrackerTransactionType.INCOMING ? (
                                  <ArrowDownIcon className='h-4.5 w-4.5 text-green-600' />
                                ) : (
                                  <ArrowUpIcon className='h-4.5 w-4.5 text-rose-600' />
                                )}
                              </div>

                              <div className='min-w-0'>
                                <div className='flex items-center gap-2'>
                                  <h4 className='truncate text-sm font-medium transition-colors group-hover:text-primary'>
                                    {transaction.agentSuggest.length > 0 ? transaction.agentSuggest[0].reasonName : ''}
                                  </h4>
                                  <Badge
                                    variant='secondary'
                                    className={cn(
                                      'ml-auto flex h-5 items-center gap-1 px-2 text-[0.65rem] leading-none shadow-sm transition-colors',
                                      transaction.direction === ETypeOfTrackerTransactionType.INCOMING
                                        ? 'bg-green-500 text-white'
                                        : 'bg-red-500 text-white'
                                    )}
                                  >
                                    {getCategoryIcon(
                                      transaction.agentSuggest.length > 0
                                        ? transaction.agentSuggest[0].trackerTypeName || ''
                                        : ''
                                    )}
                                    <span className='max-w-20 truncate'>
                                      {transaction.agentSuggest.length > 0
                                        ? transaction.agentSuggest[0].trackerTypeName
                                        : ''}
                                    </span>
                                  </Badge>
                                </div>
                                <div className='mt-1.5 flex items-center gap-2 text-[0.7rem] text-muted-foreground'>
                                  <span className='flex items-center rounded-full bg-muted/30 px-1.5 py-0.5'>
                                    <CalendarIcon className='mr-1 h-3 w-3' />
                                    {format(transaction.transactionDateTime, 'HH:mm')}
                                  </span>
                                  <div className='h-1 w-1 rounded-full bg-muted-foreground/40'></div>
                                  <span className='truncate rounded-full bg-muted/30 px-1.5 py-0.5 font-mono'>
                                    {transaction.ofAccount?.accountNo || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div
                              className={cn(
                                'rounded-lg px-3 py-1.5 text-sm font-semibold tabular-nums transition-all duration-300 group-hover:scale-105',
                                transaction.direction === ETypeOfTrackerTransactionType.INCOMING
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              )}
                            >
                              {transaction.direction === ETypeOfTrackerTransactionType.INCOMING ? '+' : '-'}
                              {formatCurrency(transaction.amount)}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <AgentDetailDialog
        setSelectedTransaction={setSelectedTransaction}
        setIsDialogOpen={setIsDialogOpen}
        isOpen={detailDialogOpen}
        setOpen={setDetailDialogOpen}
        transaction={selectedTransaction}
        onClose={() => setDetailDialogOpen(false)}
        isLoading={isLoading}
        trackerTypeProps={{
          incomeTrackerType,
          expenseTrackerType,
          setOpenEditTrackerTxTypeDialog,
          openEditTrackerTxTypeDialog,
          handleCreateTrackerType: callBack.handleCreateTrackerType,
          handleUpdateTrackerType: callBack.handleUpdateTrackerType,
          handleDeleteTrackerType: callBack.handleDeleteTrackerType,
          expenditureFund,
          handleClassifyTransaction: callBack.handleClassifyTransaction
        }}
      />
    </>
  )
}
