"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, XCircle } from "lucide-react"
import { formatCurrency } from "@/libraries/utils"
import { IBudgetTarget } from "@/core/fund-saving-target/models/fund-saving-target.interface"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "react-i18next"

interface ChangeStatusBudgetFormProps {
    selectedBudget: IBudgetTarget | null
    onClose: () => void
    onChangeStatus: (id: string, status: string) => void
    isLoading: boolean
}

const ChangeStatusBudgetForm: React.FC<ChangeStatusBudgetFormProps> = ({
    selectedBudget,
    onClose,
    onChangeStatus,
    isLoading
}) => {
    const { t } = useTranslation(['common', 'spendingPlan']);
    const [status, setStatus] = React.useState<string>(selectedBudget?.status || "ACTIVE")

    const handleChangeStatus = () => {
        if (selectedBudget) {
            onChangeStatus(selectedBudget.id, status)
        }
        onClose()
    }

    if (!selectedBudget) {
        return (
            <div className="flex justify-center items-center p-6">
                <p className="text-muted-foreground">{t('spendingPlan:targetForm.changeStatus.notFound')}</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="py-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium">{selectedBudget.name}</h3>
                            <Badge>{selectedBudget.fundName}</Badge>
                        </div>
                        <div className="mt-2 flex justify-between text-sm">
                            <span className="text-muted-foreground">{t('spendingPlan:targetForm.changeStatus.target')}: </span>
                            <span>{formatCurrency(selectedBudget.targetAmount)}</span>
                        </div>
                        <div className="mt-1 flex justify-between text-sm">
                            <span className="text-muted-foreground">{t('spendingPlan:targetForm.changeStatus.current')}: </span>
                            <span>{formatCurrency(selectedBudget.currentAmount)}</span>
                        </div>
                        <div className="mt-1 flex justify-between text-sm">
                            <span className="text-muted-foreground">{t('spendingPlan:targetForm.changeStatus.currentStatus')}: </span>
                            <Badge>
                                {selectedBudget.status}
                            </Badge>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-muted-foreground">{t('spendingPlan:targetForm.changeStatus.period')}: </span>
                            <p className="flex items-center mt-1">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                {new Date(selectedBudget.startDate).toLocaleDateString('vi-VN')} - {new Date(selectedBudget.endDate).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-3">
                <h3 className="font-medium">{t('spendingPlan:targetForm.changeStatus.selectNewStatus')}</h3>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('spendingPlan:targetForm.changeStatus.statusPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ACTIVE">{t('spendingPlan:targetForm.changeStatus.active')}</SelectItem>
                        <SelectItem value="CANCELLED">{t('spendingPlan:targetForm.changeStatus.cancelled')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={onClose}>
                    <XCircle className="mr-2 h-4 w-4" />
                    {t('common:button.cancel')}
                </Button>
                <Button
                    onClick={handleChangeStatus}
                    disabled={isLoading || status === selectedBudget.status}
                    isLoading={isLoading}
                >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {t('spendingPlan:targetForm.changeStatus.updateStatus')}
                </Button>
            </div>
        </div>
    )
}

export default ChangeStatusBudgetForm
