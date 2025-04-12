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
            // Simplified mode
            onCreateBudget({
                targetAmount: parseFloat(data.targetAmount),
                fundId: data.fundId || fundId || "",
                isCreateNormally: false,
                // These fields are required by the interface but will be ignored by the backend
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
            <Tabs defaultValue="normal" className="w-full mb-6" onValueChange={(val) => setMode(val as "normal" | "simplified")}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="normal">Tùy chỉnh</TabsTrigger>
                    <TabsTrigger value="simplified">Tổng ngân sách</TabsTrigger>
                </TabsList>
                <TabsContent value="normal">
                    <div className="mt-4 text-sm text-muted-foreground mb-4">
                        Tạo mục tiêu tiết kiệm tùy chỉnh với đầy đủ thông tin chi tiết.
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
                        Tạo tổng ngân sách với thông tin tối giản, hệ thống sẽ tự động điền các thông tin còn lại.
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
                    Hủy
                </Button>
                <Button
                    onClick={() => formSubmitRef.current?.requestSubmit()}
                    disabled={isLoading}
                    isLoading={isLoading}
                >
                    {mode === "normal" ? "Tạo mục tiêu" : "Tạo tổng ngân sách"}
                </Button>
            </div>
        </div>
    )
}

export default CreateBudgetForm
