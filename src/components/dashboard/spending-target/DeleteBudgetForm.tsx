"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import { formatCurrency } from "@/libraries/utils"
import { IBudgetTarget } from "@/core/fund-saving-target/models"
import { useTranslation } from "react-i18next"

interface DeleteBudgetFormProps {
    selectedBudget: IBudgetTarget | null
    onClose: () => void
    onDeleteBudget: (id: string) => void
    isLoading: boolean
}

const DeleteBudgetForm: React.FC<DeleteBudgetFormProps> = ({ selectedBudget, onClose, onDeleteBudget, isLoading }) => {
    const { t } = useTranslation(['common', 'spendingPlan']);

    const handleDelete = () => {
        if (selectedBudget) {
            onDeleteBudget(selectedBudget.id)
        }
        onClose()
    }

    return (
        <div className="space-y-4">
            {selectedBudget && (
                <div className="py-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">{selectedBudget.name}</h3>
                                <Badge>{selectedBudget.fundName}</Badge>
                            </div>
                            <div className="mt-2 flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('spendingPlan:targetForm.deleteBudget.target')}: </span>
                                <span>{formatCurrency(selectedBudget.targetAmount, "đ", "vi-vn")}</span>
                            </div>
                            <div className="mt-1 flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('spendingPlan:targetForm.deleteBudget.current')}: </span>
                                <span>{formatCurrency(selectedBudget.currentAmount, "đ", "vi-vn")}</span>
                            </div>
                            <div className="mt-1 flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('spendingPlan:targetForm.deleteBudget.status')}: </span>
                                <span>{selectedBudget.status}</span>
                            </div>
                            {selectedBudget.description && (
                                <div className="mt-2">
                                    <span className="text-sm text-muted-foreground">{t('spendingPlan:targetForm.deleteBudget.description')}: </span>
                                    <p className="text-sm mt-1">{selectedBudget.description}</p>
                                </div>
                            )}
                            <div className="mt-2 flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('spendingPlan:targetForm.deleteBudget.period')}: </span>
                                <span>
                                    {new Date(selectedBudget.startDate).toLocaleDateString('vi-VN')} - {new Date(selectedBudget.endDate).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                    {t('common:button.cancel')}
                </Button>
                <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isLoading}
                    isLoading={isLoading}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('common:button.delete')}
                </Button>
            </div>
        </div>
    )
}

export default DeleteBudgetForm
