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
import { useFundSavingTarget } from "@/core/fund-saving-target/hooks"
import { useFundSavingPlan } from "@/core/fund-saving-plan/hooks"
import type {
  ICashFlowAnalysisStatistic,
  ITotalAmount,
  ITotalBalanceChart,
} from "@/core/overview/models/overview.interface"
import type { ChartConfig } from "@/components/ui/chart"
import type { ISpendingPlan } from "@/core/fund-saving-plan/models"
import type { IBudgetTarget, IGetAllDataFundSavingTarget, ITotalBudgetTarget } from "@/core/fund-saving-target/models"

// Utilities
import { initDataStatisticAccountBalance, initDataStatisticCashFlowAnalysis } from "./handler"
import { initEmptyBalanceChartConfig, initEmptyTotalAmount } from "./constants"

export default function DashboardForm() {
  // Add translation hook
  const { t } = useTranslation(['overview', 'common']);

  // =========== HOOKS ===========
  const { fundId } = useStoreLocal()
  const { getStatisticOverviewPage } = useOverviewPage()
  const { getStatisticAccountBalance } = useAccountSource()
  const { getAllFundSavingPlan } = useFundSavingPlan()
  const { getAllFundSavingTarget } = useFundSavingTarget()

  // =========== STATE ===========
  // Time range state
  const [timeRange, setTimeRange] = useState<string>("30d")
  const [daysToSubtract, setDaysToSubtract] = useState(30)

  // Chart data state
  const [cashFlowAnalysisChartData, setCashFlowAnalysisChartData] = useState<ICashFlowAnalysisStatistic[]>([])
  const [balanceChartData, setBalanceChartData] = useState<ITotalBalanceChart[]>([])
  const [balanceChartConfig, setBalanceChartConfig] = useState<ChartConfig>(initEmptyBalanceChartConfig)

  // Financial metrics state
  const [totalIncome, setTotalIncome] = useState<ITotalAmount>(initEmptyTotalAmount)
  const [totalExpenses, setTotalExpenses] = useState<ITotalAmount>(initEmptyTotalAmount)

  // Budget targets and spending plans state
  const [spendingPlans, setSpendingPlans] = useState<ISpendingPlan[]>([])
  const [targets, setTargets] = useState<IBudgetTarget[]>([])
  const [totalBudgetTarget, setTotalBudgetTarget] = useState<ITotalBudgetTarget | null>(null)
  const [targetPagination, setTargetPagination] = useState<IGetAllDataFundSavingTarget["pagination"] | null>(null)

  // =========== API DATA ===========
  const { getStatisticAccountBalanceData } = getStatisticAccountBalance(fundId)
  const { getStatisticOverviewPageData } = getStatisticOverviewPage({ daysToSubtract }, fundId)
  const { getAllData: getAllDataTarget } = getAllFundSavingTarget(fundId)
  const { getAllData: getAllDataPlan } = getAllFundSavingPlan(fundId)

  // =========== EFFECTS ===========
  // Time range effect
  useEffect(() => {
    if (timeRange === "30d") {
      setDaysToSubtract(30)
    } else if (timeRange === "7d") {
      setDaysToSubtract(7)
    } else {
      setDaysToSubtract(90)
    }
  }, [timeRange])

  // Cash flow data effect
  useEffect(() => {
    if (getStatisticOverviewPageData) {
      initDataStatisticCashFlowAnalysis({
        data: getStatisticOverviewPageData.data,
        setCashFlowAnalysisChartData,
        setTotalIncome,
        setTotalExpenses,
      })
    }
  }, [getStatisticOverviewPageData])

  // Balance chart data effect
  useEffect(() => {
    if (getStatisticAccountBalanceData && getStatisticAccountBalanceData.data.length > 0) {
      initDataStatisticAccountBalance({
        data: getStatisticAccountBalanceData.data,
        setBalanceChartConfig,
        setBalanceChartData,
      })
    }
  }, [getStatisticAccountBalanceData])

  // Spending plans and targets effect
  useEffect(() => {
    if (getAllDataPlan && getAllDataPlan?.data) {
      setSpendingPlans(getAllDataPlan?.data || [])
    }

    if (getAllDataTarget && getAllDataTarget?.data) {
      setTargets(getAllDataTarget?.data?.budgetTargets?.data || [])
      setTotalBudgetTarget(getAllDataTarget?.data?.totalBudgetTarget || null)
      setTargetPagination(getAllDataTarget?.data?.budgetTargets?.pagination || null)
    }
  }, [getAllDataPlan, getAllDataTarget])

  // =========== COMPUTED VALUES ===========
  const netSavings = totalIncome.amount - totalExpenses.amount
  const savingsPercentage = totalIncome.amount > 0 ? Math.round((netSavings / totalIncome.amount) * 100) : 0

  return (
    <div className="flex flex-col space-y-3 h-full">
      {/* Key metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Net Savings Card */}
        <Card className="dark:bg-[#1e1a2c] border border-gray-200 dark:border-gray-800 overflow-hidden h-[100px] group hover:border-purple-400/50 transition-colors">
          <CardContent className="p-3 h-full">
            <div className="flex justify-between items-center h-full relative">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-md bg-purple-900/30 p-1.5">
                    <Wallet className="h-4 w-4 text-purple-400" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{t('dashboard.savings.title', 'Net Savings')}</p>
                </div>
                <h3 className="text-lg font-bold tracking-tight">
                  {formatCurrency(netSavings, "đ", "vi-vn")}
                </h3>
                {netSavings > 0 && (
                  <span className="text-xs text-green-500 font-medium flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    {savingsPercentage}% {t('dashboard.savings.of_income', 'of income')}
                  </span>
                )}
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
                  <p className="text-xs font-medium text-muted-foreground">{t('dashboard.income_card.title')}</p>
                </div>
                <h3 className="text-lg font-bold tracking-tight">
                  {formatCurrency(totalIncome.amount ?? 0, "đ", "vi-vn")}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-[10px]">
                    {t('dashboard.income_card.main_source', 'Salary')}
                  </div>
                  <div className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-[10px]">
                    {t('dashboard.income_card.investments', 'Investments')}
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
                  <p className="text-xs font-medium text-muted-foreground">{t('dashboard.expenses_card.title')}</p>
                </div>
                <h3 className="text-lg font-bold tracking-tight">
                  {formatCurrency(totalExpenses.amount ?? 0, "đ", "vi-vn")}
                </h3>
                <div className="flex gap-1 items-center mt-1">
                  <div className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-[10px]">
                    {t('dashboard.expenses_card.top_category', 'Food')}
                  </div>
                  <div className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-[10px]">
                    {t('dashboard.expenses_card.housing', 'Housing')}
                  </div>
                </div>
              </div>
              <div className="opacity-10 group-hover:opacity-20 transition-opacity absolute right-0 top-1/2 -translate-y-1/2">
                <TrendingDown className="h-16 w-16 text-red-500" strokeWidth={1} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Savings Rate Card */}
        <Card className="dark:bg-[#1a202c] border border-gray-200 dark:border-gray-800 overflow-hidden h-[100px] group hover:border-blue-400/50 transition-colors">
          <CardContent className="p-3 h-full">
            <div className="flex justify-between items-center h-full relative">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-md bg-blue-900/30 p-1.5">
                    <PiggyBank className="h-4 w-4 text-blue-400" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{t('dashboard.savings.rate', 'Savings Rate')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold tracking-tight">{savingsPercentage}%</h3>
                  <div className="flex items-center gap-0.5">
                    <div className={`h-1.5 w-1.5 rounded-full ${savingsPercentage > 15 ? 'bg-green-500' : savingsPercentage > 5 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                    <div className={`h-1.5 w-1.5 rounded-full ${savingsPercentage > 25 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                    <div className={`h-1.5 w-1.5 rounded-full ${savingsPercentage > 35 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground mt-1 block">
                  {savingsPercentage > 20
                    ? t('dashboard.savings.good', 'Great savings rate')
                    : t('dashboard.savings.could_improve', 'Could improve')}
                </span>
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
            {/* Budget Overview Card */}
            <Card className="border border-gray-200 dark:border-gray-800 h-[130px] hover:border-blue-400/50 transition-colors relative group">
              <div className="absolute right-2 top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target className="h-16 w-16 text-blue-500" strokeWidth={1} />
              </div>
              <CardContent className="p-3 h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-blue-100 dark:bg-blue-900/30 p-1.5">
                      <Target className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    <h3 className="text-xs font-bold">{t('dashboard.budget.overview', 'Budget Overview')}</h3>
                  </div>
                  {totalBudgetTarget && (
                    <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                      {totalBudgetTarget.progress}% {t('dashboard.budget.complete', 'Complete')}
                    </span>
                  )}
                </div>

                {totalBudgetTarget ? (
                  <div className="flex flex-col justify-between flex-1 relative">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] text-muted-foreground">{t('dashboard.budget.target_amount', 'Target Amount')}</p>
                        <p className="text-sm font-bold">
                          {formatCurrency(totalBudgetTarget.targetAmount, "đ", "vi-vn")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground">{t('dashboard.budget.current_amount', 'Current Amount')}</p>
                        <p className="text-sm font-bold">
                          {formatCurrency(totalBudgetTarget.currentAmount, "đ", "vi-vn")}
                        </p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2">
                      <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${Math.min(totalBudgetTarget.progress, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-muted-foreground">
                          {t('dashboard.budget.remaining', 'Remaining')}:&nbsp;
                          {formatCurrency(totalBudgetTarget.targetAmount - totalBudgetTarget.currentAmount, "đ", "vi-vn")}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full flex-1">
                    <span className="text-xs">{t('dashboard.budget.no_target', 'No budget target set')}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Budget Targets Summary Card */}
            <Card className="border border-gray-200 dark:border-gray-800 h-[130px] hover:border-green-400/50 transition-colors relative group">
              <div className="absolute right-2 top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target className="h-16 w-16 text-green-500" strokeWidth={1} />
              </div>
              <CardContent className="p-3 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-md bg-green-100 dark:bg-green-900/30 p-1.5">
                    <Target className="h-3.5 w-3.5 text-green-500" />
                  </div>
                  <h3 className="text-xs font-bold">{t('dashboard.budget.targets', 'Budget Targets')}</h3>
                </div>

                <div className="flex justify-between items-start flex-1">
                  <div>
                    <p className="text-[10px] text-muted-foreground">{t('dashboard.budget.active_targets', 'Active Targets')}</p>
                    <p className="text-xl font-bold">{targets.length}</p>

                    {targets.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        <div className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-[10px]">
                          {t('dashboard.budget.savings', 'Savings')}
                        </div>
                        <div className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-[10px]">
                          {t('dashboard.budget.emergency', 'Emergency')}
                        </div>
                      </div>
                    )}
                  </div>

                  {targets.length > 0 && (
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">{t('dashboard.budget.avg_progress', 'Avg Progress')}</p>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-300 text-xs font-bold">
                          65%
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Spending Plans Summary Card */}
            <Card className="border border-gray-200 dark:border-gray-800 h-[130px] hover:border-amber-400/50 transition-colors relative group">
              <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity">
                <Clock className="h-20 w-20 text-amber-500" strokeWidth={1} />
              </div>
              <CardContent className="p-3 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-md bg-amber-100 dark:bg-amber-900/30 p-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <h3 className="text-xs font-bold">{t('dashboard.plans.title', 'Spending Plans')}</h3>
                </div>

                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full h-10 w-10 flex items-center justify-center">
                      <PiggyBank className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">{t('dashboard.plans.active', 'Active Plans')}</p>
                      <p className="text-xl font-bold">{spendingPlans.length}</p>
                    </div>
                  </div>

                  {spendingPlans.length > 0 ? (
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Target className="h-3 w-3" />
                          {t('dashboard.plans.upcoming', 'Next due in 3 days')}
                        </span>
                        <span className="text-[10px] text-amber-500 hover:text-amber-400 cursor-pointer">
                          {t('dashboard.view_all', 'View all')} →
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 text-center">
                      <span className="text-[10px] text-muted-foreground">
                        {t('dashboard.plans.no_plans', 'No active spending plans')}
                      </span>
                    </div>
                  )}
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
