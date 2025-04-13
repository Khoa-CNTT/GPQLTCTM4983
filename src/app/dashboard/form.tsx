"use client"
import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  PiggyBank,
  CreditCard,
} from "lucide-react"
import { motion } from "framer-motion"
import { LineChart } from "@/components/core/charts/LineChart"
import { BalanceChart } from "@/components/core/charts/BalanceChart"
import { useOverviewPage } from "@/core/overview/hooks"
import { useStoreLocal } from "@/hooks/useStoreLocal"
import type {
  ICashFlowAnalysisStatistic,
  ITotalAmount,
  ITotalBalanceChart,
} from "@/core/overview/models/overview.interface"
import { initDataStatisticAccountBalance, initDataStatisticCashFlowAnalysis } from "./handler"
import { initEmptyBalanceChartConfig, initEmptyTotalAmount } from "./constants"
import { formatCurrency } from "@/libraries/utils"
import type { ChartConfig } from "@/components/ui/chart"
import { useAccountSource } from "@/core/account-source/hooks"
import Image from "next/image"
import NoDataPlaceHolder from "@/images/2.png"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function DashboardMainForm () {
  const { fundId } = useStoreLocal()

  // states
  const [daysToSubtract, setDaysToSubtract] = useState(90)
  const [cashFlowAnalysisChartData, setCashFlowAnalysisChartData] = useState<ICashFlowAnalysisStatistic[]>([])
  const [balanceChartData, setBalanceChartData] = useState<ITotalBalanceChart[]>([])
  const [balanceChartConfig, setBalanceChartConfig] = useState<ChartConfig>(initEmptyBalanceChartConfig)
  const [totalIncome, setTotalIncome] = useState<ITotalAmount>(initEmptyTotalAmount)
  const [totalExpenses, setTotalExpenses] = useState<ITotalAmount>(initEmptyTotalAmount)
  const [timeRange, setTimeRange] = useState<string>("90d")

  React.useEffect(() => {
    if (timeRange === "30d") {
      setDaysToSubtract(30)
    } else if (timeRange === "7d") {
      setDaysToSubtract(7)
    } else {
      setDaysToSubtract(90)
    }
  }, [timeRange])


  const { getStatisticOverviewPage } = useOverviewPage()
  const { getStatisticAccountBalance } = useAccountSource()

  const { getStatisticAccountBalanceData } = getStatisticAccountBalance(fundId)
  const { getStatisticOverviewPageData } = getStatisticOverviewPage(
    {
      daysToSubtract,
    },
    fundId,
  )

  useEffect(() => {
    if (getStatisticOverviewPageData)
      initDataStatisticCashFlowAnalysis({
        data: getStatisticOverviewPageData.data,
        setCashFlowAnalysisChartData,
        setTotalIncome,
        setTotalExpenses,
      })
  }, [getStatisticOverviewPageData])

  useEffect(() => {
    if (getStatisticAccountBalanceData && getStatisticAccountBalanceData.data.length > 0)
      initDataStatisticAccountBalance({
        data: getStatisticAccountBalanceData.data,
        setBalanceChartConfig,
        setBalanceChartData,
      })
  }, [getStatisticAccountBalanceData])

  const netSavings = totalIncome.amount - totalExpenses.amount
  const savingsPercentage = totalIncome.amount > 0 ? Math.round((netSavings / totalIncome.amount) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header with time selector */}
      <div className="flex justify-end items-center">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px]" aria-label="Select time range">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="col-span-1"
        >
          <Card className="overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                  <h3 className="text-2xl font-bold tracking-tight">{formatCurrency(netSavings, "đ", "vi-vn")}</h3>
                  <div className="flex items-center gap-1 text-sm font-medium text-purple-600">
                    <CreditCard className="h-4 w-4" />
                    <span>Available funds</span>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20"
                >
                  <Wallet className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Income Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="col-span-1"
        >
          <Card className="overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                  <h3 className="text-2xl font-bold tracking-tight">
                    {formatCurrency(totalIncome.amount ?? 0, "đ", "vi-vn")}
                  </h3>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${totalIncome.rate?.[0] !== "-" || totalIncome.rate === undefined ? "text-green-600" : "text-red-600"}`}
                  >
                    {totalIncome.rate?.[0] !== "-" || totalIncome.rate === undefined ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{(totalIncome.rate?.[0] === "-" ? "" : "+") + (totalIncome.rate || "0") + "%"}</span>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-full bg-green-100 p-3 dark:bg-green-900/20"
                >
                  <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expenses Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="col-span-1"
        >
          <Card className="overflow-hidden bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                  <h3 className="text-2xl font-bold tracking-tight">
                    {formatCurrency(totalExpenses.amount ?? 0, "đ", "vi-vn")}
                  </h3>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${totalExpenses.rate?.[0] !== "-" || totalExpenses.rate === undefined ? "text-red-600" : "text-green-600"}`}
                  >
                    {totalExpenses.rate?.[0] !== "-" || totalExpenses.rate === undefined ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{(totalExpenses.rate?.[0] === "-" ? "" : "+") + (totalExpenses.rate || "0") + "%"}</span>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-full bg-red-100 p-3 dark:bg-red-900/20"
                >
                  <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-400" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Savings Rate Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="col-span-1"
        >
          <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Savings Rate</p>
                  <h3 className="text-2xl font-bold tracking-tight">{savingsPercentage}%</h3>
                  <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatCurrency(netSavings, "đ", "vi-vn")}</span>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20"
                >
                  <PiggyBank className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts and data section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cash Flow Analysis</CardTitle>
                  <CardDescription>Income vs Expenses over time</CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  {timeRange === "7d" ? "7 days" : timeRange === "30d" ? "30 days" : "90 days"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {cashFlowAnalysisChartData.length > 0 ? (
                <div className="h-full">
                  <LineChart chartData={cashFlowAnalysisChartData} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px]">
                  <Image
                    src={NoDataPlaceHolder || "/placeholder.svg"}
                    alt="No data available"
                    width={150}
                    height={150}
                  />
                  <span className="mt-2 text-sm font-semibold text-foreground">No data available</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Balance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardContent className="pt-0 h-full">
              {balanceChartData.length > 0 ? (
                <div className="h-full">
                  <BalanceChart chartConfig={balanceChartConfig} chartData={balanceChartData} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px]">
                  <Image
                    src={NoDataPlaceHolder || "/placeholder.svg"}
                    alt="No data available"
                    width={150}
                    height={150}
                  />
                  <span className="mt-2 text-sm font-semibold text-foreground">No data available</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
