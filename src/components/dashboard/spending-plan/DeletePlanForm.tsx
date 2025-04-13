"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import { formatCurrency, formatDateTimeVN } from "@/libraries/utils"
import { useTranslation } from "react-i18next"
import { ISpendingPlan } from "@/core/fund-saving-plan/models"

interface DeletePlanFormProps {
    selectedPlan: ISpendingPlan | null
    onClose: () => void
    onDeletePlan: (plan: string) => void
    isLoading: boolean
}

const DeletePlanForm: React.FC<DeletePlanFormProps> = ({ selectedPlan, onClose, onDeletePlan, isLoading }) => {
    const { t } = useTranslation(['common', 'spendingPlan']);

    const handleDelete = () => {
        if (selectedPlan) {
            onDeletePlan(selectedPlan.id)
            onClose()
        }
    }

    return (
        <div className="space-y-4">
            {selectedPlan && (
                <div className="py-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">{selectedPlan.name}</h3>
                                <Badge>{formatCurrency(selectedPlan.targetAmount, "đ", "vi-vn")}</Badge>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">{selectedPlan.description}</p>
                            <div className="mt-2 text-sm">
                                <span className="text-muted-foreground">{t('spendingPlan:planDetails.expectedDate')}: </span>
                                {formatDateTimeVN(selectedPlan.expectedDate, true)}
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
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('common:button.delete')}
                </Button>
            </div>
        </div>
    )
}

export default DeletePlanForm
