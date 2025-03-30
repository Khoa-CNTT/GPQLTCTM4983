"use client"
import React, { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Eye, CalendarDays, BarChart4 } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DashboardMainForm() {
  const { fundId } = useStoreLocal()
  // states
  const [daysToSubtract, setDaysToSubtract] = useState(90)
  const [cashFlowAnalysisChartData, setCashFlowAnalysisChartData] = useState<ICashFlowAnalysisStatistic[]>([])
  const [balanceChartData, setBalanceChartData] = useState<ITotalBalanceChart[]>([])
  const [balanceChartConfig, setBalanceChartConfig] = useState<ChartConfig>(initEmptyBalanceChartConfig)
  const [totalIncome, setTotalIncome] = useState<ITotalAmount>(initEmptyTotalAmount)
  const [totalExpenses, setTotalExpenses] = useState<ITotalAmount>(initEmptyTotalAmount)
  const [timeRange, setTimeRange] = useState<string>("90d")
  const [showSpendingPlansDialog, setShowSpendingPlansDialog] = useState(false)
  const [showBudgetDialog, setShowBudgetDialog] = useState(false)
  const [showCashFlowDialog, setShowCashFlowDialog] = useState(false)

  // Mock data for spending plans
  const mockUpcomingPlans = [
    {
      id: "1",
      title: "Monthly Rent",
      amount: 1200000,
      plannedDate: "01/04/2025",
      category: "Housing",
      status: "pending",
      description: "Apartment rent payment",
      notifyBefore: 2,
    },
    {
      id: "2",
      title: "Electricity Bill",
      amount: 350000,
      plannedDate: "04/04/2025",
      category: "Utilities",
      status: "pending",
      description: "Monthly electricity payment",
      notifyBefore: 1,
    },
    {
      id: "3",
      title: "Internet Subscription",
      amount: 250000,
      plannedDate: "05/04/2025",
      category: "Utilities",
      status: "pending",
      description: "Monthly internet service fee",
      notifyBefore: 1,
    },
    {
      id: "4",
      title: "Internet Subscription",
      amount: 250000,
      plannedDate: "05/04/2025",
      category: "Utilities",
      status: "pending",
      description: "Monthly internet service fee",
      notifyBefore: 1,
    },
    {
      id: "5",
      title: "Internet Subscription",
      amount: 250000,
      plannedDate: "05/04/2025",
      category: "Utilities",
      status: "pending",
      description: "Monthly internet service fee",
      notifyBefore: 1,
    },
  ]

  // Mock data for category statistics
  const mockCategoryStatistics = [
    {
      category: "Food & Dining",
      percentage: 75,
      totalSpent: 1500000,
      budgetAmount: 2000000,
      transactions: 12,
    },
    {
      category: "Transportation",
      percentage: 60,
      totalSpent: 600000,
      budgetAmount: 1000000,
      transactions: 8,
    },
    {
      category: "Entertainment",
      percentage: 95,
      totalSpent: 950000,
      budgetAmount: 1000000,
      transactions: 5,
    },
    {
      category: "Shopping",
      percentage: 85,
      totalSpent: 850000,
      budgetAmount: 1000000,
      transactions: 7,
    },
    {
      category: "Healthcare",
      percentage: 45,
      totalSpent: 450000,
      budgetAmount: 1000000,
      transactions: 3,
    },
    {
      category: "Education",
      percentage: 30,
      totalSpent: 300000,
      budgetAmount: 1000000,
      transactions: 2,
    },
  ]

  // Calculate budget totals
  const budgetTotals = {
    totalBudget: mockCategoryStatistics.reduce((acc, stat) => acc + stat.budgetAmount, 0),
    totalSpentAmount: mockCategoryStatistics.reduce((acc, stat) => acc + stat.totalSpent, 0),
    remainingBudget: mockCategoryStatistics.reduce((acc, stat) => acc + (stat.budgetAmount - stat.totalSpent), 0),
    spendingProgress: Math.round(
      (mockCategoryStatistics.reduce((acc, stat) => acc + stat.totalSpent, 0) /
        mockCategoryStatistics.reduce((acc, stat) => acc + stat.budgetAmount, 0)) *
      100,
    ),
  }

  React.useEffect(() => {
    if (timeRange === "30d") {
      setDaysToSubtract(30)
    } else if (timeRange === "7d") {
      setDaysToSubtract(7)
    } else {
      setDaysToSubtract(90)
    }
  }, [timeRange])

  // hooks
  // declare hooks
  const { getStatisticOverviewPage } = useOverviewPage()
  const { getStatisticAccountBalance } = useAccountSource()

  // use hooks
  const { getStatisticAccountBalanceData } = getStatisticAccountBalance(fundId)
  const { getStatisticOverviewPageData } = getStatisticOverviewPage(
    {
      daysToSubtract,
    },
    fundId,
  )

  // effects
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

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Main content container */}
      <div className="grid grid-cols-12 gap-4 p-4">
        {/* Left column - Account Balance and Charts */}
        <div className="col-span-8 space-y-4">
          {/* Top row with summary cards */}
          <div className="grid grid-cols-3 gap-4">
            {/* Account Balance Card */}
            <div className="col-span-1 bg-black border border-zinc-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Account Balance</h3>
              </div>
              <div className="font-bold">{formatCurrency(950000, "đ", "vi-vn")}</div>
              <div className="flex items-center text-green-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5% from last month
              </div>
            </div>

            {/* Total Income Card */}
            <div className="col-span-1 bg-gradient-to-br from-green-950 to-emerald-950 border border-zinc-800 rounded-lg p-4 relative">
              <h3 className="font-medium text-muted-foreground mb-1">Total Income</h3>
              <div className="font-bold">0 đ</div>
              <div className="flex items-center text-green-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0% from last week
              </div>
              <div className="absolute top-3 right-3">
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-green-500">
                  <TrendingUp className="h-5 w-5" />
                </motion.div>
              </div>
            </div>

            {/* Total Expenses Card */}
            <div className="col-span-1 bg-gradient-to-br from-red-950 to-rose-950 border border-zinc-800 rounded-lg p-4 relative">
              <h3 className="font-medium text-muted-foreground mb-1">Total Expenses</h3>
              <div className="font-bold">0 đ</div>
              <div className="flex items-center text-red-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0% from last week
              </div>
              <div className="absolute top-3 right-3">
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-red-500">
                  <TrendingDown className="h-5 w-5" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Balance Chart */}
            <div className="bg-black border border-zinc-800 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-3 border-b border-zinc-800">
                <h3 className="font-medium">Total Balance</h3>
                <Dialog open={showCashFlowDialog} onOpenChange={setShowCashFlowDialog}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-white">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] bg-zinc-900 border-zinc-800">
                    <DialogHeader>
                      <DialogTitle>Cash Flow Analysis</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-muted-foreground">Monitoring incoming and outgoing transactions</p>
                        <Select value={timeRange} onValueChange={setTimeRange}>
                          <SelectTrigger className="w-[160px] bg-black border-zinc-800">
                            <SelectValue placeholder="Last 3 months" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="90d">Last 3 months</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="h-[350px] w-full">
                        {cashFlowAnalysisChartData.length > 0 ? (
                          <LineChart chartData={cashFlowAnalysisChartData} />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center">
                            <Image
                              src={NoDataPlaceHolder || "/placeholder.svg?height=150&width=150"}
                              alt="No data available"
                              width={150}
                              height={150}
                            />
                            <span className="mt-4 font-medium">No data available</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="p-3">
                {balanceChartData.length > 0 ? (
                  <div className="h-full w-full">
                    <BalanceChart chartConfig={balanceChartConfig} chartData={balanceChartData} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Image
                      src={NoDataPlaceHolder || "/placeholder.svg"}
                      alt="No data available"
                      width={80}
                      height={80}
                    />
                    <span className="mt-2 font-medium">No data available</span>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              {/* Monthly Overview */}
              <div className="bg-black border border-zinc-800 rounded-lg overflow-hidden">
                <div className="p-3 border-b border-zinc-800">
                  <h3 className="font-medium">Monthly Overview</h3>
                </div>
                <div className="h-[162px]">
                  <ScrollArea className="h-full">
                    <div className="p-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-zinc-900/50 rounded-lg p-2">
                          <p className="text-muted-foreground">Income</p>
                          <p className="font-medium">{formatCurrency(3500000, "đ", "vi-vn")}</p>
                          <div className="flex items-center text-green-500 mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span>+12%</span>
                          </div>
                        </div>
                        <div className="bg-zinc-900/50 rounded-lg p-2">
                          <p className="text-muted-foreground">Expenses</p>
                          <p className="font-medium">{formatCurrency(2800000, "đ", "vi-vn")}</p>
                          <div className="flex items-center text-red-500 mt-1">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            <span>-5%</span>
                          </div>
                        </div>
                        <div className="bg-zinc-900/50 rounded-lg p-2">
                          <p className="text-muted-foreground">Savings</p>
                          <p className="font-medium">{formatCurrency(700000, "đ", "vi-vn")}</p>
                          <div className="flex items-center text-green-500 mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span>+20%</span>
                          </div>
                        </div>
                        <div className="bg-zinc-900/50 rounded-lg p-2">
                          <p className="text-muted-foreground">Investments</p>
                          <p className="font-medium">{formatCurrency(500000, "đ", "vi-vn")}</p>
                          <div className="flex items-center text-green-500 mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span>+8%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
              {/* Budget Summary */}
              <div className="bg-black border border-zinc-800 rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-3 border-b border-zinc-800 sticky top-0 bg-black z-10">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Budget Summary</h3>
                    <BarChart4 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-white">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] bg-zinc-900 border-zinc-800">
                      <DialogHeader>
                        <DialogTitle>Budget Details by Category</DialogTitle>
                      </DialogHeader>
                      <div className="max-h-[60vh]">
                        <ScrollArea className="h-[50vh]">
                          <div className="space-y-4 pr-4">
                            {mockCategoryStatistics.map((stat) => (
                              <div
                                key={stat.category}
                                className="group hover:bg-zinc-800/50 rounded-lg border border-zinc-800 p-3 transition-all cursor-pointer"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center">
                                    <div
                                      className={`w-3 h-3 rounded-full mr-2 ${stat.percentage > 90 ? "bg-amber-500" : "bg-emerald-500"
                                        }`}
                                    ></div>
                                    <span className="font-medium">{stat.category}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium">{stat.percentage}%</span>
                                  </div>
                                </div>

                                <Progress value={stat.percentage} className="h-2 bg-zinc-800" />

                                <div className="flex justify-between mt-2">
                                  <div className="text-muted-foreground">
                                    <span>{formatCurrency(stat.totalSpent, "đ", "vi-vn")}</span>
                                  </div>
                                  <div className="text-muted-foreground">
                                    <span>{formatCurrency(stat.budgetAmount, "đ", "vi-vn")}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        <div className="mt-4 flex justify-end">
                          <Button variant="default" size="sm">
                            Create Budget
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="h-[200px]">
                  <ScrollArea className="h-full">
                    <div className="p-3">
                      <div className="grid grid-cols-1 gap-3">
                        {mockCategoryStatistics.map((stat) => (
                          <div key={stat.category} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div
                                  className={`w-2 h-2 rounded-full mr-1.5 ${stat.percentage > 90 ? "bg-amber-500" : "bg-emerald-500"
                                    }`}
                                ></div>
                                <span className="font-medium">{stat.category}</span>
                              </div>
                              <span className="font-medium">{stat.percentage}%</span>
                            </div>
                            <Progress value={stat.percentage} className="h-1.5 bg-zinc-800" />
                            <div className="flex justify-between text-muted-foreground">
                              <span>{formatCurrency(stat.totalSpent, "đ", "vi-vn")}</span>
                              <span>{formatCurrency(stat.budgetAmount, "đ", "vi-vn")}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Spending Plans */}
        <div className="col-span-4 space-y-4">
          {/* Upcoming Spending Plans */}
          <div className="bg-black border border-zinc-800 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b border-zinc-800 sticky top-0 bg-black z-10">
              <h3 className="font-medium">Upcoming Spending Plans</h3>
              <Dialog open={showSpendingPlansDialog} onOpenChange={setShowSpendingPlansDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-white">
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    View All
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-800">
                  <DialogHeader>
                    <DialogTitle>All Spending Plans</DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[60vh]">
                    <ScrollArea className="h-[50vh]">
                      <div className="space-y-3 pr-4">
                        {mockUpcomingPlans.map((plan) => (
                          <div
                            key={plan.id}
                            className="group rounded-lg border border-zinc-800 p-3 transition-all hover:bg-zinc-800/50 cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="font-medium group-hover:text-primary transition-colors">{plan.title}</div>
                              <div className="font-medium">{formatCurrency(plan.amount, "đ", "vi-vn")}</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-muted-foreground">
                                <CalendarDays className="mr-1 h-3.5 w-3.5" />
                                <span>{plan.plannedDate}</span>
                              </div>
                              <Badge variant="outline" className="bg-transparent border-zinc-700">
                                {plan.category}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="mt-4 flex justify-end">
                      <Button variant="default" size="sm">
                        Create New Plan
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="h-[200px]">
              <ScrollArea className="h-full">
                <div className="p-3">
                  {mockUpcomingPlans.length > 0 ? (
                    <div className="space-y-2">
                      {[...mockUpcomingPlans, ...mockUpcomingPlans].map((plan, idx) => (
                        <div key={`${plan.id}-${idx}`} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${idx % 2 === 0 ? "bg-red-500" : "bg-green-500"}`}
                            ></div>
                            <div>
                              <p className="font-medium">{plan.title}</p>
                              <p className="text-muted-foreground">{plan.plannedDate}</p>
                            </div>
                          </div>
                          <div className="font-medium">{formatCurrency(plan.amount, "đ", "vi-vn")}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2">
                      <p className="text-muted-foreground">No upcoming plans</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Spending Plans Summary */}
          <div className="bg-black border border-zinc-800 rounded-lg space-y-4">
            <div className="flex justify-between items-center p-3 border-b border-zinc-800">
              <h3 className="font-medium">Spending Plans</h3>
              <Badge variant="outline" className="font-normal bg-transparent border-zinc-700">
                7 days ahead
              </Badge>
            </div>
            <div>
              <ScrollArea className=" h-[222px]">
                <div className="space-y-2 px-4">
                  {mockUpcomingPlans.map((plan, index) => (
                    <div key={plan.id} className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center">
                        <span className="font-medium">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{plan.title}</p>
                        <p className="text-muted-foreground">{plan.plannedDate}</p>
                      </div>
                      <div className="font-medium">{formatCurrency(plan.amount, "đ", "vi-vn")}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Button
                variant="default"
                size="sm"
                className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white border-none"
                onClick={() => setShowSpendingPlansDialog(true)}
              >
                Manage Plans
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

