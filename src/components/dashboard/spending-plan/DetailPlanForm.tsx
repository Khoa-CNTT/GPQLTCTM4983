"use client"
import React from "react"
import { formatCurrency, formatDateTimeVN } from "@/libraries/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, CalendarDays, CircleDollarSign, Repeat, Trash } from "lucide-react"
import { IDialogFlags } from "@/core/fund-saving-target/models/fund-saving-target.interface"
import { useTranslation } from "react-i18next"
import { ISpendingPlan } from "@/core/fund-saving-plan/models"

interface DetailPlanFormProps {
    selectedPlan: ISpendingPlan | null;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogFlags>>;
}

const DetailPlanForm: React.FC<DetailPlanFormProps> = ({
    selectedPlan,
    setIsDialogOpen
}) => {
    const { t } = useTranslation(['common', 'spendingPlan']);

    if (!selectedPlan) return null;

    const frequencyBadgeClass =
        selectedPlan.type === "DAILY" ? "bg-purple-500" :
        selectedPlan.type === "WEEKLY" ? "bg-blue-500" :
        selectedPlan.type === "MONTHLY" ? "bg-emerald-500" : "bg-amber-500";

    const frequencyLabel =
        selectedPlan.type === "DAILY" ? t('spendingPlan:frequency.daily') :
        selectedPlan.type === "WEEKLY" ? t('spendingPlan:frequency.weekly') :
        selectedPlan.type === "MONTHLY" ? t('spendingPlan:frequency.monthly') :
        t('spendingPlan:frequency.annual');

    return (
        <div className="space-y-4">
            <div className="p-4 rounded-lg border bg-muted/30">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">{t('spendingPlan:planDetails.title')}</h4>
                        <p className="text-base font-medium">{selectedPlan.name}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">{t('spendingPlan:planDetails.category')}</h4>
                        <div className="flex items-center">
                            <CircleDollarSign className="h-4 w-4 text-emerald-500 mr-1.5" />
                            <p className="text-base font-medium">{selectedPlan.trackerTypeName || t('spendingPlan:targetDetails.uncategorized')}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <h4 className="text-sm font-medium text-muted-foreground">{t('spendingPlan:planDetails.description')}</h4>
                    <p className="text-base">{selectedPlan.description || t('spendingPlan:planDetails.noDescription')}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">{t('spendingPlan:planDetails.amount')}</h4>
                        <p className="text-base font-medium text-emerald-600">{formatCurrency(selectedPlan.targetAmount)}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">{t('spendingPlan:planDetails.expectedDate')}</h4>
                        <div className="flex items-center">
                            <CalendarDays className="h-4 w-4 text-blue-500 mr-1.5" />
                            <p className="text-base font-medium">{formatDateTimeVN(selectedPlan.expectedDate, true)}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">{t('spendingPlan:planDetails.frequency')}</h4>
                        <Badge className={frequencyBadgeClass}>
                            <Repeat className="h-3.5 w-3.5 mr-1.5" />
                            {frequencyLabel}
                        </Badge>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">{t('spendingPlan:planDetails.daysLeft')}</h4>
                        <p className="text-base font-medium">
                            {selectedPlan.remainingDays !== null
                                ? t('spendingPlan:planDetails.daysRemaining', { count: selectedPlan.remainingDays })
                                : t('spendingPlan:planDetails.undetermined')}
                        </p>
                    </div>
                </div>

                {selectedPlan.fundName && (
                    <div className="mt-4">
                        <h4 className="text-sm font-medium text-muted-foreground">{t('spendingPlan:planDetails.fundSource')}</h4>
                        <p className="text-base font-medium">{selectedPlan.fundName}</p>
                    </div>
                )}
            </div>

            <Separator />

            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                    <CalendarClock className="h-4 w-4 mr-1.5" />
                    <span>{t('spendingPlan:planDetails.expirationDate')}: {formatDateTimeVN(selectedPlan.expiredDate, true)}</span>
                </div>
            </div>

            <div className="flex justify-end gap-2 sm:gap-0">
                <Button variant="outline" onClick={
                    () => setIsDialogOpen(prev => ({
                        ...prev,
                        isDialogDetailPlanOpen: false
                    }))
                }
                    className="mr-2">
                    {t('common:button.close')}
                </Button>
                <Button variant="destructive"
                    className="mr-2"
                    onClick={() => {
                        setIsDialogOpen(prev => ({
                            ...prev,
                            isDialogDeletePlanOpen: true,
                            isDialogDetailPlanOpen: false
                        }))
                    }}
                >
                    <Trash className="h-4 w-4 mr-1.5" />
                    {t('common:button.delete')}
                </Button>
                <Button onClick={
                    () => setIsDialogOpen(prev => ({
                        ...prev,
                        isDialogEditPlanOpen: true,
                        isDialogDetailPlanOpen: false
                    }))
                }>
                    {t('common:button.edit')}
                </Button>
            </div>
        </div>
    )
}

export default DetailPlanForm
