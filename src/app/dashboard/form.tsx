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
  ArrowRight,
} from "lucide-react"
import { LineChart } from "@/components/core/charts/LineChart"
import { BalanceChart } from "@/components/core/charts/BalanceChart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import NoDataPlaceHolder from "@/images/2.png"
import { formatCurrency } from "@/libraries/utils"

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
    <div className="space-y-4">
      {/* Header with time selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold ">Financial Overview</h2>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 " />
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] h-8  border-1 border-black " aria-label="Select time range">
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className=" border-gray-800 ">
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance Card */}
        <Card className="dark:bg-[#1e1a2c] border-1 border-black overflow-hidden ">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium ">Current Balance</p>
                <h3 className="text-xl font-bold tracking-tight  mt-1">
                  {formatCurrency(netSavings, "đ", "vi-vn")}
                </h3>
              </div>
              <div className="rounded-full bg-purple-900/30 p-2">
                <Wallet className="h-5 w-5 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Income Card */}
        <Card className="dark:bg-[#1a2c20] border-1 border-black overflow-hidden ">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium ">Total Income</p>
                <h3 className="text-xl font-bold tracking-tight  mt-1">
                  {formatCurrency(totalIncome.amount ?? 0, "đ", "vi-vn")}
                </h3>
              </div>
              <div className="rounded-full bg-green-900/30 p-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Card */}
        <Card className="dark:bg-[#2c1a1a] border-1 border-black overflow-hidden ">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium ">Total Expenses</p>
                <h3 className="text-xl font-bold tracking-tight  mt-1">
                  {formatCurrency(totalExpenses.amount ?? 0, "đ", "vi-vn")}
                </h3>
              </div>
              <div className="rounded-full bg-red-900/30 p-2">
                <TrendingDown className="h-5 w-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Savings Rate Card */}
        <Card className="dark:bg-[#1a202c] border-1 border-black overflow-hidden ">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium ">Savings Rate</p>
                <h3 className="text-xl font-bold tracking-tight  mt-1">{savingsPercentage}%</h3>
              </div>
              <div className="rounded-full bg-blue-900/30 p-2">
                <PiggyBank className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {/* Cash Flow Chart */}
          <Card className=" border-1 border-black mb-16">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-400" />
                  <h3 className="text-sm font-bold ">Cash Flow Analysis</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs ">Income</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-xs ">Expenses</span>
                  </div>
                </div>
              </div>
              {cashFlowAnalysisChartData.length > 0 ? (
                <div>
                  <LineChart chartData={cashFlowAnalysisChartData} />
                </div>
              ) : (
                  <div className="flex flex-col items-center justify-center select-none aspect-auto h-[250px] w-full">
                  <Image src={NoDataPlaceHolder || "/placeholder.svg"} alt="No data available" width={100} height={100} />
                  <span className="mt-2 text-xs ">No data available</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Budget and Plans summary row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-auto">
            {/* Budget Overview Card */}
            <Card className=" border-1 border-black">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-400" />
                    <h3 className="text-sm font-bold ">Budget Overview</h3>
                  </div>
                  {totalBudgetTarget && (
                    <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full">
                      {totalBudgetTarget.progress}% Complete
                    </span>
                  )}
                </div>

                {totalBudgetTarget ? (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs ">Target Amount</p>
                      <p className="text-base font-medium  mt-1">
                        {formatCurrency(totalBudgetTarget.targetAmount, "đ", "vi-vn")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs ">Current Amount</p>
                      <p className="text-base font-medium  mt-1">
                        {formatCurrency(totalBudgetTarget.currentAmount, "đ", "vi-vn")}
                      </p>
                    </div>
                  </div>
                ) : (
                    <div className="flex items-center justify-center h-[60px] select-none">
                    <span className="text-sm ">No budget target set</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Budget Targets Summary Card */}
            <Card className=" border-1 border-black">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-green-400" />
                  <h3 className="text-sm font-bold ">Budget Targets</h3>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs ">Active Targets</p>
                    <p className="text-2xl font-bold  mt-1">{targets.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Spending Plans Summary Card */}
            <Card className=" border-1 border-black">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <h3 className="text-sm font-bold ">Spending Plans</h3>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs ">Active Plans</p>
                    <p className="text-2xl font-bold  mt-1">{spendingPlans.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Account Balance Chart */}
        <Card className="lg:col-span-1  border-1 border-black h-full]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="h-4 w-4 text-purple-400" />
              <h3 className="text-sm font-bold ">Account Balance</h3>
            </div>
            {balanceChartData.length > 0 ? (
              <div>
                <BalanceChart chartConfig={balanceChartConfig} chartData={balanceChartData} />
              </div>
            ) : (
                <div className="flex flex-col items-center justify-center select-none">
                <Image src={NoDataPlaceHolder || "/placeholder.svg"} alt="No data available" width={100} height={100} />
                <span className="mt-2 text-xs ">No data available</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>


    </div>
  )
}
