"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  PieChart,
  Target,
  Clock,
  Wallet,
  PiggyBank,
  BarChart3,
} from "lucide-react"
import { LineChart } from "@/components/core/charts/LineChart"
import { BalanceChart } from "@/components/core/charts/BalanceChart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import NoDataPlaceHolder from "@/images/2.png"
import { formatCurrency } from "@/libraries/utils"
import { useTranslation } from "react-i18next"

// Hooks and types
import { useOverviewPage } from "@/core/overview/hooks"
import { useStoreLocal } from "@/hooks/useStoreLocal"
import { useAccountSource } from "@/core/account-source/hooks"
import type {
  ICashFlowAnalysisStatistic,
  ITotalAmount,
  ITotalBalanceChart,
} from "@/core/overview/models/overview.interface"
import type { ChartConfig } from "@/components/ui/chart"

// Utilities
import { initDataStatisticAccountBalance, initDataStatisticCashFlowAnalysis } from "./handler"
import { initEmptyBalanceChartConfig, initEmptyTotalAmount } from "./constants"

export default function DashboardForm() {
  const { t } = useTranslation(['overview', 'common']);

  const { fundId } = useStoreLocal()
  const { getStatisticOverviewPage } = useOverviewPage()
  const { getStatisticAccountBalance } = useAccountSource()

  const [timeRange, setTimeRange] = useState<string>("30d")
  const [daysToSubtract, setDaysToSubtract] = useState(30)
  const [timestamp, setTimestamp] = useState(Date.now())

  // Chart data state
  const [cashFlowAnalysisChartData, setCashFlowAnalysisChartData] = useState<ICashFlowAnalysisStatistic[]>([])
  const [balanceChartData, setBalanceChartData] = useState<ITotalBalanceChart[]>([])
  const [balanceChartConfig, setBalanceChartConfig] = useState<ChartConfig>(initEmptyBalanceChartConfig)

  // Financial metrics state
  const [totalIncome, setTotalIncome] = useState<ITotalAmount>(initEmptyTotalAmount)
  const [totalExpenses, setTotalExpenses] = useState<ITotalAmount>(initEmptyTotalAmount)
  const [currentBalance, setCurrentBalance] = useState(0)

  const { getStatisticAccountBalanceData } = getStatisticAccountBalance(fundId)
  const { getStatisticOverviewPageData } = getStatisticOverviewPage({ daysToSubtract, _t: timestamp }, fundId)


  useEffect(() => {
    if (timeRange === "30d") {
      setDaysToSubtract(30)
    } else if (timeRange === "7d") {
      setDaysToSubtract(7)
    } else {
      setDaysToSubtract(90)
    }
  }, [timeRange])

  useEffect(() => {
    if (getStatisticOverviewPageData) {
      setTotalIncome(getStatisticOverviewPageData.data.totalIncome || initEmptyTotalAmount)
      setTotalExpenses(getStatisticOverviewPageData.data.totalExpenses || initEmptyTotalAmount)
      setCurrentBalance(getStatisticOverviewPageData.data.currentBalance || 0)

      initDataStatisticCashFlowAnalysis({
        data: getStatisticOverviewPageData.data,
        setCashFlowAnalysisChartData,
        setTotalIncome,
        setTotalExpenses,
      })
    }
  }, [getStatisticOverviewPageData, daysToSubtract])

  useEffect(() => {
    if (getStatisticAccountBalanceData && getStatisticAccountBalanceData.data.length > 0) {
      initDataStatisticAccountBalance({
        data: getStatisticAccountBalanceData.data,
        setBalanceChartConfig,
        setBalanceChartData,
      })
    }
  }, [getStatisticAccountBalanceData, daysToSubtract])

  const totalTargets = getStatisticOverviewPageData?.data.statisticBudgetTargetAndPlan?.reduce((acc, curr) => acc + curr.targetStatistic.total, 0) || 0
  const successfulTargets = getStatisticOverviewPageData?.data.statisticBudgetTargetAndPlan?.reduce((acc, curr) => acc + curr.targetStatistic.successed, 0) || 0
  const totalPlans = getStatisticOverviewPageData?.data.statisticBudgetTargetAndPlan?.reduce((acc, curr) => acc + curr.planStatistic.total, 0) || 0
  const successfulPlans = getStatisticOverviewPageData?.data.statisticBudgetTargetAndPlan?.reduce((acc, curr) => acc + curr.planStatistic.successed, 0) || 0
  const recentTransactionsCount = getStatisticOverviewPageData?.data.recentTransactions?.length || 0

  return (
    <div className="flex flex-col space-y-3 h-full">
      {/* Key metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Current Balance Card */}
        <Card className="dark:bg-[#1e1a2c] border border-gray-200 dark:border-gray-800 overflow-hidden h-[100px] group hover:border-purple-400/50 transition-colors">
          <CardContent className="p-3 h-full">
            <div className="flex justify-between items-center h-full relative">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-md bg-purple-900/30 p-1.5">
                    <Wallet className="h-4 w-4 text-purple-400" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{t('dashboard.balance.title', 'Current Balance')}</p>
                </div>
                <h3 className="text-lg font-bold tracking-tight">
                  {formatCurrency(getStatisticOverviewPageData?.data.currentBalance || 0, "VND")}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-[10px]">
                    {getStatisticOverviewPageData?.data.accountsourceCount || 0} {t('dashboard.balance.accounts', 'Accounts')}
                  </div>
                </div>
              </div>
              <div className="opacity-10 group-hover:opacity-20 transition-opacity absolute right-0 top-1/2 -translate-y-1/2">
                <Wallet className="h-16 w-16 text-purple-500" strokeWidth={1} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Income Card */}
        <Card className="dark:bg-[#1a2c20] border border-gray-200 dark:border-gray-800 overflow-hidden h-[100px] group hover:border-green-400/50 transition-colors">
          <CardContent className="p-3 h-full">
            <div className="flex justify-between items-center h-full relative">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-md bg-green-900/30 p-1.5">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{t('dashboard.income.title', 'Total Income')}</p>
                </div>
                <h3 className="text-lg font-bold tracking-tight">
                  {formatCurrency(getStatisticOverviewPageData?.data.totalIncome?.amount || 0, "VND")}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-[10px]">
                    {getStatisticOverviewPageData?.data.totalIncome?.rate || '0%'} {t('dashboard.income.growth', 'Growth')}
                  </div>
                </div>
              </div>
              <div className="opacity-10 group-hover:opacity-20 transition-opacity absolute right-0 top-1/2 -translate-y-1/2">
                <TrendingUp className="h-16 w-16 text-green-500" strokeWidth={1} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Card */}
        <Card className="dark:bg-[#2c1a1a] border border-gray-200 dark:border-gray-800 overflow-hidden h-[100px] group hover:border-red-400/50 transition-colors">
          <CardContent className="p-3 h-full">
            <div className="flex justify-between items-center h-full relative">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-md bg-red-900/30 p-1.5">
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{t('dashboard.expenses.title', 'Total Expenses')}</p>
                </div>
                <h3 className="text-lg font-bold tracking-tight">
                  {formatCurrency(getStatisticOverviewPageData?.data.totalExpenses?.amount || 0, "VND")}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-[10px]">
                    {getStatisticOverviewPageData?.data.totalExpenses?.rate || '0%'} {t('dashboard.expenses.change', 'Change')}
                  </div>
                </div>
              </div>
              <div className="opacity-10 group-hover:opacity-20 transition-opacity absolute right-0 top-1/2 -translate-y-1/2">
                <TrendingDown className="h-16 w-16 text-red-500" strokeWidth={1} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Funds Overview Card */}
        <Card className="dark:bg-[#1a202c] border border-gray-200 dark:border-gray-800 overflow-hidden h-[100px] group hover:border-blue-400/50 transition-colors">
          <CardContent className="p-3 h-full">
            <div className="flex justify-between items-center h-full relative">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-md bg-blue-900/30 p-1.5">
                    <PiggyBank className="h-4 w-4 text-blue-400" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{t('dashboard.funds.title', 'Total Funds')}</p>
                </div>
                <h3 className="text-lg font-bold tracking-tight">
                  {getStatisticOverviewPageData?.data.fundCount || 0}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[10px]">
                    {getStatisticOverviewPageData?.data.statisticBudgetTargetAndPlan?.length || 0} {t('dashboard.funds.active', 'Active')}
                  </div>
                </div>
              </div>
              <div className="opacity-10 group-hover:opacity-20 transition-opacity absolute right-0 top-1/2 -translate-y-1/2">
                <PiggyBank className="h-16 w-16 text-blue-500" strokeWidth={1} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1">
        <div className="lg:col-span-2 flex flex-col">
          {/* Cash Flow Chart */}
          <Card className="border border-gray-200 dark:border-gray-800 flex-1 flex flex-col min-h-[300px]">
            <CardContent className="p-3 flex flex-col h-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-blue-100 dark:bg-blue-900/30 p-1.5">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                  </div>
                  <h3 className="text-sm font-bold">{t('dashboard.cash_flow.title')}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 border-r pr-2 dark:border-gray-700">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs">{t('dashboard.chart.incoming')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-xs">{t('dashboard.chart.outgoing')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="h-7 text-xs border-gray-200 dark:border-gray-700 w-[90px]" aria-label={t('dashboard.cash_flow.time_range.placeholder')}>
                        <SelectValue placeholder={t('dashboard.cash_flow.time_range.placeholder')} />
                      </SelectTrigger>
                      <SelectContent className="border-gray-300">
                        <SelectItem value="90d">{t('dashboard.cash_flow.time_range.90d')}</SelectItem>
                        <SelectItem value="30d">{t('dashboard.cash_flow.time_range.30d')}</SelectItem>
                        <SelectItem value="7d">{t('dashboard.cash_flow.time_range.7d')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              {cashFlowAnalysisChartData.length > 0 ? (
                <div className="flex-1 min-h-0 h-full">
                  <LineChart chartData={cashFlowAnalysisChartData} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center select-none h-full">
                  <Image src={NoDataPlaceHolder || "/placeholder.svg"} alt={t('dashboard.cash_flow.no_data')} width={100} height={100} />
                  <span className="mt-2 text-xs">{t('dashboard.cash_flow.no_data')}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Budget and Plans summary row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
            {/* Recent Transactions Card */}
            <Card className="border border-gray-200 dark:border-gray-800 hover:border-blue-400/50 transition-colors relative group">
              <div className="absolute right-2 top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target className="h-16 w-16 text-blue-500" strokeWidth={1} />
              </div>
              <CardContent className="px-5 py-5 flex flex-col gap-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-blue-100 dark:bg-blue-900/30 p-1.5">
                      <Target className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    <h3 className="text-xs font-bold">{t('dashboard.recent_transactions.title')}</h3>
                  </div>
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                    {recentTransactionsCount} {t('dashboard.recent_transactions.total')}
                  </span>
                </div>

                <div className="flex flex-col justify-between flex-1 gap-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-muted-foreground">{t('dashboard.recent_transactions.incoming')}</p>
                      <p className="text-xl font-bold">
                        {getStatisticOverviewPageData?.data.recentTransactions?.filter(t => t.direction === 'INCOMING').length || 0}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">{t('dashboard.recent_transactions.expense')}</p>
                      <p className="text-xl font-bold">
                        {getStatisticOverviewPageData?.data.recentTransactions?.filter(t => t.direction === 'EXPENSE').length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Targets Summary Card */}
            <Card className="border border-gray-200 dark:border-gray-800 hover:border-green-400/50 transition-colors relative group">
              <div className="absolute right-2 top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target className="h-16 w-16 text-green-500" strokeWidth={1} />
              </div>
              <CardContent className="px-5 py-5 flex flex-col gap-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-green-100 dark:bg-green-900/30 p-1.5">
                      <Target className="h-3.5 w-3.5 text-green-500" />
                    </div>
                    <h3 className="text-xs font-bold">{t('dashboard.budget.targets', 'Budget Targets')}</h3>
                  </div>
                  <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                    {Math.round((successfulTargets / totalTargets) * 100)}% {t('dashboard.budget.success_rate', 'Success')}
                  </span>
                </div>

                <div className="flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground">{t('dashboard.budget.active_targets', 'Active Targets')}</p>
                    <p className="text-xl font-bold">{successfulTargets} / {totalTargets}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Spending Plans Summary Card */}
            <Card className="border border-gray-200 dark:border-gray-800 hover:border-amber-400/50 transition-colors relative group">
              <div className="absolute right-2 top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Clock className="h-16 w-16 text-amber-500" strokeWidth={1} />
              </div>
              <CardContent className="px-5 py-5 flex flex-col gap-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-amber-100 dark:bg-amber-900/30 p-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                    </div>
                    <h3 className="text-xs font-bold">{t('dashboard.plans.title', 'Spending Plans')}</h3>
                  </div>
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                    {Math.round((successfulPlans / totalPlans) * 100)}% {t('dashboard.plans.success_rate', 'Success')}
                  </span>
                </div>

                <div className="flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground">{t('dashboard.plans.active', 'Active Plans')}</p>
                    <p className="text-xl font-bold">{successfulPlans} / {totalPlans}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Account Balance Chart */}
        <Card className="lg:col-span-1 border border-gray-200 dark:border-gray-800 hover:border-purple-400/50 transition-colors flex flex-col h-full relative group">
          <div className="absolute right-3 top-3 opacity-5 group-hover:opacity-10 transition-opacity">
            <PieChart className="h-12 w-12 text-purple-500" strokeWidth={1} />
          </div>
          <CardContent className="p-3 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-md bg-purple-100 dark:bg-purple-900/30 p-1.5">
                <PieChart className="h-3.5 w-3.5 text-purple-500" />
              </div>
              <h3 className="text-xs font-bold">{t('dashboard.balance_chart.distribution', 'Account Distribution')}</h3>
            </div>
            {balanceChartData.length > 0 ? (
              <div className="flex-1 flex flex-col">
                <BalanceChart chartConfig={balanceChartConfig} chartData={balanceChartData} />
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <p className="text-[10px] text-muted-foreground">{t('dashboard.balance_chart.accounts', 'Total Accounts')}</p>
                    <p className="text-sm font-bold">{balanceChartData.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-muted-foreground">{t('dashboard.balance_chart.largest', 'Largest Account')}</p>
                    <p className="text-sm font-bold">{balanceChartData[0]?.account || '-'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center select-none">
                <Image src={NoDataPlaceHolder || "/placeholder.svg"} alt={t('dashboard.balance_chart.no_data')} width={100} height={100} />
                <span className="mt-2 text-xs">{t('dashboard.balance_chart.no_data')}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
