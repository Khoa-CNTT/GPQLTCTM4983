"use client"
import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/libraries/utils"
import { ISpendingPlan } from "@/core/spending-plan/models"
import { categories, accountSources, notifyOptions } from "../../../app/dashboard/spending-plan/constants"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface EditPlanFormProps {
    selectedPlan: ISpendingPlan | null
    onClose: () => void
    onUpdatePlan: (updatedPlan: ISpendingPlan) => void
    isLoading: boolean
    isOpen: boolean;
}

const EditPlanForm: React.FC<EditPlanFormProps> = ({ selectedPlan, onClose, onUpdatePlan, isLoading }) => {
    const [planTitle, setPlanTitle] = useState<string>("")
    const [planDescription, setPlanDescription] = useState<string>("")
    const [planAmount, setPlanAmount] = useState<string>("")
    const [planDate, setPlanDate] = useState<Date | undefined>(new Date())
    const [planCategory, setPlanCategory] = useState<string>("")
    const [planNotifyBefore, setPlanNotifyBefore] = useState<number>(1)
    const [planAccountSourceId, setPlanAccountSourceId] = useState<string>("")
    const [planStatus, setPlanStatus] = useState<"pending" | "completed" | "cancelled">("pending")

    useEffect(() => {
        if (selectedPlan) {
            setPlanTitle(selectedPlan.title)
            setPlanDescription(selectedPlan.description)
            setPlanAmount(selectedPlan.amount.toString())
            setPlanDate(new Date(selectedPlan.plannedDate))
            setPlanCategory(selectedPlan.category)
            setPlanNotifyBefore(selectedPlan.notifyBefore)
            setPlanAccountSourceId(selectedPlan.accountSourceId || "")
            setPlanStatus(selectedPlan.status)
        }
    }, [selectedPlan])

    const handleAccountSourceChange = (value: string) => {
        setPlanAccountSourceId(value)
    }

    const handleUpdatePlan = () => {
        if (!selectedPlan || !planTitle || !planAmount || !planDate || !planCategory) return
        onUpdatePlan({
            ...selectedPlan,
            title: planTitle,
            description: planDescription,
            amount: parseFloat(planAmount),
            plannedDate: planDate.toISOString(),
            category: planCategory,
            notifyBefore: planNotifyBefore,
            accountSourceId: planAccountSourceId,
            accountSourceName: accountSources.find((source) => source.id === planAccountSourceId)?.name || "",
            status: planStatus,
            updatedAt: new Date().toISOString(),
        })
        onClose()
    }

    return (
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
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                    Hủy
                </Button>
                <Button onClick={handleUpdatePlan} disabled={isLoading} isLoading={isLoading}>
                    Cập nhật
                </Button>
            </div>
        </div>
    )
}

export default EditPlanForm