"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, CheckCircle2, Repeat, XCircle } from "lucide-react"
import { formatCurrency, formatDateTimeVN } from "@/libraries/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "react-i18next"
import { ISpendingPlan } from "@/core/fund-saving-plan/models"

interface ChangeStatusPlanFormProps {
    selectedPlan: ISpendingPlan | null
    onClose: () => void
    onChangeStatus: (id: string, status: string) => void
    isLoading: boolean
}

const ChangeStatusPlanForm: React.FC<ChangeStatusPlanFormProps> = ({
    selectedPlan,
    onClose,
    onChangeStatus,
    isLoading
}) => {
    const { t } = useTranslation(['common', 'spendingPlan']);
    const [status, setStatus] = useState<string>("ACTIVE");

    const handleChangeStatus = () => {
        if (selectedPlan) {
            onChangeStatus(selectedPlan.id, status);
        }
        onClose();
    }

    if (!selectedPlan) {
        return (
            <div className="flex justify-center items-center p-6">
                <p className="text-muted-foreground">{t('spendingPlan:form.noPlanFound')}</p>
            </div>
        )
    }

    const getFrequencyLabel = (type: string) => {
        switch (type) {
            case "ANNUAL": return t('spendingPlan:frequency.annual');
            case "MONTHLY": return t('spendingPlan:frequency.monthly');
            case "WEEKLY": return t('spendingPlan:frequency.weekly');
            case "DAILY": return t('spendingPlan:frequency.daily');
            default: return t('spendingPlan:planDetails.undetermined');
        }
    }

    return (
        <div className="space-y-4">
            <div className="py-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium">{selectedPlan.name}</h3>
                            <Badge variant="outline">{selectedPlan.trackerTypeName || t('spendingPlan:targetDetails.uncategorized')}</Badge>
                        </div>

                        <div className="mt-2 flex justify-between text-sm">
                            <span className="text-muted-foreground">{t('spendingPlan:planDetails.amount')}: </span>
                            <span className="font-medium text-emerald-600">{formatCurrency(selectedPlan.targetAmount)}</span>
                        </div>

                        <div className="mt-1 flex justify-between text-sm">
                            <span className="text-muted-foreground">{t('spendingPlan:planDetails.frequency')}: </span>
                            <Badge className={
                                selectedPlan.type === "DAILY" ? "bg-purple-500" :
                                selectedPlan.type === "WEEKLY" ? "bg-blue-500" :
                                selectedPlan.type === "MONTHLY" ? "bg-emerald-500" : "bg-amber-500"
                            }>
                                <Repeat className="h-3.5 w-3.5 mr-1.5" />
                                {getFrequencyLabel(selectedPlan.type)}
                            </Badge>
                        </div>

                        <div className="mt-4">
                            <span className="text-sm text-muted-foreground">{t('spendingPlan:planDetails.expectedDate')}: </span>
                            <p className="flex items-center mt-1">
                                <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                                {formatDateTimeVN(selectedPlan.expectedDate, true)}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-3">
                <h3 className="font-medium">{t('spendingPlan:form.selectNewStatus')}</h3>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('spendingPlan:form.selectStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ACTIVE">{t('spendingPlan:form.statusActive')}</SelectItem>
                        <SelectItem value="CANCELLED">{t('spendingPlan:form.statusCancelled')}</SelectItem>
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
                    disabled={isLoading}
                    isLoading={isLoading}
                >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {t('spendingPlan:form.updateStatus')}
                </Button>
            </div>
        </div>
    )
}

export default ChangeStatusPlanForm
