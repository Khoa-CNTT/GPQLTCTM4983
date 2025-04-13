"use client"
import React, { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import FormZod from "@/components/core/FormZod"
import { ICreateFundSavingTargetRequest } from "@/core/fund-saving-target/models"
import {
    createFundSavingTargetSchema,
    createSimplifiedBudgetSchema,
    defineCreateFundSavingTargetFormBody,
    defineCreateSimplifiedBudgetFormBody
} from "@/core/fund-saving-target/constants/create-fund-saving-target.constant"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    const [mode, setMode] = useState<"normal" | "simplified">("normal")
    const formSubmitRef = useRef<HTMLFormElement>(null)

    const handleCreateBudget = (data: any) => {
        if (mode === "normal") {
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
        } else {
            onCreateBudget({
                targetAmount: parseFloat(data.targetAmount),
                fundId: data.fundId || fundId || "",
                isCreateNormally: false,
                name: "",
                description: "",
                trackerTypeId: "",
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString()
            })
        }
        onClose()
    }

    const normalDefaultValues = {
        name: "",
        description: "",
        targetAmount: "",
        fundId: fundId || "",
        trackerTypeId: "",
        startDate: new Date(),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    }

    const simplifiedDefaultValues = {
        targetAmount: "",
        fundId: fundId || "",
    }

    return (
        <div className="py-4">
            <Tabs defaultValue="normal" className="w-full mb-6 flex-1" onValueChange={(val) => setMode(val as "normal" | "simplified")}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="normal">{t('spendingPlan:targetForm.createBudget.customTab')}</TabsTrigger>
                    <TabsTrigger value="simplified">{t('spendingPlan:targetForm.createBudget.totalBudgetTab')}</TabsTrigger>
                </TabsList>
                <TabsContent value="normal">
                    <div className="mt-4 text-sm text-muted-foreground mb-4">
                        {t('spendingPlan:targetForm.createBudget.customDescription')}
                    </div>
                    <FormZod
                        formSchema={createFundSavingTargetSchema as any}
                        formFieldBody={defineCreateFundSavingTargetFormBody()}
                        onSubmit={handleCreateBudget}
                        submitRef={formSubmitRef}
                        defaultValues={normalDefaultValues}
                        classNameForm="grid grid-cols-2 gap-x-4 gap-y-2"
                    />
                </TabsContent>
                <TabsContent value="simplified">
                    <div className="mt-4 text-sm text-muted-foreground mb-4">
                        {t('spendingPlan:targetForm.createBudget.totalDescription')}
                    </div>
                    <FormZod
                        formSchema={createSimplifiedBudgetSchema}
                        formFieldBody={defineCreateSimplifiedBudgetFormBody()}
                        onSubmit={handleCreateBudget}
                        submitRef={formSubmitRef}
                        defaultValues={simplifiedDefaultValues}
                        classNameForm="grid grid-cols-1 gap-y-2"
                    />
                </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 mt-6 pt-2 border-t">
                <Button variant="outline" onClick={onClose}>
                    {t('common:button.cancel')}
                </Button>
                <Button
                    onClick={() => formSubmitRef.current?.requestSubmit()}
                    disabled={isLoading}
                    isLoading={isLoading}
                >
                    {mode === "normal"
                        ? t('spendingPlan:targetForm.createBudget.createCustomBudget')
                        : t('spendingPlan:targetForm.createBudget.createTotalBudget')}
                </Button>
            </div>
        </div>
    )
}

export default CreateBudgetForm
