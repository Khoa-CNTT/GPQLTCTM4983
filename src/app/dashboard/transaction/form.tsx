'use client'
import React, { useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/dashboard/DataTable'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import { formatCurrency, mergeQueryParams } from '@/libraries/utils'
import { useState } from 'react'
import { IDataTableConfig } from '@/types/common.i'
import { initTableConfig } from '@/constants/data-table'
import TransactionDialog from '@/app/dashboard/transaction/dialog'
import {
  handleAccountBankRefetching,
  handleDeleteMultipleTransaction,
  handleDeleteTransaction,
  handleUpdateTransaction,
  modifyTransactionHandler,
  updateCacheDataTransactionForUpdate
} from '@/app/dashboard/transaction/handler'
import { IQueryOptions } from '@/types/query.interface'
import { useTransaction } from '@/core/transaction/hooks'
import {
  IClassifyTransactionBody,
  IDataTransactionTable,
  IDialogTransaction,
  IGetTransactionResponse,
  ITransaction,
  ITransactionSummary,
  IUpdateTransactionBody,
  TTransactionActions
} from '@/core/transaction/models'
import {
  initButtonInDataTableHeader,
  initEmptyDetailTransactionData,
  initDialogFlag,
  initEmptyTransactionSummaryData,
  transactionHeaders
} from './constants'
import { IAccountBank } from '@/core/account-bank/models'
import { initQueryOptions } from '@/constants/init-query-options'
import { useUpdateModel } from '@/hooks/useQueryModel'
import { useTrackerTransaction } from '@/core/tracker-transaction/hooks'
import toast from 'react-hot-toast'
import { useTrackerTransactionType } from '@/core/tracker-transaction-type/hooks'
import {
  initTrackerTypeData,
  updateCacheDataClassifyFeat,
  handleClassifyTransaction,
  handleCreateTrackerTxType,
  updateCacheDataTodayTxClassifyFeat,
  modifiedTrackerTypeForComboBox,
  handleUpdateTrackerTxType,
  handleDeleteTrackerTxType
} from '../tracker-transaction/handlers'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { useSocket } from '@/libraries/useSocketIo'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { EUserStatus, IUserPayloadForSocket } from '@/types/user.i'
import { useUser } from '@/core/users/hooks'
import { getAccessTokenFromLocalStorage, getTimeCountRefetchLimit, setTimeCountRefetchLimit } from '@/libraries/helpers'
import {
  GET_ADVANCED_TRANSACTION_KEY,
  GET_TODAY_TRANSACTION_KEY,
  GET_UNCLASSIFIED_TRANSACTION_KEY
} from '@/core/transaction/constants'
import {
  GET_ADVANCED_TRACKER_TRANSACTION_KEY,
  GET_ALL_TRACKER_TRANSACTION_TYPE_KEY,
  STATISTIC_TRACKER_TRANSACTION_KEY
} from '@/core/tracker-transaction/constants'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { useTranslation } from 'react-i18next'
import { useAccountSource } from '@/core/account-source/hooks'
import { GET_ADVANCED_ACCOUNT_SOURCE_KEY } from '@/core/account-source/constants'
import DeleteDialog from '@/components/dashboard/DeleteDialog'
import { useExpenditureFund } from '@/core/expenditure-fund/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { useOverviewPage } from '@/core/overview/hooks'
import { GET_ADVANCED_EXPENDITURE_FUND_KEY } from '@/core/expenditure-fund/constants'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowUpDown } from 'lucide-react'
import { EPaymentEvents } from '../tracker-transaction/constants'
import { AgentDialog } from '@/components/dashboard/tracker-transaction/AgentDialog'

export default function TransactionForm() {
  // states
  const [isLoadingUnclassified, setIsLoadingUnclassified] = useState<boolean>(false)
  const [isOpenAgentDialog, setIsOpenAgentDialog] = useState(false)
  const [idDeletes, setIdDeletes] = useState<string[]>([])
  const [typeOfTrackerType, setTypeOfTrackerType] = useState<ETypeOfTrackerTransactionType>(
    ETypeOfTrackerTransactionType.INCOMING
  )
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>({
    ...initTableConfig,
    isVisibleSortType: false,
    classNameOfScroll: 'h-[calc(100vh-35rem)]'
  })
  const [uncDataTableConfig, setUncDataTableConfig] = useState<IDataTableConfig>({
    ...initTableConfig,
    isVisibleSortType: false,
    classNameOfScroll: 'h-[calc(100vh-35rem)]'
  })
  const [todayDataTableConfig, setTodayDataTableConfig] = useState<IDataTableConfig>({
    ...initTableConfig,
    isVisibleSortType: false,
    classNameOfScroll: 'h-[calc(100vh-35rem)]'
  })
  const [isPendingRefetch, setIsPendingRefetch] = useState(false)
  const [dataDetail, setDataDetail] = useState<ITransaction>(initEmptyDetailTransactionData)
  const [dataTable, setDataTable] = useState<IDataTransactionTable[]>([])
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [uncTableQueryOptions, setUncTableQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [todayTableQueryOptions, setTodayTableQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [isDialogOpen, setIsDialogOpen] = useState<IDialogTransaction>(initDialogFlag)
  const [accountBankRefetching, setAccountBankRefetching] = useState<IAccountBank>()
  const [accountBankRefetchingQueue, setAccountBankRefetchingQueue] = useState<IAccountBank[]>([])
  const [transactionSummary, setTransactionSummary] = useState<ITransactionSummary>(initEmptyTransactionSummaryData)
  const [incomingTrackerType, setIncomingTrackerType] = useState<ITrackerTransactionType[]>([])
  const [expenseTrackerType, setExpenseTrackerType] = useState<ITrackerTransactionType[]>([])
  const [dataTableUnclassifiedConfig, setDataTableUnclassifiedConfig] = useState<IDataTableConfig>({
    ...initTableConfig,
    classNameOfScroll: 'h-[calc(100vh-35rem)]'
  })
  const [dataDetailTransaction, setDataDetailTransaction] = useState<ITransaction>(initEmptyDetailTransactionData)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  // hooks
  // declare hooks
  const queryClient = useQueryClient()
  const { t, i18n } = useTranslation(['transaction', 'trackerTransaction'])
  const {
    getTransactions,
    getUnclassifiedTransactions,
    getTodayTransactions,
    updateTransaction,
    statusUpdate,
    deleteAnTransaction,
    deleteMultipleTransaction
  } = useTransaction()
  const { getAllAccountSource } = useAccountSource()
  const { classifyTransaction, isClassing: isPendingClassifyTransaction } = useTrackerTransaction()
  const { getAllTrackerTransactionType, createTrackerTxType, updateTrackerTxType, deleteTrackerType } =
    useTrackerTransactionType()
  const { user, fundId } = useStoreLocal()
  const { getMe } = useUser()
  const socket = useSocket()
  const { getAllExpenditureFund, getAdvancedExpenditureFund } = useExpenditureFund()
  const { getStatisticOverviewPage } = useOverviewPage()
  const { refetchGetStatisticOverviewPageData } = getStatisticOverviewPage(
    {
      daysToSubtract: 90
    },
    fundId
  )

  // fetch data
  const { getAllData: accountSourceData } = getAllAccountSource(fundId)
  const { dataTrackerTransactionType } = getAllTrackerTransactionType(fundId)
  const { dataTransaction, isGetTransaction } = getTransactions({ query: queryOptions, fundId })
  const { dataUnclassifiedTxs } = getUnclassifiedTransactions({
    query: uncTableQueryOptions,
    fundId
  })

  const { dataTodayTxs } = getTodayTransactions({ query: todayTableQueryOptions, fundId })
  const { isGetMeUserPending } = getMe(true)
  const { getAllExpenditureFundData, refetchAllExpendingFund } = getAllExpenditureFund()

  // custom hooks
  const { resetData: resetCacheTransaction } = useUpdateModel<IGetTransactionResponse>(
    [GET_ADVANCED_TRANSACTION_KEY, mergeQueryParams(queryOptions)],
    updateCacheDataTransactionForUpdate
  )
  const { resetData: resetCacheTrackerTxType } = useUpdateModel([GET_ALL_TRACKER_TRANSACTION_TYPE_KEY], () => {})
  const { resetData: resetCacheUnclassifiedTxs } = useUpdateModel(
    [GET_UNCLASSIFIED_TRANSACTION_KEY, mergeQueryParams(uncTableQueryOptions)],
    updateCacheDataClassifyFeat
  )
  const { resetData: resetCacheExpenditureFund } = useUpdateModel([GET_ADVANCED_EXPENDITURE_FUND_KEY], () => {})
  const { resetData: resetCacheStatistic } = useUpdateModel([STATISTIC_TRACKER_TRANSACTION_KEY], () => {})
  const { resetData: resetCacheAccountSource } = useUpdateModel([GET_ADVANCED_ACCOUNT_SOURCE_KEY], () => {})
  const { resetData: resetCacheDataTrackerTx } = useUpdateModel([GET_ADVANCED_TRACKER_TRANSACTION_KEY], () => {})
  const { resetData: resetCacheTodayTx } = useUpdateModel(
    [GET_TODAY_TRANSACTION_KEY, mergeQueryParams(todayTableQueryOptions)],
    updateCacheDataTodayTxClassifyFeat
  )

  const actionMap: Record<TTransactionActions, () => void> = {
    getTransactions: resetCacheTransaction,
    getTodayTransactions: resetCacheTodayTx,
    getUnclassifiedTransactions: resetCacheUnclassifiedTxs,
    getAllAccountSource: resetCacheAccountSource,
    getStatistic: resetCacheStatistic,
    getAllTrackerTransactionType: resetCacheTrackerTxType,
    getTrackerTransaction: resetCacheDataTrackerTx,
    getAllExpenditureFund: refetchAllExpendingFund,
    getExpenditureFund: resetCacheExpenditureFund,
    getStatisticOverview: refetchGetStatisticOverviewPageData
  }

  const callBackRefetchTransactionPage = (actions: TTransactionActions[]) => {
    actions.forEach((action) => {
      if (actionMap[action]) {
        actionMap[action]()
      }
    })
  }

  const refetchTransactionBySocket = () => {
    const token = getAccessTokenFromLocalStorage()
    const lastCalled = getTimeCountRefetchLimit()
    const now = Date.now()
    const timeLimit = 10000
    if (now - lastCalled >= timeLimit) {
      if (!isGetMeUserPending) {
        const userPayload: IUserPayloadForSocket = {
          userId: user?.id ?? '',
          roleId: user?.roleId ?? '',
          email: user?.email ?? '',
          fullName: user?.fullName ?? '',
          status: (user?.status as EUserStatus) ?? EUserStatus.ACTIVE,
          fundId,
          token: token ?? ''
        }
        console.log('userPayload', userPayload)

        if (socket) {
          setTimeCountRefetchLimit()
          toast.loading('Sending request... Please wait until it is completed!')
          socket.emit('refetchStarted', {
            user: userPayload
          })
        }
      }
    } else {
      toast.error('Please wait for a while before refetching the transaction!')
      return
    }
  }

  // effects
  useEffect(() => {
    if (dataUnclassifiedTxs) {
      setTransactionSummary((prev) => ({
        ...prev,
        unclassifiedTransaction: {
          data: modifyTransactionHandler(dataUnclassifiedTxs.data.data),
          count: dataUnclassifiedTxs.data.data.length,
          incomeAmount: dataUnclassifiedTxs.data.data
            .filter((e) => e.direction === ETypeOfTrackerTransactionType.INCOMING)
            .reduce((acc, cur) => {
              return acc + cur.amount
            }, 0),
          expenseAmount: dataUnclassifiedTxs.data.data
            .filter((e) => e.direction === ETypeOfTrackerTransactionType.EXPENSE)
            .reduce((acc, cur) => {
              return acc + cur.amount
            }, 0)
        }
      }))
      setUncDataTableConfig((prev) => ({ ...prev, totalPage: Number(dataUnclassifiedTxs.data.pagination?.totalPage) }))
    }
  }, [dataUnclassifiedTxs])

  // Khi ngôn ngữ thay đổi, lấy lại dữ liệu từ server
  useEffect(() => {
    const refetchData = async () => {
      try {
        await resetCacheTransaction()
      } catch (error) {
        console.error('Failed to refetch data:', error)
      }
    }

    refetchData()
  }, [i18n.language])

  useEffect(() => {
    if (dataTodayTxs) {
      setTransactionSummary((prev) => ({
        ...prev,
        transactionToday: {
          data: modifyTransactionHandler(dataTodayTxs.data),
          count: dataTodayTxs.data.length,
          incomeAmount: dataTodayTxs.data
            .filter((e) => e.direction === ETypeOfTrackerTransactionType.INCOMING)
            .reduce((acc, cur) => {
              return acc + cur.amount
            }, 0),
          expenseAmount: dataTodayTxs.data
            .filter((e) => e.direction === ETypeOfTrackerTransactionType.EXPENSE)
            .reduce((acc, cur) => {
              return acc + cur.amount
            }, 0)
        }
      }))
      setTodayDataTableConfig((prev) => ({ ...prev, totalPage: Number(dataTodayTxs.pagination?.totalPage) }))
    }
  }, [dataTodayTxs])

  useEffect(() => {
    if (socket) {
      socket.off(EPaymentEvents.REFETCH_COMPLETE)
      socket.on(EPaymentEvents.REFETCH_COMPLETE, (data: { message: string; status: string }) => {
        if (data.status == 'NO_NEW_TRANSACTION') {
          toast.success('No new transaction to fetch!', {
            duration: 2000
          })
        } else if (data.status == 'NEW_TRANSACTION') {
          toast.success(
            'Refetch transaction successfully - Found new transaction! Creating and reloading transactions...',
            {
              duration: 2000
            }
          )
          setIsOpenAgentDialog(true)
          setIsLoadingUnclassified(true)
        }
        setIsPendingRefetch(false)
      })
      socket.off(EPaymentEvents.CREATED_TRANSACTIONS)
      socket.on(EPaymentEvents.CREATED_TRANSACTIONS, (data: { message: string; status: string }) => {
        if (data.status === 'TRANSACTIONS_ARE_CREATED') {
          reloadDataFunction()
          callBackRefetchTransactionPage([
            'getUnclassifiedTransactions',
            'getStatistic',
            'getTodayTransactions',
            'getAllAccountSource',
            'getExpenditureFund',
            'getStatisticOverview'
          ])
          setUncDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          setTodayDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          setIsLoadingUnclassified(false)
          toast.success('Transactions successfully created and data refreshed!', {
            duration: 2000
          })
        }
        setIsPendingRefetch(false)
      })
    }
    return () => {
      socket?.off(EPaymentEvents.REFETCH_COMPLETE)
      socket?.off(EPaymentEvents.CREATED_TRANSACTIONS)
    }
  }, [socket])

  useEffect(() => {
    if (dataTrackerTransactionType)
      initTrackerTypeData(dataTrackerTransactionType.data, setIncomingTrackerType, setExpenseTrackerType)
  }, [dataTrackerTransactionType])
  useEffect(() => {
    if (dataTransaction) {
      setDataTable(modifyTransactionHandler(dataTransaction.data))
      setDataTableConfig((prev) => ({ ...prev, totalPage: Number(dataTransaction?.pagination?.totalPage) }))
    }
  }, [dataTransaction])
  useEffect(() => {
    setQueryOptions((prev) => ({ ...prev, page: dataTableConfig.currentPage, limit: dataTableConfig.limit }))
  }, [dataTableConfig])

  // Cập nhật dataTable khi dữ liệu thay đổi
  useEffect(() => {
    if (dataTransaction && dataTransaction.data) {
      try {
        const formattedData = modifyTransactionHandler(dataTransaction.data)

        setDataTable(formattedData)
        setDataTableConfig((prev) => ({
          ...prev,
          totalPage: Number(dataTransaction.pagination?.totalPage)
        }))
      } catch (error) {
        console.error('Error formatting transaction data:', error)
      }
    }
  }, [dataTransaction, i18n.language])

  useEffect(() => {
    setUncTableQueryOptions((prev) => ({
      ...prev,
      page: uncDataTableConfig.currentPage,
      limit: uncDataTableConfig.limit
    }))
  }, [uncDataTableConfig])
  useEffect(() => {
    setTodayTableQueryOptions((prev) => ({
      ...prev,
      page: todayDataTableConfig.currentPage,
      limit: todayDataTableConfig.limit
    }))
  }, [todayDataTableConfig])
  useEffect(() => {
    // set today data here
  }, [todayDataTableConfig])
  useEffect(() => {
    handleAccountBankRefetching(accountBankRefetchingQueue, accountBankRefetching, setAccountBankRefetching)
  }, [accountBankRefetchingQueue])

  const reloadDataFunction = () => {
    callBackRefetchTransactionPage([
      'getTransactions',
      'getTodayTransactions',
      'getUnclassifiedTransactions',
      'getAllAccountSource',
      'getStatistic',
      'getStatisticOverview'
    ])
    while (!isGetTransaction) {
      if (dataTransaction?.statusCode === 200) toast.success('Reload data successfully!')
      else toast.error('Failed to get transaction !')
      break
    }
  }

  // memos

  const columns = useMemo(() => {
    if (dataTable.length === 0) return []

    // Tạo cột selection (checkbox)
    const selectionColumn = {
      id: 'select',
      header: ({ table }: any) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false
    }

    // Tạo các cột dữ liệu
    const dataColumns = [
      {
        accessorKey: 'amount',
        header: ({ column }: any) => (
          <div className='flex' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {t('TransactionType.detailsConfigDialog.amount')}
            <ArrowUpDown className='ml-2 mt-1 h-3 w-3' />
          </div>
        ),
        cell: ({ row }: any) => <div>{row.getValue('amount')}</div>
      },
      {
        accessorKey: 'direction',
        header: ({ column }: any) => (
          <div className='flex' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {t('TransactionType.detailsConfigDialog.direction')}
            <ArrowUpDown className='ml-2 mt-1 h-3 w-3' />
          </div>
        ),
        cell: ({ row }: any) => {
          const directionValue = row.getValue('direction')
          // Chuyển đổi sang tiếng Việt
          let translatedDirection = ''

          if (directionValue === 'INCOMING') {
            translatedDirection = t('incoming', { ns: 'trackerTransaction' })
          } else if (directionValue === 'EXPENSE') {
            translatedDirection = t('expense', { ns: 'trackerTransaction' })
          } else {
            translatedDirection = directionValue
          }

          return (
            <span
              className={`rounded-full px-2 py-1 text-xs font-semibold ${directionValue === 'INCOMING' ? 'bg-green-200 text-green-800' : 'bg-rose-200 text-rose-800'}`}
            >
              {translatedDirection}
            </span>
          )
        }
      },
      {
        accessorKey: 'accountSource',
        header: ({ column }: any) => (
          <div className='flex' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {t('TransactionType.detailsConfigDialog.accountBank')}
            <ArrowUpDown className='ml-2 mt-1 h-3 w-3' />
          </div>
        ),
        cell: ({ row }: any) => <div>{row.getValue('accountSource')}</div>
      },
      {
        accessorKey: 'accountNo',
        header: ({ column }: any) => (
          <div className='flex' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {t('TransactionType.detailsConfigDialog.accountNo')}
            <ArrowUpDown className='ml-2 mt-1 h-3 w-3' />
          </div>
        ),
        cell: ({ row }: any) => <div>{row.getValue('accountNo')}</div>
      },
      {
        accessorKey: 'date',
        header: ({ column }: any) => (
          <div className='flex' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {t('transactionDetails.classificationTime')}
            <ArrowUpDown className='ml-2 mt-1 h-3 w-3' />
          </div>
        ),
        cell: ({ row }: any) => <div>{row.getValue('date')}</div>
      }
    ]

    return [selectionColumn, ...dataColumns]
  }, [dataTable, t])

  const dataTableButtons = initButtonInDataTableHeader({
    refetchTransactionBySocket,
    isPendingRefetch,
    reloadDataFunction
  })

  // Tạo một key duy nhất cho DataTable để đảm bảo re-render khi ngôn ngữ thay đổi
  const tableKey = useMemo(() => {
    return `transaction-table-${i18n.language}-${Math.random()}`
  }, [i18n.language])

  const deleteAnTransactionProps = {
    isDialogOpen: isDialogOpen.isDialogDeleteOpen,
    onDelete: () => {
      if (idDeletes.length > 0)
        handleDeleteTransaction({
          id: idDeletes[0],
          hookDelete: deleteAnTransaction,
          callBackOnSuccess: callBackRefetchTransactionPage,
          setDataTableConfig,
          setIsDialogOpen,
          setUncDataTableConfig,
          setTodayDataTableConfig,
          setIdDeletes
        })
    },
    onOpen: (rowData: any) => {
      setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: true }))
      setIdDeletes((prev) => [...prev, rowData.id])
    },
    onClose: () => {
      setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: false }))
      setIdDeletes([])
    }
  }

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>{t('transactionToday')}</span>
              <Button
                variant='outline'
                onClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogTransactionTodayOpen: true }))}
              >
                {t('viewAll')}
              </Button>
            </CardTitle>
            <CardDescription className='text-nowrap text-xs sm:text-sm'>
              {t('transactionTodayDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-2 p-4 text-sm sm:text-base'>
            <div className='flex items-center justify-between'>
              <div className='truncate'>{t('totalTransactions')}</div>
              <div className='text-lg font-bold sm:text-xl'>{transactionSummary.transactionToday.count}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div>{t('transaction:totalIncomeAmount')}</div>
              <div className='text-xl font-bold'>
                {formatCurrency(transactionSummary.transactionToday.incomeAmount, 'đ', 'vi-vn')}
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div>{t('transaction:totalExpenseAmount')}</div>
              <div className='text-xl font-bold'>
                {formatCurrency(transactionSummary.transactionToday.expenseAmount, 'đ', 'vi-vn')}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>{t('unclassifiedTransaction')}</span>
              <Button variant='outline' onClick={() => setIsOpenAgentDialog(true)}>
                {t('classify')}
              </Button>
            </CardTitle>
            <CardDescription className='text-xs sm:text-sm'>{t('unclassifiedTransactionDescription')}</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-2 p-4 text-sm sm:text-base'>
            <div className='flex items-center justify-between'>
              <div className='truncate'>{t('totalTransactions')}</div>
              <div className='text-lg font-bold sm:text-xl'>{transactionSummary.unclassifiedTransaction.count}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div>{t('transaction:totalIncomeAmount')}</div>
              <div className='text-xl font-bold'>
                {formatCurrency(transactionSummary.unclassifiedTransaction.incomeAmount, 'đ', 'vi-vn')}
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div>{t('transaction:totalExpenseAmount')}</div>
              <div className='text-xl font-bold'>
                {formatCurrency(transactionSummary.unclassifiedTransaction.expenseAmount, 'đ', 'vi-vn')}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent>
          <div>
            <DataTable
              key={tableKey}
              columns={columns}
              data={dataTable}
              config={dataTableConfig}
              setConfig={setDataTableConfig}
              onRowClick={(rowData) => {
                setTypeOfTrackerType(rowData.direction as ETypeOfTrackerTransactionType)
                setDataDetail(dataTransaction?.data.find((e) => e.id === rowData.id) || initEmptyDetailTransactionData)
                setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: true }))
              }}
              isLoading={isGetTransaction}
              buttons={dataTableButtons}
              onOpenDeleteAll={(ids: string[]) => {
                setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteAllOpen: true }))
                setIdDeletes(ids)
              }}
              onOpenDelete={(id: string) => {
                setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: true }))
                setIdDeletes([id])
              }}
              deleteProps={deleteAnTransactionProps}
            />
          </div>
        </CardContent>
        <TransactionDialog
          dataTable={{
            columns,
            advancedData: dataTransaction?.data || [],
            transactionTodayData: transactionSummary.transactionToday.data,
            unclassifiedTransactionData: transactionSummary.unclassifiedTransaction.data,
            setConfig: setDataTableConfig,
            config: dataTableConfig,
            setUncConfig: setUncDataTableConfig,
            uncConfig: uncDataTableConfig,
            setTodayConfig: setTodayDataTableConfig,
            todayConfig: todayDataTableConfig
          }}
          dialogDetailUpdate={{
            dataDetail,
            setDataDetail,
            accountSourceData: accountSourceData?.data ?? [],
            handleUpdate: (data: IUpdateTransactionBody, setIsEditing: React.Dispatch<React.SetStateAction<boolean>>) =>
              handleUpdateTransaction({
                data,
                setIsEditing,
                hookUpdate: updateTransaction,
                setDataTableConfig: setDataTableConfig,
                setDetailDialog: setDataDetail,
                callBackOnSuccess: callBackRefetchTransactionPage,
                setIsDialogOpen,
                queryClient
              }),
            statusUpdateTransaction: statusUpdate
          }}
          dialogState={{
            isDialogOpen: isDialogOpen,
            setIsDialogOpen: setIsDialogOpen
          }}
          classifyDialog={{
            incomeTrackerTransactionType: incomingTrackerType,
            expenseTrackerTransactionType: expenseTrackerType,
            handleClassify: (
              data: IClassifyTransactionBody,
              setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
            ) => {
              handleClassifyTransaction({
                payload: { ...data, fundId },
                hookClassify: classifyTransaction,
                setUncDataTableConfig: setUncDataTableConfig,
                setTodayDataTableConfig: setTodayDataTableConfig,
                setDataTableConfig: setDataTableConfig,
                setIsDialogOpen: setIsDialogOpen,
                setIsEditing,
                callBackOnSuccess: callBackRefetchTransactionPage,
                setDataDetail
              })
            },
            typeOfTrackerType,
            setTypeOfTrackerType
          }}
          dialogEditTrackerType={{
            handleCreateTrackerType: (
              data: ITrackerTransactionTypeBody,
              setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
            ) => {
              handleCreateTrackerTxType({
                payload: data,
                hookCreate: createTrackerTxType,
                callBackOnSuccess: callBackRefetchTransactionPage,
                setIsCreating
              })
            },
            handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => {
              handleUpdateTrackerTxType({
                payload: data,
                hookUpdate: updateTrackerTxType,
                callBackOnSuccess: callBackRefetchTransactionPage
              })
            },
            handleDeleteTrackerType: (id: string) =>
              handleDeleteTrackerTxType({
                id,
                hookDelete: deleteTrackerType,
                callBackOnSuccess: callBackRefetchTransactionPage
              }),
            expenditureFund: modifiedTrackerTypeForComboBox(getAllExpenditureFundData?.data || [])
          }}
          deleteProps={{
            deleteAnTransactionProps
          }}
        />
      </Card>
      <DeleteDialog
        customDescription='Bạn chắc chắn muốn xóa tất cả dữ liệu này?'
        onDelete={() => {
          if (idDeletes.length > 0)
            handleDeleteMultipleTransaction({
              ids: idDeletes,
              hookDelete: deleteMultipleTransaction,
              callBackOnSuccess: callBackRefetchTransactionPage,
              setDataTableConfig,
              setIsDialogOpen,
              setUncDataTableConfig,
              setTodayDataTableConfig,
              setIdDeletes
            })
        }}
        onClose={() => {
          setIdDeletes([])
          setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteAllOpen: false }))
        }}
        isDialogOpen={isDialogOpen.isDialogDeleteAllOpen}
      />
      <AgentDialog
        isOpen={isOpenAgentDialog}
        setOpen={setIsOpenAgentDialog}
        data={{
          transactions: dataUnclassifiedTxs?.data.data || [],
          messageAnalysis: dataUnclassifiedTxs?.data.messages
            ? dataUnclassifiedTxs.data.messages.replace(/<[^>]*>/g, '')
            : ''
        }}
        isLoading={isLoadingUnclassified}
        callBack={{
          handleCreateTrackerType: (
            data: ITrackerTransactionTypeBody,
            setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
          ) => {
            handleCreateTrackerTxType({
              payload: data,
              hookCreate: createTrackerTxType,
              callBackOnSuccess: callBackRefetchTransactionPage,
              setIsCreating
            })
          },
          handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => {
            handleUpdateTrackerTxType({
              payload: data,
              hookUpdate: updateTrackerTxType,
              callBackOnSuccess: callBackRefetchTransactionPage
            })
          },
          handleDeleteTrackerType: (id: string) =>
            handleDeleteTrackerTxType({
              id,
              hookDelete: deleteTrackerType,
              callBackOnSuccess: callBackRefetchTransactionPage
            }),
          handleClassifyTransaction: async (data: IClassifyTransactionBody) => {
            const status = await handleClassifyTransaction({
              payload: {
                ...data,
                fundId
              },
              callBackOnSuccess: callBackRefetchTransactionPage,
              hookClassify: classifyTransaction,
              setIsDialogOpen,
              setUncDataTableConfig: setDataTableUnclassifiedConfig,
              setDataTableConfig: setDataTableConfig,
              setDataDetail: setDataDetailTransaction
            })
            if (status === true) {
              setDetailDialogOpen(false)
            }
          }
        }}
        isClassifying={isPendingClassifyTransaction}
        incomeTrackerType={incomingTrackerType}
        expenseTrackerType={expenseTrackerType}
        expenditureFund={modifiedTrackerTypeForComboBox(getAllExpenditureFundData?.data || [])}
        detailDialogOpen={detailDialogOpen}
        setDetailDialogOpen={setDetailDialogOpen}
      />
    </div>
  )
}
