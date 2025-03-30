"use client"
import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/libraries/utils"
import { IBudget } from "@/core/spending-plan/models"
import { categories } from "../../../app/dashboard/spending-plan/constants"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface CreateBudgetFormProps {
    onCreateBudget: (newBudget: IBudget) => void
    onClose: () => void
    isLoading: boolean
    isOpen: boolean;
}

const CreateBudgetForm: React.FC<CreateBudgetFormProps> = ({ onCreateBudget, onClose, isLoading }) => {
    const [category, setCategory] = useState<string>("")
    const [amount, setAmount] = useState<string>("")
    const [budgetStartDate, setBudgetStartDate] = useState<Date | undefined>(new Date())
    const [budgetEndDate, setBudgetEndDate] = useState<Date | undefined>(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    )

    const handleCreate = () => {
        if (!category || !amount || !budgetStartDate || !budgetEndDate) return
        onCreateBudget({
            id: Date.now().toString(),
            category,
            budgetAmount: parseFloat(amount),
            spentAmount: 0,
            remainingAmount: parseFloat(amount),
            startDate: budgetStartDate.toISOString(),
            endDate: budgetEndDate.toISOString(),
            status: "active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })
        onClose()
    }

    return (
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="budget-category">Danh mục</Label>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="budget-category">
                        <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
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
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
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
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                    Hủy
                </Button>
                <Button onClick={handleCreate} disabled={isLoading} isLoading={isLoading}>
                    Tạo ngân sách
                </Button>
            </div>
        </div>
    )
}

export default CreateBudgetForm