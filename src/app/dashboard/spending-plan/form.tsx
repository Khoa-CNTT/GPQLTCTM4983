'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import {
  Banknote,
  CalendarDays,
  CalendarIcon,
  CircleDollarSign,
  Clock,
  Coins,
  Flame,
  Hourglass,
  ListChecks,
  PiggyBank,
  Sparkles
} from 'lucide-react'
import { formatCurrency, formatDateTimeVN } from '@/libraries/utils'
import type { IDataTableConfig } from '@/types/common.i'
import { initTableConfig } from '@/constants/data-table'
import { Button } from '@/components/ui/button'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { DateRange } from 'react-day-picker'
import {
  modifySpendingPlanTableData,
  modifyTargetTableData,
  handleCreateSpendingPlan,
  handleUpdateSpendingPlan,
  handleDeleteItem,
  handleRestoreSpendingPlan,
  handleUpdateSpendingPlanStatus,
  handleCreateTarget,
  handleUpdateTarget,
  handleUpdateTargetStatus,
  handleRestoreTarget
} from './handlers'
import SpendingPlanDialog from './dialog'

import { useFundSavingTarget } from '@/core/fund-saving-target/hooks'
import NoDataPlaceHolder from '@/images/2.png'
import Image from 'next/image'
import {
  IBudgetTarget,
  IDialogFlags,
  IGetAllDataFundSavingTarget,
  ICreateFundSavingTargetRequest,
  IUpdateFundSavingTargetRequest,
  ITotalBudgetTarget,
  IPagination,
  IGetAllDataFundSavingTargetTable
} from '@/core/fund-saving-target/models/fund-saving-target.interface'
import { useTranslation } from 'react-i18next'
import {
  ICreateFundSavingPlanRequest,
  ISpendingPlan,
  ISpendingPlanTable,
  IUpdateFundSavingPlanRequest,
  TSpendingPlanActions
} from '@/core/fund-saving-plan/models'
import { useFundSavingPlan } from '@/core/fund-saving-plan/hooks'
import { initIsDialogOpenState, initDetailSpendingPlan } from './constant'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import {
  handleCreateTrackerTxType,
  handleDeleteTrackerTxType,
  handleUpdateTrackerTxType,
  initTrackerTypeData,
  modifiedTrackerTypeForComboBox
} from '../tracker-transaction/handlers'
import { useUpdateModel } from '@/hooks/useQueryModel'
import { GET_ADVANCED_EXPENDITURE_FUND_KEY } from '@/core/expenditure-fund/constants'
import { useTrackerTransactionType } from '@/core/tracker-transaction-type/hooks'
import { useExpenditureFund } from '@/core/expenditure-fund/hooks'
import { useOverviewPage } from '@/core/overview/hooks'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'

export default function SpendingPlanForm() {
  const { t } = useTranslation(['common', 'spendingPlan'])

  // states
  const [spendingPlans, setSpendingPlans] = useState<ISpendingPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<ISpendingPlan>(initDetailSpendingPlan)
  const [selectedTarget, setSelectedTarget] = useState<IBudgetTarget | null>(null)
  const [targets, setTargets] = useState<IBudgetTarget[]>([])
  const [totalBudgetTarget, setTotalBudgetTarget] = useState<ITotalBudgetTarget | null>(null)
  const [targetPagination, setTargetPagination] = useState<IGetAllDataFundSavingTarget['pagination'] | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [statusFilter, setStatusFilter] = useState('all')
  const [planTypeFilter, setPlanTypeFilter] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL'>('MONTHLY')
  const [isDialogOpen, setIsDialogOpen] = useState<IDialogFlags>(initIsDialogOpenState)
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>({
    ...initTableConfig,
    isVisibleSortType: false,
    classNameOfScroll: 'h-[400px]'
  })
  const [targetTableConfig, setTargetTableConfig] = useState<IDataTableConfig>({
    ...initTableConfig,
    isVisibleSortType: false,
    classNameOfScroll: 'h-[400px]'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [incomingTrackerType, setIncomingTrackerType] = useState<ITrackerTransactionType[]>([])
  const [expenseTrackerType, setExpenseTrackerType] = useState<ITrackerTransactionType[]>([])

  const { fundId } = useStoreLocal()

  // hooks
  const {
    getAllFundSavingPlan,
    createFundSavingPlan,
    updateFundSavingPlan,
    deleteFundSavingPlan,
    restoreFundSavingPlan
  } = useFundSavingPlan()
  const {
    getAllFundSavingTarget,
    createFundSavingTarget,
    updateFundSavingTarget,
    deleteFundSavingTarget,
    restoreFundSavingTarget
  } = useFundSavingTarget()
  const {
    getAllData: getAllDataTarget,
    isGetAllPending: isGetAllPendingTarget,
    refetchAllData: refetchAllDataTarget
  } = getAllFundSavingTarget(fundId)
  const {
    getAllData: getAllDataPlan,
    isGetAllPending: isGetAllPendingPlant,
    refetchAllData: refetchAllDataPlant
  } = getAllFundSavingPlan(fundId)
  const { resetData: resetCacheExpenditureFund } = useUpdateModel([GET_ADVANCED_EXPENDITURE_FUND_KEY], () => {})
  const { getAllTrackerTransactionType, createTrackerTxType, updateTrackerTxType, deleteTrackerType } =
    useTrackerTransactionType()
  const { dataTrackerTransactionType, refetchTrackerTransactionType } = getAllTrackerTransactionType(fundId)
  const { getAllExpenditureFund } = useExpenditureFund()
  const { getAllExpenditureFundData } = getAllExpenditureFund()
  const { getStatisticOverviewPage } = useOverviewPage()
  const { refetchGetStatisticOverviewPageData } = getStatisticOverviewPage(
    {
      daysToSubtract: 90
    },
    fundId
  )

  const actionMap: Record<TSpendingPlanActions, () => void> = {
    getAllSpendingPlans: refetchAllDataPlant,
    getAllTargets: refetchAllDataTarget,
    getExpenditureFund: resetCacheExpenditureFund,
    getAllTrackerTransactionType: refetchTrackerTransactionType,
    getStatisticOverviewPage: refetchGetStatisticOverviewPageData
  }

  const callBackRefetchAPI = (actions: TSpendingPlanActions[]) => {
    actions.forEach((action) => {
      if (actionMap[action]) {
        actionMap[action]()
      }
    })
  }

  // effects
  useEffect(() => {
    if (dataTrackerTransactionType)
      initTrackerTypeData(dataTrackerTransactionType.data, setIncomingTrackerType, setExpenseTrackerType)
  }, [dataTrackerTransactionType])

  useEffect(() => {
    if (getAllDataPlan && getAllDataPlan?.data) {
      setSpendingPlans(getAllDataPlan?.data || [])
    }

    if (getAllDataTarget && getAllDataTarget?.data) {
      setTargets(getAllDataTarget?.data?.budgetTargets?.data || [])
      setTargetPagination(getAllDataTarget?.data?.budgetTargets?.pagination || null)
    }
  }, [getAllDataPlan, getAllDataTarget])

  const totalPlannedAmount = useMemo(() => {
    return spendingPlans.reduce((acc, plan) => acc + plan.targetAmount, 0)
  }, [spendingPlans])

  const maxTargetRemainingDays = useMemo(() => {
    if (!targets || targets.length === 0) return 0
    return Math.max(...targets.map((target) => target.remainingDays))
  }, [targets])

  const upcomingPlans = useMemo(() => {
    const now = new Date()
    const sevenDaysFromNow = new Date(now)
    sevenDaysFromNow.setDate(now.getDate() + 7)

    return spendingPlans
      .filter((plan) => {
        if (planTypeFilter !== 'MONTHLY' && plan.type !== planTypeFilter) {
          return false
        }

        const planDate = new Date(plan.expectedDate)
        return planDate
      })
      .sort((a, b) => new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime())
  }, [spendingPlans, planTypeFilter])

  const transformedSpendingPlanData = useMemo(() => {
    return modifySpendingPlanTableData(
      spendingPlans
        .filter((plan) => statusFilter === 'all' || plan.type === statusFilter)
        .filter(
          (plan) =>
            !searchQuery ||
            plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plan.trackerTypeName?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((plan) => {
          if (!dateRange || !dateRange.from) return true
          const planDate = new Date(plan.expectedDate)
          if (dateRange.to) {
            return planDate >= dateRange.from && planDate <= dateRange.to
          }
          return planDate >= dateRange.from
        })
    )
  }, [spendingPlans, statusFilter, searchQuery, dateRange])

  const planColumns = useMemo(() => {
    if (transformedSpendingPlanData.length === 0) return []
    return getColumns<ISpendingPlanTable>({
      headers: ['Name', 'Target Amount', 'Expected Date', 'Expired Date', 'Type'],
      isSort: true
    })
  }, [transformedSpendingPlanData])

  const targetColumns = useMemo(() => {
    if (targets.length === 0) return []
    return getColumns<IGetAllDataFundSavingTargetTable>({
      headers: ['Name', 'Target Amount', 'Current Amount', 'Start Date', 'End Date', 'Status'],
      isSort: true
    })
  }, [targets])

  const openDialog = (type: keyof IDialogFlags, data?: any) => {
    if ((type === 'isDialogDetailTargetOpen' || type === 'isDialogEditTargetOpen') && data) {
      setSelectedTarget(data)
    } else if ((type === 'isDialogDetailPlanOpen' || type === 'isDialogEditPlanOpen') && data) {
      setSelectedPlan(data)
    }
    setIsDialogOpen((prev) => ({ ...prev, [type]: true }))
  }

  const transformedTargetData = useMemo(() => {
    return modifyTargetTableData(
      targets
        .filter((target) => statusFilter === 'all' || target.status === statusFilter)
        .filter(
          (target) =>
            !searchQuery ||
            target.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            target.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    )
  }, [targets, statusFilter, searchQuery])

  return (
    <div className='mx-auto flex h-[calc(100vh-10rem)] flex-col'>
      <div className='grid flex-shrink-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {/* Total Budget Card */}
        <Card className='group relative overflow-hidden bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 shadow-md shadow-blue-200 transition-all duration-300 hover:shadow-xl dark:shadow-blue-900/20'>
          <CardHeader className='px-4 pb-4 md:px-6'>
            <CardTitle className='md:text-md line-clamp-1 text-sm font-medium text-white 2xl:text-lg'>
              {t('spendingPlan:cardTitles.totalBudget')}
            </CardTitle>
          </CardHeader>
          <CardContent className='px-4 md:px-6'>
            <div className='flex items-center justify-between'>
              <PiggyBank className='h-8 w-8 flex-shrink-0 animate-pulse text-white opacity-75 md:h-12 md:w-12' />
              <div className='ml-2 text-right'>
                <p className='truncate text-lg font-bold text-white md:text-xl lg:text-2xl'>
                  {formatCurrency(getAllDataTarget?.data.totalBudgetTarget || 0, 'đ')}
                </p>
                <p className='line-clamp-1 text-xs text-blue-100 md:text-sm'>
                  {t('spendingPlan:cardDetails.totalBudgetPlan')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spent Amount Card */}
        <Card className='group relative overflow-hidden bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 shadow-md shadow-rose-200 transition-all duration-300 hover:shadow-xl dark:shadow-rose-900/20'>
          <CardHeader className='px-4 pb-2 md:px-6'>
            <CardTitle className='md:text-md line-clamp-1 text-sm font-medium text-white 2xl:text-lg'>
              {t('spendingPlan:cardTitles.spent')}
            </CardTitle>
          </CardHeader>
          <CardContent className='px-4 md:px-6'>
            <div className='flex items-center justify-between'>
              <Banknote className='h-8 w-8 flex-shrink-0 animate-pulse text-white opacity-75 md:h-12 md:w-12' />
              <div className='ml-2 text-right'>
                <p className='truncate text-lg font-bold text-white md:text-xl lg:text-2xl'>
                  {formatCurrency(getAllDataTarget?.data.spentAmount || 0, 'đ')}
                </p>
                <p className='line-clamp-1 text-xs text-rose-100 md:text-sm'>
                  {t('spendingPlan:cardDetails.used')}{' '}
                  {Math.round(
                    getAllDataTarget
                      ? (getAllDataTarget.data.spentAmount * 100) / getAllDataTarget?.data.totalBudgetTarget
                      : 0
                  )}
                  %
                </p>
              </div>
            </div>
            <div className='mt-3 flex items-end justify-end md:mt-4'>
              {totalBudgetTarget && totalBudgetTarget.averageDailyPercentage > 1.5 && (
                <Badge className='border-none bg-white/20 px-1.5 py-0.5 text-xs text-white'>
                  <Flame className='mr-1 h-3 w-3' />{' '}
                  <span className='line-clamp-1'>{t('spendingPlan:cardDetails.highSpendingRate')}</span>
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Remaining Budget Card */}
        <Card className='group relative overflow-hidden bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 shadow-md shadow-emerald-200 transition-all duration-300 hover:shadow-xl dark:shadow-emerald-900/20'>
          <CardHeader className='px-4 pb-2 md:px-6'>
            <CardTitle className='md:text-md line-clamp-1 flex items-center justify-between text-sm font-medium text-white 2xl:text-lg'>
              {t('spendingPlan:cardTitles.remaining')}

              <div className='flex items-end'>
                <Badge className='border-none bg-white/20 px-1.5 py-0.5 text-xs text-white'>
                  <Clock className='mr-1 h-3 w-3' />
                  <span className='line-clamp-1'>
                    {maxTargetRemainingDays} {t('spendingPlan:cardDetails.daysLeft')}
                  </span>
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className='px-4 md:px-6'>
            <div className='flex items-center justify-between'>
              <Coins className='h-8 w-8 flex-shrink-0 animate-pulse text-white opacity-75 md:h-12 md:w-12' />
              <div className='ml-2 text-right'>
                <p className='truncate text-lg font-bold text-white md:text-xl lg:text-2xl'>
                  {formatCurrency(getAllDataTarget?.data.remainAmount || 0, 'đ')}
                </p>
                <p className='line-clamp-1 text-xs text-emerald-100 md:text-sm'>
                  {t('spendingPlan:cardDetails.remaining')}{' '}
                  {Math.round(
                    getAllDataTarget
                      ? (getAllDataTarget.data.remainAmount * 100) / getAllDataTarget.data.totalBudgetTarget
                      : 0
                  )}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Planned Spending Card */}
        <Card className='group relative overflow-hidden bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 shadow-md shadow-amber-200 transition-all duration-300 hover:shadow-xl dark:shadow-amber-900/20'>
          <CardHeader className='px-4 pb-2 md:px-6'>
            <CardTitle className='md:text-md line-clamp-1 flex items-center justify-between text-sm font-medium text-white 2xl:text-lg'>
              {t('spendingPlan:cardTitles.plannedSpending')}

              <div className='flex items-end'>
                {upcomingPlans.length > 0 && (
                  <Badge className='border-none bg-white/20 px-1.5 py-0.5 text-xs text-white'>
                    <span className='line-clamp-1'>
                      {upcomingPlans.length} {t('spendingPlan:cardDetails.upcomingPlans')}
                    </span>
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className='px-4 md:px-6'>
            <div className='flex items-center justify-between'>
              <CalendarDays className='h-8 w-8 flex-shrink-0 animate-pulse text-white opacity-75 md:h-12 md:w-12' />
              <div className='ml-2 text-right'>
                <p className='truncate text-lg font-bold text-white md:text-xl lg:text-2xl'>
                  {formatCurrency(totalPlannedAmount, 'đ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Budget Targets & Upcoming Plans */}
      <div className='mt-6 grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Budget Targets Section */}
        <div className='flex min-h-[calc(60%)] flex-col lg:col-span-2'>
          <Card className='flex h-full flex-col border shadow-md'>
            <CardHeader className='flex-shrink-0 border-b pb-2'>
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <div className='flex items-center gap-2'>
                  <CardTitle className='text-base lg:text-lg'>{t('spendingPlan:budgetSection.title')}</CardTitle>
                  <CircleDollarSign className='h-5 w-5 text-emerald-500' />
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                  <Button
                    variant='outline'
                    onClick={() => openDialog('isDialogViewAllDataOpen')}
                    className='flex h-8 items-center gap-1.5 px-2 text-xs shadow-sm sm:h-9 sm:px-4 sm:text-sm'
                    size='sm'
                  >
                    <ListChecks className='h-3.5 w-3.5' /> {t('spendingPlan:budgetSection.viewAll')}
                  </Button>
                  <Button
                    variant='default'
                    className='h-8 bg-emerald-600 px-2 text-xs shadow-sm hover:bg-emerald-700 sm:h-9 sm:px-4 sm:text-sm'
                    onClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogCreateTargetOpen: true }))}
                    size='sm'
                  >
                    <CircleDollarSign className='mr-1.5 h-3.5 w-3.5' /> {t('spendingPlan:budgetSection.createBudget')}
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Card content with scroll */}
            <div className='relative min-h-0 flex-1'>
              <ScrollArea className='absolute inset-0 h-full'>
                <CardContent className='p-4'>
                  {targets.length > 0 ? (
                    <div className='space-y-4'>
                      {targets.map((target) => {
                        const percentage = Math.round((target.currentAmount / target.targetAmount) * 100)
                        const isNearlyComplete = percentage >= 90

                        return (
                          <div
                            key={target.id}
                            onClick={() => openDialog('isDialogDetailTargetOpen', target)}
                            className='cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50/50 hover:shadow-md dark:bg-gray-950/50 dark:hover:bg-emerald-950/10'
                          >
                            <div className='flex items-start gap-3'>
                              <div
                                className={`rounded-lg p-2 ${
                                  isNearlyComplete
                                    ? 'bg-amber-100 dark:bg-amber-900/30'
                                    : 'bg-emerald-100 dark:bg-emerald-900/30'
                                }`}
                              >
                                <CircleDollarSign
                                  className={`h-5 w-5 ${
                                    isNearlyComplete
                                      ? 'text-amber-600 dark:text-amber-400'
                                      : 'text-emerald-600 dark:text-emerald-400'
                                  }`}
                                />
                              </div>
                              <div className='flex-1'>
                                <div className='flex items-center justify-between'>
                                  <h3 className='font-medium'>{target.name}</h3>
                                  <Badge
                                    className={`text-xs ${target.trackerTypeDirection === ETypeOfTrackerTransactionType.INCOMING ? 'border-green-500 bg-green-500 text-white hover:bg-green-600 dark:border-green-700 dark:bg-green-700 dark:text-green-200 dark:hover:bg-green-800' : 'border-rose-500 bg-rose-500 text-white hover:bg-rose-600 dark:border-rose-700 dark:bg-rose-700 dark:text-rose-200 dark:hover:bg-rose-800'}`}
                                  >
                                    {target.trackerTypeName || t('spendingPlan:targetDetails.uncategorized')}
                                  </Badge>
                                </div>

                                <div className='mt-3'>
                                  <div className='mb-1.5 flex justify-between text-sm'>
                                    <span className='text-muted-foreground'>
                                      {t('spendingPlan:targetDetails.progress')}:
                                    </span>
                                    <span
                                      className={`font-medium ${isNearlyComplete ? 'text-amber-600' : 'text-emerald-600'}`}
                                    >
                                      {percentage}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={percentage}
                                    className={`h-2 ${isNearlyComplete ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}
                                  />
                                </div>

                                <div className='mt-3 grid grid-cols-3 gap-2 text-sm'>
                                  <div>
                                    <p className='text-xs text-muted-foreground'>
                                      {t('spendingPlan:targetDetails.target')}
                                    </p>
                                    <p className='font-medium'>{formatCurrency(target.targetAmount, 'đ')}</p>
                                  </div>
                                  <div>
                                    <p className='text-xs text-muted-foreground'>
                                      {t('spendingPlan:targetDetails.spent')}
                                    </p>
                                    <p className='font-medium'>{formatCurrency(target.currentAmount, 'đ')}</p>
                                  </div>
                                  <div>
                                    <p className='text-xs text-muted-foreground'>
                                      {t('spendingPlan:targetDetails.remaining')}
                                    </p>
                                    <p className='font-medium text-emerald-600'>{formatCurrency(target.remain, 'đ')}</p>
                                  </div>
                                </div>

                                <div className='mt-3 flex justify-between text-xs text-muted-foreground'>
                                  <span>
                                    {target.remainingDays >= 0
                                      ? target.remainingDays + ' days'
                                      : 'Expired ' + target + ' days'}
                                  </span>
                                  <Badge variant='outline' className='h-4 text-[10px]'>
                                    {target.status === 'ACTIVE'
                                      ? t('spendingPlan:targetDetails.active')
                                      : t('spendingPlan:targetDetails.inactive')}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className='flex min-h-[calc(60%)] flex-col items-center justify-center py-8'>
                      <Image
                        src={NoDataPlaceHolder}
                        alt='No data'
                        width={100}
                        height={100}
                        className='mb-4 select-none object-contain opacity-60'
                      />
                      <h3 className='mb-2 text-lg font-medium'>{t('spendingPlan:budgetSection.noBudgets')}</h3>
                      <p className='mb-6 max-w-md text-center text-muted-foreground'>
                        {t('spendingPlan:budgetSection.noBudgetsDescription')}
                      </p>
                      <Button
                        variant='default'
                        className='bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
                        onClick={() => openDialog('isDialogCreateTargetOpen')}
                      >
                        <CircleDollarSign className='mr-2 h-4 w-4' />
                        {t('spendingPlan:budgetSection.createFirstBudget')}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </ScrollArea>
            </div>

            {targets.length > 5 && (
              <div className='flex-shrink-0 border-t bg-gray-50 p-3 dark:bg-gray-800/50'>
                <Button
                  variant='outline'
                  onClick={() => openDialog('isDialogViewAllDataOpen')}
                  className='z-50 w-full shadow-sm'
                >
                  <ListChecks className='mr-2 h-4 w-4' />
                  {t('spendingPlan:budgetSection.viewAll')}
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Upcoming Plans Section */}
        <div className='flex min-h-[calc(60%)] flex-col lg:col-span-1'>
          <Card className='flex h-full flex-col border shadow-md'>
            <CardHeader className='flex-shrink-0 border-b pb-4'>
              <div className='flex items-center justify-between gap-3'>
                <div className='flex items-center gap-2'>
                  <CardTitle className='text-base lg:text-lg'>{t('spendingPlan:planSection.title')}</CardTitle>
                  <CalendarDays className='h-5 w-5 text-blue-500' />
                </div>
                <Button
                  variant='default'
                  className='bg-blue-600 shadow-sm hover:bg-blue-700'
                  onClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogCreatePlanOpen: true }))}
                  size='sm'
                >
                  <Sparkles className='mr-1.5 h-3.5 w-3.5' />
                  <span className='truncate'>{t('spendingPlan:planSection.createPlan')}</span>
                </Button>
              </div>
            </CardHeader>

            <div className='relative min-h-0 flex-1'>
              <ScrollArea className='absolute inset-0 h-full'>
                <CardContent className='p-4'>
                  {upcomingPlans.length > 0 ? (
                    <div className='space-y-6'>
                      <div className='space-y-3'>
                        {upcomingPlans.map((plan) => {
                          const isNearDate =
                            new Date(plan.expectedDate).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000

                          return (
                            <div
                              key={plan.id}
                              onClick={() => openDialog('isDialogDetailPlanOpen', plan)}
                              className='cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all hover:border-gray-200 hover:bg-gray-100 hover:shadow-md dark:bg-gray-950/50 dark:hover:border-gray-700 dark:hover:bg-gray-800/50'
                            >
                              {/* First row: Name, Tracker name, and Upcoming badge */}
                              <div className='mb-4 flex items-center justify-between'>
                                <div className='min-w-0 flex-1 overflow-hidden truncate whitespace-nowrap text-base font-medium text-gray-900 dark:text-white'>
                                  {plan.name.length > 35 ? plan.name.substring(0, 35) + '...' : plan.name}
                                </div>

                                <div className='flex flex-shrink-0 items-center gap-2.5'>
                                  <div
                                    className={`flex items-center gap-1 rounded-md px-2 py-1 ${plan.trackerTypeDirection === ETypeOfTrackerTransactionType.INCOMING ? 'border-green-500 bg-green-500 text-white dark:border-green-700 dark:bg-green-700 dark:text-green-200' : 'border-rose-500 bg-rose-500 text-white dark:border-rose-700 dark:bg-rose-700 dark:text-rose-200'}`}
                                  >
                                    <span className='text-xs font-medium'>{plan.trackerTypeName}</span>
                                  </div>

                                  {isNearDate && (
                                    <Badge
                                      variant='outline'
                                      className='rounded-full border-orange-300 bg-orange-100 px-2.5 py-0.5 text-xs text-orange-600 dark:border-orange-600/50 dark:bg-orange-950/30 dark:text-orange-400'
                                    >
                                      {t('spendingPlan:planDetails.upcoming')}
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Second row: Expected date and Amount */}
                              <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1.5 text-sm text-gray-700 dark:bg-gray-800/30 dark:text-gray-300'>
                                  <CalendarIcon className='h-3 w-3 text-gray-500' />
                                  <span className='text-gray-700 dark:text-gray-400'>
                                    {t('spendingPlan:cardDetails.expectedDate')}:
                                  </span>
                                  <span className='font-medium text-gray-900 dark:text-gray-200'>
                                    {formatDateTimeVN(plan.expectedDate, false)}
                                  </span>
                                </div>

                                <div className='text-2xl font-semibold tracking-wide text-blue-600 dark:text-blue-400'>
                                  {formatCurrency(plan.targetAmount, 'đ')}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className='flex min-h-[calc(60%)] flex-col items-center justify-center py-8'>
                      <CalendarDays className='mb-4 h-16 w-16 text-muted-foreground opacity-50' />
                      <h3 className='mb-2 text-lg font-medium'>{t('spendingPlan:planSection.noPlans')}</h3>
                      <p className='mb-6 max-w-md text-center text-muted-foreground'>
                        {t('spendingPlan:planSection.noPlansDescription')}
                      </p>
                      <Button
                        variant='default'
                        className='bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
                        onClick={() => openDialog('isDialogCreatePlanOpen')}
                      >
                        <Sparkles className='mr-2 h-4 w-4' />
                        {t('spendingPlan:planSection.createFirstPlan')}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </ScrollArea>
            </div>

            {upcomingPlans.length > 5 && (
              <div className='flex-shrink-0 border-t bg-gray-50 p-3 dark:bg-gray-800/50'>
                <Button
                  variant='outline'
                  onClick={() => openDialog('isDialogViewAllPlansOpen')}
                  className='w-full shadow-sm'
                >
                  <ListChecks className='mr-2 h-4 w-4' />
                  {t('spendingPlan:planSection.viewAll')} <span className='ml-1'>{upcomingPlans.length}</span>{' '}
                  {t('spendingPlan:cardDetails.upcomingPlans')}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      <SpendingPlanDialog
        plansDialog={{
          transformedSpendingPlanData,
          planColumns,
          dataTableConfig,
          setDataTableConfig,
          spendingPlans,
          setSelectedPlan,
          isLoading: isGetAllPendingPlant
        }}
        targetsDialog={{
          transformedTargetData,
          targetColumns,
          targetTableConfig,
          setTargetTableConfig,
          targets,
          setSelectedTarget,
          isLoading: isGetAllPendingTarget
        }}
        sharedDialogElements={{
          isDialogOpen,
          setIsDialogOpen,
          selectedPlan,
          selectedTarget
        }}
        callBack={{
          handleCreateTrackerType: (
            data: ITrackerTransactionTypeBody,
            setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
          ) => {
            handleCreateTrackerTxType({
              payload: data,
              hookCreate: createTrackerTxType,
              callBackOnSuccess: callBackRefetchAPI,
              setIsCreating
            })
          },
          handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => {
            handleUpdateTrackerTxType({
              payload: data,
              hookUpdate: updateTrackerTxType,
              callBackOnSuccess: callBackRefetchAPI
            })
          },
          handleDeleteTrackerType: (id: string) =>
            handleDeleteTrackerTxType({
              id,
              hookDelete: deleteTrackerType,
              callBackOnSuccess: callBackRefetchAPI
            }),
          onCreatePlan: (plan: ICreateFundSavingPlanRequest) =>
            handleCreateSpendingPlan({
              data: { ...plan, fundId },
              hookCreate: createFundSavingPlan,
              setIsDialogOpen,
              callBackRefetchAPI,
              setDataTableConfig
            }),
          onUpdatePlan: (plan: IUpdateFundSavingPlanRequest) =>
            handleUpdateSpendingPlan({
              data: plan,
              hookUpdate: updateFundSavingPlan,
              setIsDialogOpen,
              callBackRefetchAPI,
              setDataTableConfig
            }),
          onDeletePlan: (id: string) =>
            handleDeleteItem({
              data: { id },
              hookDelete: deleteFundSavingPlan,
              setIsDialogOpen,
              callBackRefetchAPI,
              setDataTableConfig
            }),
          onRestorePlan: (id: string) =>
            handleRestoreSpendingPlan({
              data: { id },
              hookRestore: restoreFundSavingPlan,
              callBackRefetchAPI,
              setDataTableConfig,
              setIsDialogOpen
            }),
          onUpdatePlanStatus: (id: string, status: string) =>
            handleUpdateSpendingPlanStatus({
              data: { id, status },
              hookUpdateStatus: updateFundSavingPlan,
              callBackRefetchAPI,
              setDataTableConfig,
              setIsDialogOpen
            }),

          onCreateTarget: (target: ICreateFundSavingTargetRequest) =>
            handleCreateTarget({
              data: { ...target, fundId },
              hookCreate: createFundSavingTarget,
              setIsDialogOpen,
              callBackRefetchAPI,
              setDataTableConfig: setTargetTableConfig
            }),
          onUpdateTarget: (target: IUpdateFundSavingTargetRequest) =>
            handleUpdateTarget({
              data: target,
              hookUpdate: updateFundSavingTarget,
              setIsDialogOpen,
              callBackRefetchAPI,
              setDataTableConfig: setTargetTableConfig
            }),
          onDeleteTarget: (id: string) =>
            handleDeleteItem({
              data: { id },
              hookDelete: deleteFundSavingTarget,
              setIsDialogOpen,
              callBackRefetchAPI,
              setDataTableConfig: setTargetTableConfig
            }),
          onRestoreTarget: (id: string) =>
            handleRestoreTarget({
              data: { id },
              hookRestore: restoreFundSavingTarget,
              callBackRefetchAPI,
              setDataTableConfig: setTargetTableConfig,
              setIsDialogOpen
            }),
          onUpdateTargetStatus: (id: string, status: string) =>
            handleUpdateTargetStatus({
              data: { id, status },
              hookUpdateStatus: updateFundSavingTarget,
              callBackRefetchAPI,
              setDataTableConfig: setTargetTableConfig,
              setIsDialogOpen
            }),

          onGetAllFundSavingTarget: () => targets,
          onGetAllFundSavingPlan: () => spendingPlans
        }}
        incomeTrackerType={incomingTrackerType}
        expenseTrackerType={expenseTrackerType}
        expenditureFund={modifiedTrackerTypeForComboBox(getAllExpenditureFundData?.data || [])}
      />
    </div>
  )
}
