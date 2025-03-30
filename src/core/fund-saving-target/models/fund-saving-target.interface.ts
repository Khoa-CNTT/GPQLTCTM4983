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

// GetColumns props interface
export interface GetColumnsProps<T> {
    headers: string[]
    isSort: boolean
    customRenderers?: {
        [key: string]: (row: T) => React.ReactNode
    }
}

// Fund Saving Target Request interface
export interface ICreateFundSavingTargetRequest {
    name: string
    description: string
    targetAmount: number
    fundId: string
    trackerTypeId: string
    startDate: string
    endDate: string
}

// Fund Saving Target Response interface
export interface IFundSavingTargetResponse {
    id: string
    name: string
    description: string
    targetAmount: number
    fundId: string
    trackerTypeId: string
    startDate: string
    endDate: string
    createdAt: string
    updatedAt: string
}

// Category statistics interface
export interface ICategoryStatistic {
    category: string
    totalSpent: number
    budgetAmount: number
    percentage: number
    transactions: number
}

export interface IGetFundSavingTargettByIdParams {
    targetId: string
    enable?: boolean
    condition?: string | null
}

export interface IUpdateFundSavingTargetParams {
    targetId: string;
    name?: string;
    description?: string;
    targetAmount?: number;
    startDate?: string;
    endDate?: string;
}