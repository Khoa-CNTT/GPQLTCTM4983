"use client"
import type React from "react"
import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Trash2 } from "lucide-react"
import { cn, formatCurrency, formatDateTimeVN } from "@/libraries/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Progress } from "@/components/ui/progress"
import {
    categories,
    accountSources,
    notifyOptions,
    initEmptyPlan,
    initEmptyBudget
} from "./constants"
import {
    ISpendingPlan,
    ISpendingPlanTable,
    IBudget,
    IBudgetTable,
    IDialogFlags,
    ICategoryStatistic,
    ISpendingPlanDialogProps
} from "@/core/spending-plan/models"

const SpendingPlanDialog: React.FC<ISpendingPlanDialogProps> = ({
    isDialogOpen,
    setIsDialogOpen,
    selectedPlan,
    selectedBudget,
    onCreatePlan,
    onUpdatePlan,
    onCreateBudget,
    onUpdateBudget,
    isLoading,
    onDeleteBudget,
}) => {
    // Plan form state
    const [planTitle, setPlanTitle] = useState("")
    const [planDescription, setPlanDescription] = useState("")
    const [planAmount, setPlanAmount] = useState("")
    const [planDate, setPlanDate] = useState<Date | undefined>(new Date())
    const [planCategory, setPlanCategory] = useState("")
    const [planStatus, setPlanStatus] = useState<"pending" | "completed" | "cancelled">("pending")
    const [planNotifyBefore, setPlanNotifyBefore] = useState(1)
    const [planAccountSourceId, setPlanAccountSourceId] = useState("")
    const [planAccountSourceName, setPlanAccountSourceName] = useState("")

    // Budget form state
    const [budgetCategory, setBudgetCategory] = useState("")
    const [budgetAmount, setBudgetAmount] = useState("")
    const [budgetStartDate, setBudgetStartDate] = useState<Date | undefined>(new Date())
    const [budgetEndDate, setBudgetEndDate] = useState<Date | undefined>(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    )

    // Reset plan form
    const resetPlanForm = () => {
        setPlanTitle("")
        setPlanDescription("")
        setPlanAmount("")
        setPlanDate(new Date())
        setPlanCategory("")
        setPlanStatus("pending")
        setPlanNotifyBefore(1)
        setPlanAccountSourceId("")
        setPlanAccountSourceName("")
    }

    // Reset budget form
    const resetBudgetForm = () => {
        setBudgetCategory("")
        setBudgetAmount("")
        setBudgetStartDate(new Date())
        setBudgetEndDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
    }

    // Set form values when editing plan
    useEffect(() => {
        if (selectedPlan && isDialogOpen.isDialogEditPlanOpen) {
            setPlanTitle(selectedPlan.title)
            setPlanDescription(selectedPlan.description)
            setPlanAmount(selectedPlan.amount.toString())
            setPlanDate(new Date(selectedPlan.plannedDate))
            setPlanCategory(selectedPlan.category)
            setPlanStatus(selectedPlan.status)
            setPlanNotifyBefore(selectedPlan.notifyBefore)
            setPlanAccountSourceId(selectedPlan.accountSourceId || "")
            setPlanAccountSourceName(selectedPlan.accountSourceName || "")
        }
    }, [selectedPlan, isDialogOpen.isDialogEditPlanOpen])

    // Set form values when editing budget
    useEffect(() => {
        if (selectedBudget && isDialogOpen.isDialogEditBudgetOpen) {
            setBudgetCategory(selectedBudget.category)
            setBudgetAmount(selectedBudget.budgetAmount.toString())
            setBudgetStartDate(new Date(selectedBudget.startDate))
            setBudgetEndDate(new Date(selectedBudget.endDate))
        }
    }, [selectedBudget, isDialogOpen.isDialogEditBudgetOpen])

    // Handle create plan
    const handleCreatePlan = () => {
        if (!planTitle || !planAmount || !planDate || !planCategory) return

        onCreatePlan({
            title: planTitle,
            description: planDescription,
            amount: Number(planAmount),
            plannedDate: planDate.toISOString(),
            category: planCategory,
            status: planStatus,
            notifyBefore: planNotifyBefore,
            accountSourceId: planAccountSourceId,
            accountSourceName: planAccountSourceName,
        })

        resetPlanForm()
    }

    // Handle update plan
    const handleUpdatePlan = () => {
        if (!selectedPlan || !planTitle || !planAmount || !planDate || !planCategory) return

        onUpdatePlan({
            ...selectedPlan,
            title: planTitle,
            description: planDescription,
            amount: Number(planAmount),
            plannedDate: planDate.toISOString(),
            category: planCategory,
            status: planStatus,
            notifyBefore: planNotifyBefore,
            accountSourceId: planAccountSourceId,
            accountSourceName: planAccountSourceName,
            updatedAt: new Date().toISOString(),
        })

        resetPlanForm()
    }

    // Handle create budget
    const handleCreateBudget = () => {
        if (!budgetCategory || !budgetAmount || !budgetStartDate || !budgetEndDate) return

        onCreateBudget({
            category: budgetCategory,
            budgetAmount: Number(budgetAmount),
            spentAmount: 0,
            remainingAmount: Number(budgetAmount),
            startDate: budgetStartDate.toISOString(),
            endDate: budgetEndDate.toISOString(),
            status: "active",
        })

        resetBudgetForm()
    }

    // Handle update budget
    const handleUpdateBudget = () => {
        if (!selectedBudget || !budgetCategory || !budgetAmount || !budgetStartDate || !budgetEndDate) return

        const newBudgetAmount = Number(budgetAmount)
        const remainingAmount = newBudgetAmount - selectedBudget.spentAmount
        const status = remainingAmount < 0 ? "exceeded" : "active"

        onUpdateBudget({
            ...selectedBudget,
            category: budgetCategory,
            budgetAmount: newBudgetAmount,
            remainingAmount: remainingAmount,
            startDate: budgetStartDate.toISOString(),
            endDate: budgetEndDate.toISOString(),
            status: status,
            updatedAt: new Date().toISOString(),
        })

        resetBudgetForm()
    }

    // Handle account source change
    const handleAccountSourceChange = (value: string) => {
        const source = accountSources.find((s: { id: string; name: string }) => s.id === value)
        setPlanAccountSourceId(value)
        setPlanAccountSourceName(source?.name || "")
    }

    const handleDeleteBudget = (id: string) => {
        onDeleteBudget(id)
    }

    // Thêm type cho formatDateTimeVN
    const formatDateTime = (date: string, shortFormat?: boolean) => {
        return formatDateTimeVN(date, shortFormat || false)
    }

    return (
        <>
            {/* Create Plan Dialog */}
            <Dialog
                open={isDialogOpen.isDialogCreatePlanOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen((prev: IDialogFlags) => ({ ...prev, isDialogCreatePlanOpen: open }))
                    if (!open) resetPlanForm()
                }}
            >
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Tạo kế hoạch chi tiêu mới</DialogTitle>
                        <DialogDescription>Tạo kế hoạch chi tiêu để quản lý tài chính hiệu quả hơn.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Tiêu đề</Label>
                            <Input
                                id="title"
                                value={planTitle}
                                onChange={(e) => setPlanTitle(e.target.value)}
                                placeholder="Nhập tiêu đề kế hoạch"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                                id="description"
                                value={planDescription}
                                onChange={(e) => setPlanDescription(e.target.value)}
                                placeholder="Nhập mô tả chi tiết"
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Số tiền</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={planAmount}
                                    onChange={(e) => setPlanAmount(e.target.value)}
                                    placeholder="Nhập số tiền"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category">Danh mục</Label>
                                <Select value={planCategory} onValueChange={setPlanCategory}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category: string) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Ngày dự kiến</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn("justify-start text-left font-normal", !planDate && "text-muted-foreground")}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {planDate ? format(planDate, "PPP", { locale: vi }) : <span>Chọn ngày</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={planDate} onSelect={setPlanDate} />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="accountSource">Nguồn tiền</Label>
                                <Select value={planAccountSourceId} onValueChange={handleAccountSourceChange}>
                                    <SelectTrigger id="accountSource">
                                        <SelectValue placeholder="Chọn nguồn tiền" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accountSources.map((source: { id: string; name: string }) => (
                                            <SelectItem key={source.id} value={source.id}>
                                                {source.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="notifyBefore">Thông báo</Label>
                                <Select
                                    value={planNotifyBefore.toString()}
                                    onValueChange={(value) => setPlanNotifyBefore(Number(value))}
                                >
                                    <SelectTrigger id="notifyBefore">
                                        <SelectValue placeholder="Chọn thời gian thông báo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {notifyOptions.map((option: { value: number; label: string }) => (
                                            <SelectItem key={option.value} value={option.value.toString()}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen((prev: IDialogFlags) => ({ ...prev, isDialogCreatePlanOpen: false }))}
                        >
                            Hủy
                        </Button>
                        <Button onClick={handleCreatePlan} disabled={isLoading} isLoading={isLoading}>
                            Tạo kế hoạch
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Plan Dialog */}
            <Dialog
                open={isDialogOpen.isDialogEditPlanOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen((prev: IDialogFlags) => ({ ...prev, isDialogEditPlanOpen: open }))
                    if (!open) resetPlanForm()
                }}
            >
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa kế hoạch chi tiêu</DialogTitle>
                        <DialogDescription>Cập nhật thông tin kế hoạch chi tiêu của bạn.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-title">Tiêu đề</Label>
                            <Input
                                id="edit-title"
                                value={planTitle}
                                onChange={(e) => setPlanTitle(e.target.value)}
                                placeholder="Nhập tiêu đề kế hoạch"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Mô tả</Label>
                            <Textarea
                                id="edit-description"
                                value={planDescription}
                                onChange={(e) => setPlanDescription(e.target.value)}
                                placeholder="Nhập mô tả chi tiết"
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-amount">Số tiền</Label>
                                <Input
                                    id="edit-amount"
                                    type="number"
                                    value={planAmount}
                                    onChange={(e) => setPlanAmount(e.target.value)}
                                    placeholder="Nhập số tiền"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-category">Danh mục</Label>
                                <Select value={planCategory} onValueChange={setPlanCategory}>
                                    <SelectTrigger id="edit-category">
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Ngày dự kiến</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn("justify-start text-left font-normal", !planDate && "text-muted-foreground")}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {planDate ? format(planDate, "PPP", { locale: vi }) : <span>Chọn ngày</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={planDate} onSelect={setPlanDate} />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-accountSource">Nguồn tiền</Label>
                                <Select value={planAccountSourceId} onValueChange={handleAccountSourceChange}>
                                    <SelectTrigger id="edit-accountSource">
                                        <SelectValue placeholder="Chọn nguồn tiền" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accountSources.map((source) => (
                                            <SelectItem key={source.id} value={source.id}>
                                                {source.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-notifyBefore">Thông báo</Label>
                                <Select
                                    value={planNotifyBefore.toString()}
                                    onValueChange={(value) => setPlanNotifyBefore(Number(value))}
                                >
                                    <SelectTrigger id="edit-notifyBefore">
                                        <SelectValue placeholder="Chọn thời gian thông báo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {notifyOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value.toString()}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-status">Trạng thái</Label>
                            <Select
                                value={planStatus}
                                onValueChange={(value: "pending" | "completed" | "cancelled") => setPlanStatus(value)}
                            >
                                <SelectTrigger id="edit-status">
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Chờ thực hiện</SelectItem>
                                    <SelectItem value="completed">Hoàn thành</SelectItem>
                                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen((prev: IDialogFlags) => ({ ...prev, isDialogEditPlanOpen: false }))}
                        >
                            Hủy
                        </Button>
                        <Button onClick={handleUpdatePlan} disabled={isLoading} isLoading={isLoading}>
                            Cập nhật
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Detail Plan Dialog */}
            <Dialog
                open={isDialogOpen.isDialogDetailPlanOpen}
                onOpenChange={(open) => setIsDialogOpen((prev: IDialogFlags) => ({ ...prev, isDialogDetailPlanOpen: open }))}
            >
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Chi tiết kế hoạch</DialogTitle>
                    </DialogHeader>
                    {selectedPlan && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Tiêu đề</h4>
                                    <p className="text-base font-medium">{selectedPlan.title}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Danh mục</h4>
                                    <p className="text-base font-medium">{selectedPlan.category}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Mô tả</h4>
                                <p className="text-base">{selectedPlan.description || "Không có mô tả"}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Số tiền</h4>
                                    <p className="text-base font-medium">{formatCurrency(selectedPlan.amount, "đ", "vi-vn")}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Ngày dự kiến</h4>
                                    <p className="text-base font-medium">{formatDateTime(selectedPlan.plannedDate, true)}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Trạng thái</h4>
                                    <p className="text-base font-medium capitalize">
                                        {selectedPlan.status === "pending"
                                            ? "Chờ thực hiện"
                                            : selectedPlan.status === "completed"
                                                ? "Hoàn thành"
                                                : "Đã hủy"}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Thông báo</h4>
                                    <p className="text-base font-medium">
                                        {selectedPlan.notifyBefore === 0 ? "Không thông báo" : `Trước ${selectedPlan.notifyBefore} ngày`}
                                    </p>
                                </div>
                            </div>
                            {selectedPlan.accountSourceName && (
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Nguồn tiền</h4>
                                    <p className="text-base font-medium">{selectedPlan.accountSourceName}</p>
                                </div>
                            )}
                            <Separator />
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Tạo lúc: {formatDateTime(selectedPlan.createdAt, true)}</span>
                                <span>Cập nhật: {formatDateTime(selectedPlan.updatedAt, true)}</span>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen((prev: IDialogFlags) => ({ ...prev, isDialogDetailPlanOpen: false }))}
                        >
                            Đóng
                        </Button>
                        <Button
                            onClick={() => {
                                setIsDialogOpen((prev: IDialogFlags) => ({
                                    ...prev,
                                    isDialogDetailPlanOpen: false,
                                    isDialogEditPlanOpen: true,
                                }))
                            }}
                        >
                            Chỉnh sửa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Plan Dialog */}
            <Dialog
                open={isDialogOpen.isDialogDeletePlanOpen}
                onOpenChange={(open) => setIsDialogOpen((prev: IDialogFlags) => ({ ...prev, isDialogDeletePlanOpen: open }))}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Xóa kế hoạch chi tiêu</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa kế hoạch chi tiêu này? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedPlan && (
                        <div className="py-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium">{selectedPlan.title}</h3>
                                        <Badge>{formatCurrency(selectedPlan.amount, "đ", "vi-vn")}</Badge>
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">{selectedPlan.description}</p>
                                    <div className="mt-2 text-sm">
                                        <span className="text-muted-foreground">Ngày dự kiến: </span>
                                        {formatDateTime(selectedPlan.plannedDate, true)}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen((prev: IDialogFlags) => ({ ...prev, isDialogDeletePlanOpen: false }))}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedPlan && onUpdatePlan({ ...selectedPlan, status: "cancelled" })}
                            disabled={isLoading}
                            isLoading={isLoading}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Budget Dialog */}
            <Dialog
                open={isDialogOpen.isDialogCreateBudgetOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen((prev: IDialogFlags) => ({ ...prev, isDialogCreateBudgetOpen: open }))
                    if (!open) resetBudgetForm()
                }}
            >
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Tạo ngân sách mới</DialogTitle>
                        <DialogDescription>
                            Tạo ngân sách cho danh mục chi tiêu để quản lý tài chính hiệu quả hơn.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="budget-category">Danh mục</Label>
                            <Select value={budgetCategory} onValueChange={setBudgetCategory}>
                                <SelectTrigger id="budget-category">
                                    <SelectValue placeholder="Chọn danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category: string) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="budget-amount">Số tiền ngân sách</Label>
                            <Input
                                id="budget-amount"
                                type="number"
                                value={budgetAmount}
                                onChange={(e) => setBudgetAmount(e.target.value)}
                                placeholder="Nhập số tiền ngân sách"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Thời gian áp dụng</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="mb-2 block text-xs">Từ ngày</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !budgetStartDate && "text-muted-foreground",
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {budgetStartDate ? format(budgetStartDate, "PPP", { locale: vi }) : <span>Chọn ngày</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={budgetStartDate} onSelect={setBudgetStartDate} />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div>
                                    <Label className="mb-2 block text-xs">Đến ngày</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !budgetEndDate && "text-muted-foreground",
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {budgetEndDate ? format(budgetEndDate, "PPP", { locale: vi }) : <span>Chọn ngày</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={budgetEndDate} onSelect={setBudgetEndDate} />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen((prev: IDialogFlags) => ({ ...prev, isDialogCreateBudgetOpen: false }))}
                        >
                            Hủy
                        </Button>
                        <Button onClick={handleCreateBudget} disabled={isLoading} isLoading={isLoading}>
                            Tạo ngân sách
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Budget Dialog */}
            <Dialog
                open={isDialogOpen.isDialogEditBudgetOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen((prev: IDialogFlags) => ({ ...prev, isDialogEditBudgetOpen: open }))
                    if (!open) resetBudgetForm()
                }}
            >
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa ngân sách</DialogTitle>
                        <DialogDescription>Cập nhật thông tin ngân sách của bạn.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-budget-category">Danh mục</Label>
                            <Select value={budgetCategory} onValueChange={setBudgetCategory}>
                                <SelectTrigger id="edit-budget-category">
                                    <SelectValue placeholder="Chọn danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category: string) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-budget-amount">Số tiền ngân sách</Label>
                            <Input
                                id="edit-budget-amount"
                                type="number"
                                value={budgetAmount}
                                onChange={(e) => setBudgetAmount(e.target.value)}
                                placeholder="Nhập số tiền ngân sách"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Thời gian áp dụng</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="mb-2 block text-xs">Từ ngày</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !budgetStartDate && "text-muted-foreground",
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {budgetStartDate ? format(budgetStartDate, "PPP", { locale: vi }) : <span>Chọn ngày</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={budgetStartDate} onSelect={setBudgetStartDate} />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div>
                                    <Label className="mb-2 block text-xs">Đến ngày</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !budgetEndDate && "text-muted-foreground",
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {budgetEndDate ? format(budgetEndDate, "PPP", { locale: vi }) : <span>Chọn ngày</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={budgetEndDate} onSelect={setBudgetEndDate} />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                        {selectedBudget && (
                            <div className="rounded-md bg-muted p-4">
                                <div className="text-sm font-medium">Thông tin hiện tại</div>
                                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Đã chi tiêu:</span>
                                        <div className="font-medium">{formatCurrency(selectedBudget.spentAmount, "đ", "vi-vn")}</div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Còn lại:</span>
                                        <div className={`font-medium ${selectedBudget.remainingAmount < 0 ? "text-red-500" : ""}`}>
                                            {formatCurrency(selectedBudget.remainingAmount, "đ", "vi-vn")}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen((prev: IDialogFlags) => ({ ...prev, isDialogEditBudgetOpen: false }))}
                        >
                            Hủy
                        </Button>
                        <Button onClick={handleUpdateBudget} disabled={isLoading} isLoading={isLoading}>
                            Cập nhật
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Detail Budget Dialog */}
            <Dialog
                open={isDialogOpen.isDialogDetailBudgetOpen}
                onOpenChange={(open) => setIsDialogOpen((prev: IDialogFlags) => ({ ...prev, isDialogDetailBudgetOpen: open }))}
            >
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Chi tiết ngân sách</DialogTitle>
                    </DialogHeader>
                    {selectedBudget && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Danh mục</h4>
                                    <p className="text-base font-medium">{selectedBudget.category}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Trạng thái</h4>
                                    <p className="text-base font-medium capitalize">
                                        {selectedBudget.status === "active"
                                            ? "Đang hoạt động"
                                            : selectedBudget.status === "completed"
                                                ? "Hoàn thành"
                                                : "Vượt ngân sách"}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Ngân sách</h4>
                                    <p className="text-base font-medium">{formatCurrency(selectedBudget.budgetAmount, "đ", "vi-vn")}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Đã chi tiêu</h4>
                                    <p className="text-base font-medium">{formatCurrency(selectedBudget.spentAmount, "đ", "vi-vn")}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Còn lại</h4>
                                <p
                                    className={`text-base font-medium ${selectedBudget.remainingAmount < 0 ? "text-red-500" : "text-green-500"}`}
                                >
                                    {formatCurrency(selectedBudget.remainingAmount, "đ", "vi-vn")}
                                </p>
                                <div className="mt-2">
                                    <div className="flex justify-between text-xs">
                                        <span>0%</span>
                                        <span>100%</span>
                                    </div>
                                    <Progress
                                        value={(selectedBudget.spentAmount / selectedBudget.budgetAmount) * 100}
                                        className={`h-2 w-24 ${selectedBudget.status === "exceeded" ? "bg-red-200" : "bg-blue-200"}`}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Từ ngày</h4>
                                    <p className="text-base font-medium">{formatDateTime(selectedBudget.startDate, true)}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Đến ngày</h4>
                                    <p className="text-base font-medium">{formatDateTime(selectedBudget.endDate, true)}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Tạo lúc: {formatDateTime(selectedBudget.createdAt, true)}</span>
                                <span>Cập nhật: {formatDateTime(selectedBudget.updatedAt, true)}</span>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen((prev: IDialogFlags) => ({ ...prev, isDialogDetailBudgetOpen: false }))}
                        >
                            Đóng
                        </Button>
                        <Button
                            onClick={() => {
                                setIsDialogOpen((prev: IDialogFlags) => ({
                                    ...prev,
                                    isDialogDetailBudgetOpen: false,
                                    isDialogEditBudgetOpen: true,
                                }))
                            }}
                        >
                            Chỉnh sửa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Budget Dialog */}
            <Dialog
                open={isDialogOpen.isDialogDeleteBudgetOpen}
                onOpenChange={(open) => setIsDialogOpen((prev: IDialogFlags) => ({ ...prev, isDialogDeleteBudgetOpen: open }))}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Xóa ngân sách</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa ngân sách này? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedBudget && (
                        <div className="py-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium">{selectedBudget.category}</h3>
                                        <Badge>{formatCurrency(selectedBudget.budgetAmount, "đ", "vi-vn")}</Badge>
                                    </div>
                                    <div className="mt-2 flex justify-between text-sm">
                                        <span className="text-muted-foreground">Đã chi tiêu: </span>
                                        <span>{formatCurrency(selectedBudget.spentAmount, "đ", "vi-vn")}</span>
                                    </div>
                                    <div className="mt-1 flex justify-between text-sm">
                                        <span className="text-muted-foreground">Còn lại: </span>
                                        <span className={selectedBudget.remainingAmount < 0 ? "text-red-500" : ""}>
                                            {formatCurrency(selectedBudget.remainingAmount, "đ", "vi-vn")}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen((prev: IDialogFlags) => ({ ...prev, isDialogDeleteBudgetOpen: false }))}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedBudget && handleDeleteBudget(selectedBudget.id)}
                            disabled={isLoading}
                            isLoading={isLoading}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default SpendingPlanDialog

