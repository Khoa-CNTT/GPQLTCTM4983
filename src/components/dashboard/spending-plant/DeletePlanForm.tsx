"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import { formatCurrency, formatDateTimeVN } from "@/libraries/utils"
import { ISpendingPlan } from "@/core/fund-saving-plant/models"

interface DeletePlanFormProps {
    selectedPlan: ISpendingPlan | null
    onClose: () => void
    onDeletePlan: (plan: ISpendingPlan) => void
    isLoading: boolean
}

const DeletePlanForm: React.FC<DeletePlanFormProps> = ({ selectedPlan, onClose, onDeletePlan, isLoading }) => {
    const handleDelete = () => {
        if (selectedPlan) {
            onDeletePlan({ ...selectedPlan, status: "cancelled" })
        }
    }

    return (
        <div className="space-y-4">
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
                                {formatDateTimeVN(selectedPlan.plannedDate, true)}
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

export default DeletePlanForm