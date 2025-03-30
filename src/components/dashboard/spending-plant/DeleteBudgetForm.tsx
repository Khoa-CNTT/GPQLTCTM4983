"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import { IBudget } from "@/core/spending-plan/models"
import { formatCurrency } from "@/libraries/utils"

interface DeleteBudgetFormProps {
    selectedBudget: IBudget | null
    onClose: () => void
    onDeleteBudget: (id: string) => void
    isLoading: boolean
}

const DeleteBudgetForm: React.FC<DeleteBudgetFormProps> = ({ selectedBudget, onClose, onDeleteBudget, isLoading }) => {
    const handleDelete = () => {
        if (selectedBudget) {
            onDeleteBudget(selectedBudget.id)
        }
    }

    return (
        <div className="space-y-4">
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
            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                    Hủy
                </Button>
                <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isLoading}
                    isLoading={isLoading}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa
                </Button>
            </div>
        </div>
    )
}

export default DeleteBudgetForm