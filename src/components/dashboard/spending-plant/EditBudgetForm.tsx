"use client"
import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn, formatCurrency } from "@/libraries/utils"
import { categories } from "../../../app/dashboard/spending-plan/constants"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { IBudget } from "@/core/fund-saving-target/models"

interface EditBudgetFormProps {
    selectedBudget: IBudget | null
    onClose: () => void
    onUpdateBudget: (updatedBudget: IBudget) => void
    isLoading: boolean
    isOpen: boolean
}

const EditBudgetForm: React.FC<EditBudgetFormProps> = ({ selectedBudget, onClose, onUpdateBudget, isLoading }) => {
    const [budgetCategory, setBudgetCategory] = useState<string>("")
    const [budgetAmount, setBudgetAmount] = useState<string>("")
    const [budgetStartDate, setBudgetStartDate] = useState<Date | undefined>(new Date())
    const [budgetEndDate, setBudgetEndDate] = useState<Date | undefined>(new Date())

    useEffect(() => {
        if (selectedBudget) {
            setBudgetCategory(selectedBudget.category)
            setBudgetAmount(selectedBudget.budgetAmount.toString())
            setBudgetStartDate(new Date(selectedBudget.startDate))
            setBudgetEndDate(new Date(selectedBudget.endDate))
        }
    }, [selectedBudget])

    const handleUpdateBudget = () => {
        if (!selectedBudget || !budgetCategory || !budgetAmount || !budgetStartDate || !budgetEndDate) return
        const updatedBudgetAmount = parseFloat(budgetAmount)
        const remainingAmount = updatedBudgetAmount - selectedBudget.spentAmount
        const status = remainingAmount < 0 ? "exceeded" : "active"

        onUpdateBudget({
            ...selectedBudget,
            category: budgetCategory,
            budgetAmount: updatedBudgetAmount,
            remainingAmount,
            startDate: budgetStartDate.toISOString(),
            endDate: budgetEndDate.toISOString(),
            status,
            updatedAt: new Date().toISOString(),
        })
        onClose()
    }

    return (
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="edit-budget-category">Danh mục</Label>
                <Select value={budgetCategory} onValueChange={setBudgetCategory}>
                    <SelectTrigger id="edit-budget-category">
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
                                        !budgetStartDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {budgetStartDate
                                        ? format(budgetStartDate, "PPP", { locale: vi })
                                        : <span>Chọn ngày</span>}
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
                                        !budgetEndDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {budgetEndDate
                                        ? format(budgetEndDate, "PPP", { locale: vi })
                                        : <span>Chọn ngày</span>}
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
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                    Hủy
                </Button>
                <Button onClick={handleUpdateBudget} disabled={isLoading} isLoading={isLoading}>
                    Cập nhật
                </Button>
            </div>
        </div>
    )
}

export default EditBudgetForm