"use client"
import React, { useRef } from "react"
import { Button } from "@/components/ui/button"
import { IBudgetTarget, IUpdateFundSavingTargetRequest } from "@/core/fund-saving-target/models"
import FormZod from "@/components/core/FormZod"
import {
    updateFundSavingTargetSchema,
    defineUpdateFundSavingTargetFormBody
} from "@/core/fund-saving-target/constants/update-fund-saving-target.constant"
import { useTranslation } from "react-i18next"

interface EditBudgetFormProps {
    selectedBudget: IBudgetTarget | null
    onClose: () => void
    onUpdateBudget: (updatedBudget: IUpdateFundSavingTargetRequest) => void
    isLoading: boolean
    isOpen: boolean
}

const EditBudgetForm: React.FC<EditBudgetFormProps> = ({ selectedBudget, onClose, onUpdateBudget, isLoading }) => {
    const { t } = useTranslation(['common', 'spendingPlan']);
    const formSubmitRef = useRef<HTMLFormElement>(null)

    const handleUpdateBudget = (data: any) => {
        if (!selectedBudget) return

        onUpdateBudget({
            id: selectedBudget.id,
            name: data.name,
            description: data.description,
            targetAmount: parseFloat(data.targetAmount),
            startDate: data.startDate.toISOString(),
            endDate: data.endDate.toISOString(),
        })
        onClose()
    }

    const defaultValues = {
        id: selectedBudget?.id || '',
        name: selectedBudget?.name || '',
        description: selectedBudget?.description || '',
        targetAmount: selectedBudget?.targetAmount?.toString() || '0',
        startDate: selectedBudget?.startDate ? new Date(selectedBudget.startDate) : new Date(),
        endDate: selectedBudget?.endDate ? new Date(selectedBudget.endDate) : new Date(),
    }

    return (
        <div className="py-4">
            <FormZod
                formSchema={updateFundSavingTargetSchema as any}
                formFieldBody={defineUpdateFundSavingTargetFormBody()}
                onSubmit={handleUpdateBudget}
                submitRef={formSubmitRef}
                defaultValues={defaultValues}
                classNameForm="grid grid-cols-2 gap-x-4 gap-y-2"
            />

            <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={onClose}>
                    {t('common:button.cancel')}
                </Button>
                <Button
                    onClick={() => formSubmitRef.current?.requestSubmit()}
                    disabled={isLoading}
                >
                    {isLoading ? t('spendingPlan:form.updating') : t('common:button.update')}
                </Button>
            </div>
        </div>
    )
}

export default EditBudgetForm
