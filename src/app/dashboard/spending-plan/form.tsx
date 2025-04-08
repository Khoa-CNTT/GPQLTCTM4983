"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getColumns } from "@/components/dashboard/ColumnsTable"
import {
    Banknote,
    CalendarDays,
    CircleDollarSign,
    Clock,
    Coins,
    Flame,
    Hourglass,
    ListChecks,
    PiggyBank,
    Sparkles,
} from "lucide-react"
import { formatCurrency, formatDateTimeVN } from "@/libraries/utils"
import type { IDataTableConfig } from "@/types/common.i"
import { initTableConfig } from "@/constants/data-table"
import { Button } from "@/components/ui/button"
import { useStoreLocal } from "@/hooks/useStoreLocal"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { DateRange } from "react-day-picker"
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
    handleRestoreTarget,
} from "./handlers"
import SpendingPlanDialog from "./dialog"
import type {
    ISpendingPlan,
    ISpendingPlanTable,
    TSpendingPlanActions,
    ICreateFundSavingPlanRequest,
    IUpdateFundSavingPlanRequest,
} from "@/core/fund-saving-plant/models"
import { useFundSavingPlan } from "@/core/fund-saving-plant/hooks"
import { useFundSavingTarget } from "@/core/fund-saving-target/hooks"
import NoDataPlaceHolder from "@/images/2.png"
import Image from "next/image"
import { IBudgetTarget, IDialogFlags, IGetAllDataFundSavingTarget, ICreateFundSavingTargetRequest, IUpdateFundSavingTargetRequest, ITotalBudgetTarget, IPagination, IGetAllDataFundSavingTargetTable } from "@/core/fund-saving-target/models/fund-saving-target.interface"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SpendingPlanForm() {
    const [spendingPlans, setSpendingPlans] = useState<ISpendingPlan[]>([])
    const [selectedPlan, setSelectedPlan] = useState<ISpendingPlan | null>(null)
    const [selectedTarget, setSelectedTarget] = useState<IBudgetTarget | null>(null)
    const [targets, setTargets] = useState<IBudgetTarget[]>([])
    const [totalBudgetTarget, setTotalBudgetTarget] = useState<ITotalBudgetTarget | null>(null)
    const [targetPagination, setTargetPagination] = useState<IGetAllDataFundSavingTarget['pagination'] | null>(null)
    const [dateRange, setDateRange] = useState<DateRange | undefined>()
    const [statusFilter, setStatusFilter] = useState("all")
    const [planTypeFilter, setPlanTypeFilter] = useState<"DAILY" | "WEEKLY" | "MONTHLY" | "ANNUAL">("MONTHLY")
    const [isDialogOpen, setIsDialogOpen] = useState<IDialogFlags>({
        isDialogCreatePlanOpen: false,
        isDialogEditPlanOpen: false,
        isDialogDetailPlanOpen: false,
        isDialogDeletePlanOpen: false,
        isDialogCreateTargetOpen: false,
        isDialogEditTargetOpen: false,
        isDialogDetailTargetOpen: false,
        isDialogDeleteTargetOpen: false,
        isDialogViewAllDataOpen: false,
        isDialogChangeStatusTargetOpen: false,
        isDialogViewAllPlansOpen: false,
        isDialogChangeStatusPlanOpen: false,
    })

    const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>({
        ...initTableConfig,
        isVisibleSortType: false,
        classNameOfScroll: "h-[400px]",
    })
    const [targetTableConfig, setTargetTableConfig] = useState<IDataTableConfig>({
        ...initTableConfig,
        isVisibleSortType: false,
        classNameOfScroll: "h-[400px]",
    })
    const [searchQuery, setSearchQuery] = useState("")

    const { fundId } = useStoreLocal()

    const {
        getAllFundSavingPlan,
        createFundSavingPlan,
        updateFundSavingPlan,
        deleteFundSavingPlan,
        restoreFundSavingPlan,
        updateFundSavingPlanStatus,
    } = useFundSavingPlan()

    const {
        getAllFundSavingTarget,
        createFundSavingTarget,
        updateFundSavingTarget,
        deleteFundSavingTarget,
        restoreFundSavingTarget,
        updateFundSavingTargetStatus,
    } = useFundSavingTarget()

    const {
        getAllData: getAllDataTarget,
        isGetAllPending: isGetAllPendingTarget,
        refetchAllData: refetchAllDataTarget,
    } = getAllFundSavingTarget(fundId)

    const {
        getAllData: getAllDataPlan,
        isGetAllPending: isGetAllPendingPlant,
        refetchAllData: refetchAllDataPlant,
    } = getAllFundSavingPlan(fundId)


    const actionMap: Record<TSpendingPlanActions, () => void> = {
        getAllSpendingPlans: refetchAllDataPlant,
        getAllTargets: refetchAllDataTarget,
    }

    const callBackRefetchAPI = (actions: TSpendingPlanActions[]) => {
        actions.forEach((action) => {
            if (actionMap[action]) {
                actionMap[action]()
            }
        })
    }

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

    const totalPlannedAmount = useMemo(() => {
        return spendingPlans.reduce((acc, plan) => acc + plan.targetAmount, 0)
    }, [spendingPlans])

    const upcomingPlans = useMemo(() => {
        const now = new Date();
        const sevenDaysFromNow = new Date(now);
        sevenDaysFromNow.setDate(now.getDate() + 7);

        return spendingPlans
            .filter((plan) => {
                if (planTypeFilter !== "MONTHLY" && plan.type !== planTypeFilter) {
                    return false;
                }

                const planDate = new Date(plan.expectedDate);
                return planDate
            })
            .sort((a, b) => new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime());
    }, [spendingPlans, planTypeFilter]);

    const transformedSpendingPlanData = useMemo(() => {
        return modifySpendingPlanTableData(
            spendingPlans
                .filter((plan) => statusFilter === "all" || plan.type === statusFilter)
                .filter(
                    (plan) =>
                        !searchQuery ||
                        plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        plan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        plan.trackerTypeName?.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .filter((plan) => {
                    if (!dateRange || !dateRange.from) return true
                    const planDate = new Date(plan.expectedDate)
                    if (dateRange.to) {
                        return planDate >= dateRange.from && planDate <= dateRange.to
                    }
                    return planDate >= dateRange.from
                }),
        )
    }, [spendingPlans, statusFilter, searchQuery, dateRange])

    const planColumns = useMemo(() => {
        if (transformedSpendingPlanData.length === 0) return []
        return getColumns<ISpendingPlanTable>({
            headers: ["Name", "Target Amount", "Expected Date", "Expired Date", "Type"],
            isSort: true,
        })
    }, [transformedSpendingPlanData])

    const targetColumns = useMemo(() => {
        if (targets.length === 0) return [];
        return getColumns<IGetAllDataFundSavingTargetTable>({
            headers: [
                "Name",
                "Target Amount",
                "Current Amount",
                "Start Date",
                "End Date",
                "Status",
            ],
            isSort: true,
        });
    }, [targets]);



    // Reusable function to handle dialog opening
    const openDialog = (type: keyof IDialogFlags, data?: any) => {
        if ((type === "isDialogDetailTargetOpen" || type === "isDialogEditTargetOpen") && data) {
            setSelectedTarget(data)
        } else if ((type === "isDialogDetailPlanOpen" || type === "isDialogEditPlanOpen") && data) {
            setSelectedPlan(data)
        }
        setIsDialogOpen((prev) => ({ ...prev, [type]: true }))
    }

    const transformedTargetData = useMemo(() => {
        return modifyTargetTableData(
            targets
                .filter((target) => statusFilter === "all" || target.status === statusFilter)
                .filter(
                    (target) =>
                        !searchQuery ||
                        target.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        target.description?.toLowerCase().includes(searchQuery.toLowerCase())
                )
        );
    }, [targets, statusFilter, searchQuery]);

    return (
        <div className="mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Budget Card */}
                <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-md text-nowrap font-medium text-white 2xl:text-lg">
                            Tổng ngân sách
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <PiggyBank className="h-12 w-12 animate-pulse text-white opacity-75" />
                            <div className="text-right">
                                <p className="text-2xl font-bold text-white">
                                    {totalBudgetTarget ? formatCurrency(totalBudgetTarget.targetAmount, "VND") : "N/A"}
                                </p>
                                <p className="text-sm text-blue-100">
                                    Tổng kế hoạch tài chính của bạn
                                </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1.5">
                                <span className="text-white/80">Tiến độ sử dụng</span>
                                <span className="font-medium text-white">
                                    {totalBudgetTarget ? Math.round(totalBudgetTarget.progress) : 0}%
                                </span>
                            </div>
                            {totalBudgetTarget && (
                                <Progress value={totalBudgetTarget.progress} className="h-2 bg-blue-200/30" />
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Spent Amount Card */}
                <Card className="group relative overflow-hidden bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-md text-nowrap font-medium text-white 2xl:text-lg">
                            Đã chi tiêu
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <Banknote className="h-12 w-12 animate-pulse text-white opacity-75" />
                            <div className="text-right">
                                <p className="text-2xl font-bold text-white">
                                    {formatCurrency(totalBudgetTarget?.currentAmount || 0)}
                                </p>
                                <p className="text-sm text-rose-100">
                                    Đã sử dụng {totalBudgetTarget ? Math.round(totalBudgetTarget.progress) : 0}% ngân sách
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-end justify-end">
                            {totalBudgetTarget && totalBudgetTarget.averageDailyPercentage > 1.5 && (
                                <Badge className="bg-white/20 text-white border-none">
                                    <Flame className="h-3 w-3 mr-1" /> Tốc độ chi tiêu cao
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Remaining Budget Card */}
                <Card className="group relative overflow-hidden bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-md text-nowrap font-medium text-white 2xl:text-lg">
                            Còn lại
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <Coins className="h-12 w-12 animate-pulse text-white opacity-75" />
                            <div className="text-right">
                                <p className="text-2xl font-bold text-white">
                                    {formatCurrency(totalBudgetTarget?.remain || 0, 'VND')}
                                </p>
                                <p className="text-sm text-emerald-100">
                                    Còn lại {Math.round(100 - (totalBudgetTarget?.progress ?? 0))}% ngân sách
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-end justify-end">
                            {totalBudgetTarget && (
                                <Badge className="bg-white/20 text-white border-none">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {totalBudgetTarget.remainingDays} ngày còn lại
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Planned Spending Card */}
                <Card className="group relative overflow-hidden bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-md text-nowrap font-medium text-white 2xl:text-lg">
                            Kế hoạch chi tiêu
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <CalendarDays className="h-12 w-12 animate-pulse text-white opacity-75" />
                            <div className="text-right">
                                <p className="text-2xl font-bold text-white">
                                    {formatCurrency(totalPlannedAmount)}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-end justify-end">
                            {upcomingPlans.length > 0 && (
                                <Badge className="bg-white/20 text-white border-none">
                                    {upcomingPlans.length} kế hoạch sắp tới
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content - Budget Targets & Upcoming Plans */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Budget Targets Section */}
                <div className="lg:col-span-2">
                    <Card className="h-full border flex flex-col">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-lg">Danh sách ngân sách</CardTitle>
                                    <CircleDollarSign className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => openDialog("isDialogViewAllDataOpen")}
                                        className="flex items-center gap-2"
                                    >
                                        <ListChecks className="h-4 w-4" /> Xem tất cả
                                    </Button>
                                    <Button
                                        variant="default"
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                        onClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogCreateTargetOpen: true }))}
                                    >
                                        <CircleDollarSign className="mr-2 h-4 w-4" /> Tạo ngân sách
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <ScrollArea className="flex-1">
                            <CardContent className="p-4">
                                {targets.length > 0 ? (
                                    <div className="space-y-4">
                                        {targets.map((target) => {
                                            const percentage = Math.round((target.currentAmount / target.targetAmount) * 100);
                                            const isNearlyComplete = percentage >= 90;

                                            return (
                                                <div
                                                    key={target.id}
                                                    onClick={() => openDialog("isDialogDetailTargetOpen", target)}
                                                    className="p-4 rounded-lg border hover:border-emerald-200 hover:shadow-sm hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10 cursor-pointer transition-all"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`p-2 rounded-lg ${isNearlyComplete
                                                            ? 'bg-amber-100 dark:bg-amber-900/30'
                                                            : 'bg-emerald-100 dark:bg-emerald-900/30'
                                                            }`}>
                                                            <CircleDollarSign className={`h-5 w-5 ${isNearlyComplete
                                                                ? 'text-amber-600 dark:text-amber-400'
                                                                : 'text-emerald-600 dark:text-emerald-400'
                                                                }`} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <h3 className="font-medium">{target.name}</h3>
                                                                <Badge className="text-xs">
                                                                    {target.trackerTypeName || 'Không phân loại'}
                                                                </Badge>
                                                            </div>

                                                            <div className="mt-3">
                                                                <div className="flex justify-between text-sm mb-1.5">
                                                                    <span className="text-muted-foreground">Tiến độ:</span>
                                                                    <span className={`font-medium ${isNearlyComplete ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                                        {percentage}%
                                                                    </span>
                                                                </div>
                                                                <Progress
                                                                    value={percentage}
                                                                    className={`h-2 ${isNearlyComplete ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}
                                                                />
                                                            </div>

                                                            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                                                                <div>
                                                                    <p className="text-muted-foreground text-xs">Mục tiêu</p>
                                                                    <p className="font-medium">{formatCurrency(target.targetAmount)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-muted-foreground text-xs">Đã chi</p>
                                                                    <p className="font-medium">{formatCurrency(target.currentAmount)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-muted-foreground text-xs">Còn lại</p>
                                                                    <p className="font-medium text-emerald-600">{formatCurrency(target.remain)}</p>
                                                                </div>
                                                            </div>

                                                            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                                                                <span>{target.remainingDays}</span>
                                                                <Badge variant="outline" className="text-[10px] h-4">
                                                                    {target.status}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[400px]">
                                        <Image
                                            src={NoDataPlaceHolder}
                                            alt="No data"
                                            width={100}
                                            height={100}
                                            className="object-contain mb-4 opacity-60"
                                        />
                                        <h3 className="text-lg font-medium mb-2">Chưa có ngân sách nào</h3>
                                        <p className="text-muted-foreground mb-6 text-center max-w-md">
                                            Tạo ngân sách để theo dõi và kiểm soát chi tiêu của bạn theo từng hạng mục
                                        </p>
                                        <Button
                                            variant="default"
                                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                                            onClick={() => openDialog("isDialogCreateTargetOpen")}
                                        >
                                            <CircleDollarSign className="mr-2 h-4 w-4" />
                                            Tạo ngân sách đầu tiên
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </ScrollArea>

                        {targets.length > 5 && (
                            <div className="p-3 border-t mt-auto">
                                <Button
                                    variant="outline"
                                    onClick={() => openDialog("isDialogViewAllDataOpen")}
                                    className="w-full z-50"
                                >
                                    <ListChecks className="mr-2 h-4 w-4" />
                                    Xem tất cả ngân sách
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Upcoming Plans Section */}
                <div className="lg:col-span-1">
                    <Card className="h-full border flex flex-col">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-lg">Kế hoạch sắp tới</CardTitle>
                                    <CalendarDays className="h-5 w-5 text-blue-500" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select value={planTypeFilter} onValueChange={(value) => setPlanTypeFilter(value as "DAILY" | "WEEKLY" | "MONTHLY" | "ANNUAL")}>
                                        <SelectTrigger className="w-[130px] h-9">
                                            <SelectValue placeholder="Tần suất" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DAILY">Hàng ngày</SelectItem>
                                            <SelectItem value="WEEKLY">Hàng tuần</SelectItem>
                                            <SelectItem value="MONTHLY">Hàng tháng</SelectItem>
                                            <SelectItem value="ANNUAL">Hàng năm</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="default"
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogCreatePlanOpen: true }))}
                                    >
                                        <Sparkles className="mr-2 h-4 w-4" /> Tạo kế hoạch
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <ScrollArea className="flex-1">
                            <CardContent className="p-4 h-[300px]">
                                {upcomingPlans.length > 0 ? (
                                    <div className="space-y-6">
                                        {/* Today's Plans */}
                                        {upcomingPlans.some(plan => {
                                            const today = new Date();
                                            const planDate = new Date(plan.expectedDate);
                                            return planDate.getDate() === today.getDate() &&
                                                planDate.getMonth() === today.getMonth() &&
                                                planDate.getFullYear() === today.getFullYear();
                                        }) && (
                                                <div>
                                                    <div className="space-y-3">
                                                        {upcomingPlans
                                                            .filter(plan => {
                                                                const today = new Date();
                                                                const planDate = new Date(plan.expectedDate);
                                                                return planDate.getDate() === today.getDate() &&
                                                                    planDate.getMonth() === today.getMonth() &&
                                                                    planDate.getFullYear() === today.getFullYear();
                                                            })
                                                            .map(plan => (
                                                                <div
                                                                    key={plan.id}
                                                                    onClick={() => openDialog("isDialogDetailPlanOpen", plan)}
                                                                    className="p-3 rounded-lg border border-red-100 bg-red-50/30 dark:border-red-900/30 dark:bg-red-950/20 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer transition-all"
                                                                >
                                                                    <div className="flex justify-between mb-1.5">
                                                                        <div className="font-medium">{plan.name}</div>
                                                                        <Badge variant="outline" className="text-xs font-normal text-red-600 border-red-200 dark:border-red-800">
                                                                            <Flame className="h-3.5 w-3.5 mr-1.5" />
                                                                            Hôm nay
                                                                        </Badge>
                                                                    </div>
                                                                    {plan.description && (
                                                                        <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                                                            {plan.description}
                                                                        </div>
                                                                    )}
                                                                    <div className="flex justify-between text-sm mt-1">
                                                                        <span className="flex items-center text-muted-foreground">
                                                                            <Hourglass className="h-3.5 w-3.5 mr-1" />
                                                                            <span className="text-xs">
                                                                                {formatDateTimeVN(plan.expectedDate, false)}
                                                                            </span>
                                                                        </span>
                                                                        <span className="font-medium text-teal-600">
                                                                            {formatCurrency(plan.targetAmount)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            )}

                                        {/* This Week's Plans */}
                                        <div>
                                            <div className="space-y-3">
                                                {upcomingPlans
                                                    .filter(plan => {
                                                        const today = new Date();
                                                        const planDate = new Date(plan.expectedDate);
                                                        // Exclude today's plans (already shown above)
                                                        return !(planDate.getDate() === today.getDate() &&
                                                            planDate.getMonth() === today.getMonth() &&
                                                            planDate.getFullYear() === today.getFullYear());
                                                    })
                                                    .map(plan => {
                                                        const isNearDate = new Date(plan.expectedDate).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000;

                                                        return (
                                                            <div
                                                                key={plan.id}
                                                                onClick={() => openDialog("isDialogDetailPlanOpen", plan)}
                                                                className={`p-3 rounded-lg border hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 cursor-pointer transition-all ${isNearDate ? 'border-amber-100 bg-amber-50/30 dark:border-amber-900/30 dark:bg-amber-950/10' : ''
                                                                    }`}
                                                            >
                                                                <div className="flex justify-between mb-1.5">
                                                                    <div className="font-medium">{plan.name}</div>
                                                                    {isNearDate && (
                                                                        <Badge variant="outline" className="text-xs font-normal text-amber-600 border-amber-200 dark:border-amber-800">
                                                                            Sắp tới
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <div className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                                        {plan.trackerTypeName}
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {formatDateTimeVN(plan.expectedDate, false)}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    {plan.description && (
                                                                        <div className="text-xs text-muted-foreground line-clamp-1 mr-2">
                                                                            {plan.description}
                                                                        </div>
                                                                    )}
                                                                    <span className="font-medium text-blue-600 whitespace-nowrap">
                                                                        {formatCurrency(plan.targetAmount)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        <CalendarDays className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                                        <h3 className="text-lg font-medium mb-2">Không có kế hoạch nào</h3>
                                        <p className="text-muted-foreground mb-6 text-center max-w-md">
                                            Bạn chưa có kế hoạch chi tiêu nào sắp tới. Hãy tạo kế hoạch để quản lý chi tiêu hiệu quả hơn.
                                        </p>
                                        <Button
                                            variant="default"
                                            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                                            onClick={() => openDialog("isDialogCreatePlanOpen")}
                                        >
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Tạo kế hoạch đầu tiên
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </ScrollArea>

                        {upcomingPlans.length > 5 && (
                            <div className="p-3 border-t mt-auto">
                                <Button
                                    variant="outline"
                                    onClick={() => openDialog("isDialogViewAllPlansOpen")}
                                    className="w-full"
                                >
                                    <ListChecks className="mr-2 h-4 w-4" />
                                    Xem tất cả {upcomingPlans.length} kế hoạch
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Dialog components remain the same */}
            <SpendingPlanDialog
                plansDialog={{
                    transformedSpendingPlanData,
                    planColumns,
                    dataTableConfig,
                    setDataTableConfig,
                    spendingPlans,
                    setSelectedPlan,
                    isLoading: isGetAllPendingPlant,
                }}
                targetsDialog={{
                    transformedTargetData,
                    targetColumns,
                    targetTableConfig,
                    setTargetTableConfig,
                    targets,
                    setSelectedTarget,
                    isLoading: isGetAllPendingTarget,
                }}
                sharedDialogElements={{
                    isDialogOpen,
                    setIsDialogOpen,
                    selectedPlan,
                    selectedTarget,
                }}
                callBack={{
                    onCreatePlan: (plan: ICreateFundSavingPlanRequest) =>
                        handleCreateSpendingPlan({
                            data: { ...plan, fundId },
                            hookCreate: createFundSavingPlan,
                            setIsDialogOpen,
                            callBackRefetchAPI,
                            setDataTableConfig,
                        }),
                    onUpdatePlan: (plan: IUpdateFundSavingPlanRequest) =>
                        handleUpdateSpendingPlan({
                            data: plan,
                            hookUpdate: updateFundSavingPlan,
                            setIsDialogOpen,
                            callBackRefetchAPI,
                            setDataTableConfig,
                        }),
                    onDeletePlan: (id: string) =>
                        handleDeleteItem({
                            data: { id },
                            hookDelete: deleteFundSavingPlan,
                            setIsDialogOpen,
                            callBackRefetchAPI,
                            setDataTableConfig,
                        }),
                    onRestorePlan: (id: string) =>
                        handleRestoreSpendingPlan({
                            data: { id },
                            hookRestore: restoreFundSavingPlan,
                            callBackRefetchAPI,
                            setDataTableConfig,
                            setIsDialogOpen,
                        }),
                    onUpdatePlanStatus: (id: string, status: string) =>
                        handleUpdateSpendingPlanStatus({
                            data: { id, status },
                            hookUpdateStatus: updateFundSavingPlan,
                            callBackRefetchAPI,
                            setDataTableConfig,
                            setIsDialogOpen,
                        }),

                    // Callback cho các hành động liên quan đến Target
                    onCreateTarget: (target: ICreateFundSavingTargetRequest) =>
                        handleCreateTarget({
                            data: { ...target, fundId },
                            hookCreate: createFundSavingTarget,
                            setIsDialogOpen,
                            callBackRefetchAPI,
                            setDataTableConfig: setTargetTableConfig,
                        }),
                    onUpdateTarget: (target: IUpdateFundSavingTargetRequest) =>
                        handleUpdateTarget({
                            data: target,
                            hookUpdate: updateFundSavingTarget,
                            setIsDialogOpen,
                            callBackRefetchAPI,
                            setDataTableConfig: setTargetTableConfig,
                        }),
                    onDeleteTarget: (id: string) =>
                        handleDeleteItem({
                            data: { id },
                            hookDelete: deleteFundSavingTarget,
                            setIsDialogOpen,
                            callBackRefetchAPI,
                            setDataTableConfig: setTargetTableConfig,
                        }),
                    onRestoreTarget: (id: string) =>
                        handleRestoreTarget({
                            data: { id },
                            hookRestore: restoreFundSavingTarget,
                            callBackRefetchAPI,
                            setDataTableConfig: setTargetTableConfig,
                            setIsDialogOpen,
                        }),
                    onUpdateTargetStatus: (id: string, status: string) =>
                        handleUpdateTargetStatus({
                            data: { id, status },
                            hookUpdateStatus: updateFundSavingTarget,
                            callBackRefetchAPI,
                            setDataTableConfig: setTargetTableConfig,
                            setIsDialogOpen,
                        }),

                    onGetAllFundSavingTarget: () => targets,
                    onGetAllFundSavingPlan: () => spendingPlans,
                }}
            />
        </div>
    )
}
