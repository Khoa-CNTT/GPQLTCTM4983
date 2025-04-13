"use client"
import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import FormZod from "@/components/core/FormZod"
import { useTranslation } from "react-i18next"
import { defineEditFundSavingPlanFormBody, editFundSavingPlanSchema } from "@/core/fund-saving-plan/constants/edit-fund-saving-plan.constant"
import { ISpendingPlan, IUpdateFundSavingPlanRequest, RecurringFrequency } from "@/core/fund-saving-plan/models"

interface EditPlanFormProps {
    selectedPlan: ISpendingPlan | null
    onClose: () => void
    onUpdatePlan: (updatedPlan: IUpdateFundSavingPlanRequest) => void
    isLoading: boolean
    isOpen: boolean;
}

const EditPlanForm: React.FC<EditPlanFormProps> = ({ selectedPlan, onClose, onUpdatePlan, isLoading, isOpen }) => {
    const { t } = useTranslation(['common', 'spendingPlan']);
    const formSubmitRef = useRef<HTMLFormElement>(null)
    const formRef = useRef<any>(null)
    const [key, setKey] = useState(0); // Force re-render with key change

    // Force re-render the form when selectedPlan changes
    useEffect(() => {
        if (isOpen && selectedPlan) {
            setKey(prev => prev + 1);
        }
    }, [isOpen, selectedPlan]);

    // Reset form values when selectedPlan changes
    useEffect(() => {
        if (isOpen && formRef.current && selectedPlan) {
            const dateValue = new Date(selectedPlan.expectedDate);
            formRef.current.reset({
                name: selectedPlan.name || "",
                description: selectedPlan.description || "",
                targetAmount: selectedPlan.targetAmount?.toString() || "0",
                startDate: dateValue,
                type: (selectedPlan.type as RecurringFrequency) || "MONTHLY"
            });
        }
    }, [isOpen, selectedPlan, key]);

    const handleUpdatePlan = (data: any) => {
        if (!selectedPlan) return;

        onUpdatePlan({
            id: selectedPlan.id,
            name: data.name,
            description: data.description,
            targetAmount: parseFloat(data.targetAmount.replace(/[^\d.-]/g, '')),
            startDate: new Date(data.startDate).toISOString().split('T')[0],
            type: data.type as RecurringFrequency
        });
    }

    // We'll use this for initial render, but subsequent updates will use reset() directly
    const defaultValues = selectedPlan ? {
        name: selectedPlan.name || "",
        description: selectedPlan.description || "",
        targetAmount: selectedPlan.targetAmount?.toString() || "0",
        startDate: new Date(selectedPlan.expectedDate),
        type: (selectedPlan.type as RecurringFrequency) || "MONTHLY"
    } : {
        name: "",
        description: "",
        targetAmount: "0",
        startDate: new Date(),
        type: "MONTHLY" as RecurringFrequency
    };

    return (
        <div className="space-y-4 py-2 pb-4" key={key}>
            <FormZod
                formSchema={editFundSavingPlanSchema}
                formFieldBody={defineEditFundSavingPlanFormBody()}
                onSubmit={handleUpdatePlan}
                submitRef={formSubmitRef}
                formRef={formRef}
                defaultValues={defaultValues}
                classNameForm="grid grid-cols-2 gap-x-4 gap-y-0"
            />

            <div className="pt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                    {t('common:button.cancel')}
                </Button>
                <Button
                    onClick={() => formSubmitRef.current?.requestSubmit()}
                    disabled={isLoading}
                    isLoading={isLoading}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                >
                    {t('spendingPlan:form.updatePlan')}
                </Button>
            </div>
        </div>
    )
}

export default EditPlanForm
