"use client"
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/dashboard/DataTable"
import { getColumns } from "@/components/dashboard/ColumnsTable"
import {
    ArrowRightIcon,
    BadgeDollarSign,
    Banknote,
    BarChart4,
    CalendarDays,
    CircleDollarSign,
    Coins,
    Filter,
    Flame,
    Hourglass,
    LineChart,
    ListChecks,
    PiggyBank,
    RefreshCw,
    Search,
    Sparkles,
    Timer,
} from "lucide-react"
import { formatCurrency, formatDateTimeVN, generateMonths } from "@/libraries/utils"
import { IDataTableConfig } from "@/types/common.i"
import { initTableConfig } from "@/constants/data-table"
import { Button } from "@/components/ui/button"
import { useStoreLocal } from "@/hooks/useStoreLocal"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DateRangePicker } from "@/components/core/DateRangePicker"
import { DateRange } from "react-day-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { modifySpendingPlanTableData, modifyBudgetTableData, calculateBudgetTotals } from "./handlers"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { mockBudgets, mockCategoryStatistics, mockSpendingPlans } from "./constants"
import { DialogDescription } from "@radix-ui/react-dialog"
import SpendingPlanDialog from "./dialog"
import { ISpendingPlan, ISpendingPlanTable } from "@/core/fund-saving-plant/models"
import { IBudget, IBudgetTable, IDialogFlags } from "@/core/fund-saving-target/models"

// Constants
const spendingPlanTableHeaders = ["Title", "Amount", "Planned Date", "Category", "Status"]
const budgetTableHeaders = ["Category", "Budget Amount", "Spent Amount", "Remaining", "Status"]

// Generate months dynamically starting from 6 months ago to 6 months ahead

const months = generateMonths()

export default function SpendingPlanForm() {
    const [spendingPlans, setSpendingPlans] = useState<ISpendingPlan[]>([])
    const [selectedPlan, setSelectedPlan] = useState<ISpendingPlan | null>(null)
    const [selectedBudget, setSelectedBudget] = useState<IBudget | null>(null)
    const [budgets, setBudgets] = useState<IBudget[]>([])
    const [dateRange, setDateRange] = useState<DateRange | undefined>()
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth() + 1 + "-" + new Date().getFullYear())
    const [isDialogOpen, setIsDialogOpen] = useState<IDialogFlags>({
        isDialogCreatePlanOpen: false,
        isDialogEditPlanOpen: false,
        isDialogDetailPlanOpen: false,
        isDialogDeletePlanOpen: false,
        isDialogCreateBudgetOpen: false,
        isDialogEditBudgetOpen: false,
        isDialogDetailBudgetOpen: false,
        isDialogDeleteBudgetOpen: false,
    })
    const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>({
        ...initTableConfig,
        isVisibleSortType: false,
        classNameOfScroll: "h-[400px]",
    })
    const [budgetTableConfig, setBudgetTableConfig] = useState<IDataTableConfig>({
        ...initTableConfig,
        isVisibleSortType: false,
        classNameOfScroll: "h-[400px]",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        setSpendingPlans(mockSpendingPlans)
        setBudgets(mockBudgets)
    }, [])

    const totalPlannedAmount = useMemo(() => {
        return spendingPlans.reduce((acc, plan) => acc + plan.amount, 0)
    }, [spendingPlans])

    const budgetTotals = useMemo(() => {
        return calculateBudgetTotals(budgets)
    }, [budgets])

    const upcomingPlans = useMemo(() => {
        const now = new Date()
        const sevenDaysFromNow = new Date(now)
        sevenDaysFromNow.setDate(now.getDate() + 7)
        return spendingPlans
            .filter((plan) => plan.status === "pending")
            .filter((plan) => {
                const planDate = new Date(plan.plannedDate)
                return planDate >= now && planDate <= sevenDaysFromNow
            })
            .sort((a, b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime())
    }, [spendingPlans])

    const transformedSpendingPlanData = useMemo(() => {
        return modifySpendingPlanTableData(
            spendingPlans
                .filter((plan) => statusFilter === "all" || plan.status === statusFilter)
                .filter(
                    (plan) =>
                        !searchQuery ||
                        plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        plan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        plan.category.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .filter((plan) => {
                    if (!dateRange || !dateRange.from) return true
                    const planDate = new Date(plan.plannedDate)
                    if (dateRange.to) {
                        return planDate >= dateRange.from && planDate <= dateRange.to
                    }
                    return planDate >= dateRange.from
                })
        )
    }, [spendingPlans, statusFilter, searchQuery, dateRange])

    const transformedBudgetData = useMemo(() => {
        return modifyBudgetTableData(budgets)
    }, [budgets])

    const planColumns = useMemo(() => {
        if (transformedSpendingPlanData.length === 0) return []
        return getColumns<ISpendingPlanTable>({
            headers: ["Title", "Amount", "Planned Date", "Category", "Status"],
            isSort: true,
        })
    }, [transformedSpendingPlanData])

    const budgetColumns = useMemo(() => {
        if (transformedBudgetData.length === 0) return []
        return getColumns<IBudgetTable>({
            headers: ["Category", "Budget Amount", "Spent Amount", "Remaining", "Status"],
            isSort: true,
        })
    }, [transformedBudgetData])

    // Handle date range change
    const handleDateRangeChange = (range: DateRange | undefined) => {
        if (range) {
            setDateRange(range)
        }
    }

    // Reusable function to handle dialog opening
    const openDialog = (type: keyof IDialogFlags, data?: any) => {
        if (type === "isDialogDetailBudgetOpen" && data) {
            setSelectedBudget(data)
        } else if (type === "isDialogDetailPlanOpen" && data) {
            setSelectedPlan(data)
        }
        setIsDialogOpen((prev) => ({ ...prev, [type]: true }))
    }

    return (
        <div className="mx-auto">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Kế hoạch chi tiêu</CardTitle>
                            <div className="rounded-full bg-indigo-100 p-2.5 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                                <ListChecks className="h-5 w-5" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{formatCurrency(totalPlannedAmount)}</div>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center">
                            <Hourglass className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
                            {spendingPlans.filter((p) => p.status === "pending").length} kế hoạch đang chờ thực hiện
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            className=" text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform duration-300"
                            onClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogDetailPlanOpen: true }))}
                        >
                            Xem chi tiết <ArrowRightIcon className="ml-1 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-green-500"></div>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Ngân sách còn lại</CardTitle>
                            <div className="rounded-full bg-emerald-100 p-2.5 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300">
                                <PiggyBank className="h-5 w-5" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{formatCurrency(budgetTotals.remainingBudget)}</div>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center">
                            <Coins className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
                            {Math.round(100 - budgetTotals.spendingProgress)}% còn lại trong tổng ngân sách
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            className=" text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform duration-300"
                            onClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogDetailBudgetOpen: true }))}
                        >
                            Xem chi tiết <ArrowRightIcon className="ml-1 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-red-500"></div>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Đã chi tiêu</CardTitle>
                            <div className="rounded-full bg-rose-100 p-2.5 text-rose-600 dark:bg-rose-900 dark:text-rose-300">
                                <Banknote className="h-5 w-5" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{formatCurrency(budgetTotals.totalSpentAmount)}</div>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center">
                            <Flame className="h-3.5 w-3.5 mr-1.5 text-rose-500" />
                            {Math.round(budgetTotals.spendingProgress)}% đã sử dụng từ tổng ngân sách
                        </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <div className="w-full">
                            <Progress
                                value={budgetTotals.spendingProgress}
                                className={`h-2 ${budgetTotals.spendingProgress > 90 ? "bg-rose-100" : ""}`}
                            />
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* Control section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 px-6 py-4 bg-muted/30 rounded-lg border border-muted/50 shadow-sm">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-[150px] border-dashed">
                            <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Chọn tháng" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((month) => (
                                <SelectItem key={month} value={month}>
                                    Tháng {month}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto group"
                        onClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogCreateBudgetOpen: true }))}
                    >
                        <CircleDollarSign className="mr-2 h-4 w-4 text-emerald-500 group-hover:animate-pulse" />
                        Tạo ngân sách
                    </Button>

                    <Button
                        variant="default"
                        className="w-full sm:w-auto group"
                        onClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogCreatePlanOpen: true }))}
                    >
                        <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                        Tạo kế hoạch
                    </Button>
                </div>
            </div>

            {/* Category Statistics and Upcoming Plans Wrapper */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Category Statistics */}
                <div className="md:col-span-2">
                    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
                        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CardTitle>Thống kê theo danh mục</CardTitle>
                                    <BarChart4 className="h-5 w-5 text-muted-foreground ml-1" />
                                    <Badge variant="outline" className="ml-2">
                                        {selectedMonth}
                                    </Badge>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => openDialog("isDialogDetailBudgetOpen")} className="group">
                                    <LineChart className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                                    Quản lý ngân sách
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <ScrollArea className="h-[280px] pr-4">
                                <div className="space-y-4">
                                    {mockCategoryStatistics.map((stat) => {
                                        const budget = budgets.find(b => b.category === stat.category);

                                        const handleCategoryClick = () => {
                                            if (budget) {
                                                openDialog("isDialogEditBudgetOpen", budget);
                                            }
                                        };

                                        return (
                                            <div key={stat.category} className="group hover:bg-muted/30 rounded-lg border border-muted p-3 transition-all duration-200 cursor-pointer" onClick={handleCategoryClick}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center">
                                                        <div
                                                            className={`w-3 h-3 rounded-full mr-2 ${stat.percentage > 100
                                                                ? "bg-rose-500"
                                                                : stat.percentage > 90
                                                                    ? "bg-amber-500"
                                                                    : "bg-emerald-500"
                                                                } group-hover:animate-pulse`}
                                                        ></div>
                                                        <span className="font-medium">{stat.category}</span>
                                                    </div>
                                                    <div className="text-sm">
                                                        <span
                                                            className={`font-medium px-2 py-0.5 rounded-full ${stat.percentage > 100
                                                                ? "bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                                                                : stat.percentage > 90
                                                                    ? "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                                                                    : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                                                                }`}
                                                        >
                                                            {stat.percentage}%
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-[40%] relative h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden cursor-pointer hover:h-4 transition-all duration-200"
                                                        onClick={handleCategoryClick}
                                                    >
                                                        <div
                                                            className={`absolute left-0 top-0 h-full rounded-full ${stat.percentage > 100
                                                                ? "bg-rose-500"
                                                                : stat.percentage > 90
                                                                    ? "bg-amber-500"
                                                                    : "bg-emerald-500"
                                                                }`}
                                                            style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                                                        ></div>
                                                    </div>

                                                    <div className="w-[60%] flex space-x-3">
                                                        <div
                                                            className="flex-1 flex items-center gap-1 cursor-pointer"
                                                            onClick={handleCategoryClick}
                                                        >
                                                            <div className="h-6 w-6 rounded-full flex items-center justify-center bg-rose-100 dark:bg-rose-900/20">
                                                                <Banknote className="h-3.5 w-3.5 text-rose-500" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] text-muted-foreground">Đã chi</span>
                                                                <span className="font-medium text-xs">{formatCurrency(stat.totalSpent)}</span>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="flex-1 flex items-center gap-1 cursor-pointer"
                                                            onClick={handleCategoryClick}
                                                        >
                                                            <div className="h-6 w-6 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/20">
                                                                <PiggyBank className="h-3.5 w-3.5 text-emerald-500" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] text-muted-foreground">Ngân sách</span>
                                                                <span className="font-medium text-xs">{formatCurrency(stat.budgetAmount)}</span>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="flex-1 flex items-center gap-1 cursor-pointer"
                                                            onClick={handleCategoryClick}
                                                        >
                                                            <div className="h-6 w-6 rounded-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/20">
                                                                <BadgeDollarSign className="h-3.5 w-3.5 text-indigo-500" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] text-muted-foreground">Giao dịch</span>
                                                                <span className="font-medium text-xs">{stat.transactions}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Upcoming Plans */}
                <div className="md:col-span-1">
                    <Card className="shadow-sm hover:shadow-md transition-all duration-300 h-full">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <CardTitle>Kế hoạch sắp tới</CardTitle>
                                    <Timer className="h-5 w-5 ml-2 text-muted-foreground" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="font-normal flex items-center">
                                        <CalendarDays className="h-3.5 w-3.5 mr-1" />7 ngày tới
                                    </Badge>
                                    <Button variant="outline" size="sm"
                                        onClick={() => openDialog("isDialogDetailPlanOpen")}
                                        className="group">
                                        <ListChecks className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                                        Xem tất cả
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[280px] pr-4">
                                <div className="space-y-3">
                                    {upcomingPlans.length > 0 ? (
                                        upcomingPlans.map((plan) => (
                                            <div
                                                key={plan.id}
                                                className="group rounded-lg border p-3 transition-all hover:bg-muted/50 hover:shadow-sm cursor-pointer relative overflow-hidden"
                                                onClick={() => openDialog("isDialogEditPlanOpen", plan)}
                                            >
                                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-medium group-hover:text-primary transition-colors">{plan.title}</div>
                                                        <Badge
                                                            variant={
                                                                new Date(plan.plannedDate).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000
                                                                    ? "destructive"
                                                                    : "default"
                                                            }
                                                            className="flex items-center"
                                                        >
                                                            <CalendarDays className="h-3 w-3 mr-1" />
                                                            {formatDateTimeVN(plan.plannedDate, false)}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-1 mb-1">{plan.description}</p>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center text-muted-foreground">
                                                        <Hourglass className="mr-1 h-3.5 w-3.5" />
                                                        <span className="text-xs">
                                                            {plan.notifyBefore > 0 ? `Thông báo trước ${plan.notifyBefore} ngày` : "Không thông báo"}
                                                        </span>
                                                    </div>
                                                    <span className="font-medium flex items-center">
                                                        <Coins className="h-3.5 w-3.5 mr-1 text-indigo-500" />
                                                        {formatCurrency(plan.amount)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
                                            <CalendarDays className="h-10 w-10 text-muted-foreground mb-4 animate-pulse" />
                                            <h3 className="text-lg font-semibold">Không có kế hoạch nào</h3>
                                            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                                                Bạn chưa có kế hoạch chi tiêu nào sắp tới.
                                            </p>
                                            <Button
                                                variant="default"
                                                className="mt-3 group"
                                                onClick={() => openDialog("isDialogCreatePlanOpen")}
                                            >
                                                <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                                                Tạo kế hoạch
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
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
                    setSelectedPlan: (updatedPlan: ISpendingPlan) =>
                        setSpendingPlans((prev) =>
                            prev.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan))
                        ),
                    isLoading,
                }}
                budgetsDialog={{
                    transformedBudgetData,
                    budgetColumns,
                    budgetTableConfig,
                    setBudgetTableConfig,
                    budgets,
                    setSelectedBudget: (updatedBudget: IBudget) =>
                        setBudgets((prev) =>
                            prev.map((budget) => (budget.id === updatedBudget.id ? updatedBudget : budget))
                        ),
                    isLoading,
                }}
                sharedDialogElements={{
                    isDialogOpen,
                    setIsDialogOpen, // Shared for both plan and budget dialogs
                    selectedPlan,
                    selectedBudget,
                }}
                onCreatePlan={(newPlan: ISpendingPlan) =>
                    setSpendingPlans((prev) => [...prev, newPlan])
                }
                onUpdatePlan={(updatedPlan: ISpendingPlan) =>
                    setSpendingPlans((prev) =>
                        prev.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan))
                    )
                }
                onCreateBudget={(newBudget: IBudget) =>
                    setBudgets((prev) => [...prev, newBudget])
                }
                onUpdateBudget={(updatedBudget: IBudget) =>
                    setBudgets((prev) =>
                        prev.map((budget) => (budget.id === updatedBudget.id ? updatedBudget : budget))
                    )
                }
                onDeleteBudget={(id: string) =>
                    setBudgets((prev) => prev.filter((budget) => budget.id !== id))
                }
            />


        </div >
    )
}

