"use client"
import React, { useRef } from "react"
import { Button } from "@/components/ui/button"
import FormZod from "@/components/core/FormZod"
import { ICreateFundSavingTargetRequest } from "@/core/fund-saving-target/models"
import {
    createFundSavingTargetSchema,
    defineCreateFundSavingTargetFormBody,
} from "@/core/fund-saving-target/constants/create-fund-saving-target.constant"
import { useTranslation } from "react-i18next"

interface CreateBudgetFormProps {
    onCreateBudget: (newBudget: ICreateFundSavingTargetRequest) => void
    onClose: () => void
    isLoading: boolean
    isOpen: boolean;
    fundId?: string; // Optional fundId that might be passed from parent
}

const CreateBudgetForm: React.FC<CreateBudgetFormProps> = ({
    onCreateBudget,
    onClose,
    isLoading,
    isOpen,
    fundId
}) => {
    const { t } = useTranslation(['common', 'spendingPlan']);
    const formSubmitRef = useRef<HTMLFormElement>(null)

    const handleCreateBudget = (data: any) => {
        onCreateBudget({
            name: data.name,
            description: data.description,
            targetAmount: parseFloat(data.targetAmount),
            fundId: data.fundId || fundId || "",
            trackerTypeId: data.trackerTypeId,
            startDate: data.startDate.toISOString(),
            endDate: data.endDate.toISOString(),
            isCreateNormally: true
        })
        onClose()
    }

    const defaultValues = {
        name: "",
        description: "",
        targetAmount: "",
        fundId: fundId || "",
        trackerTypeId: "",
        startDate: new Date(),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    }

    return (
        <div className="py-4">
            <div className="mb-4 text-sm text-muted-foreground">
                {t('spendingPlan:targetForm.createBudget.customDescription')}
            </div>

            <FormZod
                formSchema={createFundSavingTargetSchema as any}
                formFieldBody={defineCreateFundSavingTargetFormBody()}
                onSubmit={handleCreateBudget}
                submitRef={formSubmitRef}
                defaultValues={defaultValues}
                classNameForm="grid grid-cols-2 gap-x-4 gap-y-2"
            />

            <div className="flex justify-end gap-2 mt-6 pt-2 border-t">
                <Button variant="outline" onClick={onClose}>
                    {t('common:button.cancel')}
                </Button>
                <Button
                    onClick={() => formSubmitRef.current?.requestSubmit()}
                    disabled={isLoading}
                    isLoading={isLoading}
                >
                    {t('spendingPlan:targetForm.createBudget.createCustomBudget')}
                </Button>
            </div>
        </div>
    )
}

export default CreateBudgetForm
