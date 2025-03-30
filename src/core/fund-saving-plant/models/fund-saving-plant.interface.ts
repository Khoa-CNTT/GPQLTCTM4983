import { IBudget, IDialogFlags } from "@/core/fund-saving-target/models"

// Spending Plan models
export interface ISpendingPlan {
    id: string
    title: string
    description: string
    amount: number
    plannedDate: string
    category: string
    status: "pending" | "completed" | "cancelled"
    notifyBefore: number
    accountSourceId?: string
    accountSourceName?: string
    createdAt: string
    updatedAt: string
}

// Main dialog props interface
export interface ISpendingPlanDialogProps {
    isDialogOpen: IDialogFlags
    setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogFlags>>
    selectedPlan: ISpendingPlan | null
    selectedBudget: IBudget | null
    onCreatePlan: (plan: Omit<ISpendingPlan, "id" | "createdAt" | "updatedAt">) => void
    onUpdatePlan: (plan: ISpendingPlan) => void
    onCreateBudget: (budget: Omit<IBudget, "id" | "createdAt" | "updatedAt">) => void
    onUpdateBudget: (budget: IBudget) => void
    isLoading: boolean
    onDeleteBudget: (id: string) => void
}

// Table data interface for SpendingPlan
export interface ISpendingPlanTable {
    id: string
    title: string
    amount: string | React.ReactNode
    plannedDate: string | React.ReactNode
    category: string
    status: React.ReactNode
}

export interface IGetAllFundSavingPlantResponse {
    data: ISpendingPlan[]
    total: number
    page: number
    limit: number
}

export interface ICreateFundSavingPlantRequest {
    name: string
    description: string
    targetAmount: number
    fundId: string
    startDate: string
    type: 'MONTHLY'
}

export interface IUpdateFundSavingPlantRequest {
    name: string
    description: string
    targetAmount: number
    startDate: string
    type: 'MONTHLY'
}

export interface IGetFundSavingPlantByIdParams {
    plantId: string
    enable?: boolean
    condition?: string | null
}

export interface IUpdateFundSavingPlantParams {
    plantId: string
    data: IUpdateFundSavingPlantRequest
}

export interface IUpdateFundSavingPlantStatusParams {
    plantId: string
}