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

// Table data interface for SpendingPlan
export interface ISpendingPlanTable {
    id: string
    title: string
    amount: string | React.ReactNode
    plannedDate: string | React.ReactNode
    category: string
    status: React.ReactNode
}

// Budget models
export interface IBudget {
    id: string
    category: string
    budgetAmount: number
    spentAmount: number
    remainingAmount: number
    startDate: string
    endDate: string
    status: "active" | "completed" | "exceeded"
    createdAt: string
    updatedAt: string
}

// Table data interface for Budget
export interface IBudgetTable {
    id: string
    category: string
    budgetAmount: string | React.ReactNode
    spentAmount: string | React.ReactNode
    remainingAmount: string | React.ReactNode
    status: React.ReactNode
}

// Dialog flags interface
export interface IDialogFlags {
    isDialogCreatePlanOpen: boolean
    isDialogEditPlanOpen: boolean
    isDialogDetailPlanOpen: boolean
    isDialogDeletePlanOpen: boolean
    isDialogCreateBudgetOpen: boolean
    isDialogEditBudgetOpen: boolean
    isDialogDetailBudgetOpen: boolean
    isDialogDeleteBudgetOpen: boolean
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

// GetColumns props interface
export interface GetColumnsProps<T> {
    headers: string[]
    isSort: boolean
    customRenderers?: {
        [key: string]: (row: T) => React.ReactNode
    }
}

// Category statistics interface
export interface ICategoryStatistic {
    category: string
    totalSpent: number
    budgetAmount: number
    percentage: number
    transactions: number
}
