import {
    ISpendingPlan,
    ISpendingPlanTable,
    GenericTypeSpendingPlan,
    ICreateFundSavingPlanRequest,
    IUpdateFundSavingPlanRequest,
} from "@/core/fund-saving-plan/models"
import {
    ICreateFundSavingTargetRequest,
    IUpdateFundSavingTargetRequest,
    IBudgetTarget,
} from "@/core/fund-saving-target/models"
import { formatCurrency, formatDateTimeVN } from "@/libraries/utils"
import toast from "react-hot-toast"

// Modify spending plan data for table display
export const modifySpendingPlanTableData = (data: ISpendingPlan[]): ISpendingPlanTable[] => {
    return data.map((item) => ({
        id: item.id || 'N/A',
        fundId: item.fundId || 'N/A',
        trackerTypeId: item.trackerTypeId || 'N/A',
        name: item.name || 'N/A',
        description: item.description || 'N/A',
        targetAmount: item.targetAmount || 0,
        expectedDate: item.expectedDate || 'N/A',
        type: item.type || 'ANNUAL',
        fundName: item.fundName || 'N/A',
        trackerTypeName: item.trackerTypeName || 'N/A',
        remainingDays: item.expectedDate ?
            Math.max(0, Math.ceil((new Date(item.expectedDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) :
            null,
        expiredDate: item.expectedDate ?
            Math.max(0, Math.ceil((new Date(item.expectedDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) + ' days' :
            'N/A',
    }))
}


export const modifyTargetTableData = (targets: IBudgetTarget[]): IBudgetTarget[] => {
    return targets.map(target => ({
        id: target.id || 'N/A',
        name: target.name || 'N/A',
        targetAmount: Number(target.targetAmount) || 0,
        currentAmount: Number(target.currentAmount) || 0,
        startDate: target.startDate ? formatDateTimeVN(target.startDate, true) : 'N/A',
        endDate: target.endDate ? formatDateTimeVN(target.endDate, true) : 'N/A',
        status: target.status || 'N/A',
        fundId: target.fundId || 'N/A',
        description: target.description || 'N/A',
        trackerTypeId: target.trackerTypeId || 'N/A',
        fundName: target.fundName || 'N/A',
        trackerTypeName: target.trackerTypeName || 'N/A',
        remain: target.targetAmount > 0 ? (target.targetAmount - target.currentAmount) : 0,
        progress: target.targetAmount > 0 ? (target.currentAmount / target.targetAmount) * 100 : 0,
        remainingDays: target.endDate ? Math.max(0, Math.ceil((new Date(target.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))).toString() : '0',
        averageDailyPercentage: target.targetAmount > 0 && target.endDate && target.startDate
            ? ((target.currentAmount / target.targetAmount) / Math.max(1, Math.ceil((new Date(target.endDate).getTime() - new Date(target.startDate).getTime()) / (1000 * 60 * 60 * 24)))) * 100
            : 0,
    }))
}

// Calculate target totals
export const calculateTargetTotals = (targets: IBudgetTarget[]) => {
    const totalTargetAmount = targets.reduce((acc, target) => acc + target.targetAmount, 0)
    const totalSpentAmount = targets.reduce((acc, target) => acc + target.currentAmount, 0)
    const remainingTarget = totalTargetAmount - totalSpentAmount
    const spendingProgress = totalTargetAmount > 0 ? (totalSpentAmount / totalTargetAmount) * 100 : 0

    return {
        totalTargetAmount,
        totalSpentAmount,
        remainingTarget,
        spendingProgress
    }
}

// Handle creating a spending plan
export const handleCreateSpendingPlan = async ({
    data,
    hookCreate,
    setIsDialogOpen,
    callBackRefetchAPI,
    setDataTableConfig,
}: GenericTypeSpendingPlan<ICreateFundSavingPlanRequest>) => {
    hookCreate(data, {
        onSuccess: (res: any) => {
            if (res.statusCode === 200 || res.statusCode === 201) {
                callBackRefetchAPI(["getAllSpendingPlans"])
                setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
                setIsDialogOpen((prev) => ({ ...prev, isDialogCreatePlanOpen: false }))
                toast.success("Spending plan created successfully!")
            }
            if (res.statusCode === 409) {
                toast.error(res.message)
            }
        },
    })
}

// Handle updating a spending plan
export const handleUpdateSpendingPlan = async ({
    data,
    hookUpdate,
    setIsDialogOpen,
    callBackRefetchAPI,
    setDataTableConfig,
}: GenericTypeSpendingPlan<IUpdateFundSavingPlanRequest>
) => {
    hookUpdate(data, {
        onSuccess: (res: any) => {
            if (res.statusCode === 200 || res.statusCode === 201) {
                callBackRefetchAPI(["getAllSpendingPlans"])
                setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
                setIsDialogOpen((prev) => ({ ...prev, isDialogEditPlanOpen: false }))
                toast.success("Spending plan updated successfully!")
            }
        },
    })
}

// Handle creating a target
export const handleCreateTarget = async ({
    data,
    hookCreate,
    setIsDialogOpen,
    callBackRefetchAPI,
    setDataTableConfig,
}: GenericTypeSpendingPlan<ICreateFundSavingTargetRequest>
) => {
    hookCreate(data, {
        onSuccess: (res: any) => {
            if (res.statusCode === 200 || res.statusCode === 201) {
                callBackRefetchAPI(["getAllTargets"])
                setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
                setIsDialogOpen((prev) => ({ ...prev, isDialogCreateTargetOpen: false }))
                toast.success("Target created successfully!")
            }
        },
    })
}

// Handle updating a target
export const handleUpdateTarget = async ({
    data,
    hookUpdate,
    setIsDialogOpen,
    callBackRefetchAPI,
    setDataTableConfig,
}: GenericTypeSpendingPlan<IUpdateFundSavingTargetRequest>
) => {
    hookUpdate(data, {
        onSuccess: (res: any) => {
            if (res.statusCode === 200 || res.statusCode === 201) {
                callBackRefetchAPI(["getAllTargets"])
                setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
                setIsDialogOpen((prev) => ({ ...prev, isDialogEditTargetOpen: false }))
                toast.success("Target updated successfully!")
            }
        },
    })
}

export const handleDeleteItem = async ({
    data,
    hookDelete,
    setIsDialogOpen,
    callBackRefetchAPI,
    setDataTableConfig,
}: GenericTypeSpendingPlan<{ id: string }>) => {
    hookDelete(data, {
        onSuccess: (res: any) => {
            if (res.statusCode === 200 || res.statusCode === 201) {
                callBackRefetchAPI(["getAllSpendingPlans", "getAllTargets"])
                setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
                setIsDialogOpen((prev) => ({ ...prev, isDialogDeletePlanOpen: false }))
                toast.success("Item deleted successfully!")
            }
        },
    })
}

export const handleRestoreSpendingPlan = async ({
    data,
    hookRestore,
    callBackRefetchAPI,
    setDataTableConfig,
}: GenericTypeSpendingPlan<{ id: string }>) => {
    hookRestore(data, {
        onSuccess: (res: any) => {
            if (res.statusCode === 200 || res.statusCode === 201) {
                callBackRefetchAPI(["getAllSpendingPlans"])
                setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
                toast.success("Spending plan restored successfully!")
            }
        },
    })
}

export const handleRestoreTarget = async ({
    data,
    hookRestore,
    callBackRefetchAPI,
    setDataTableConfig,
}: GenericTypeSpendingPlan<{ id: string }>) => {
    hookRestore(data, {
        onSuccess: (res: any) => {
            if (res.statusCode === 200 || res.statusCode === 201) {
                callBackRefetchAPI(["getAllTargets"])
                setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
                toast.success("Target restored successfully!")
            }
        },
    })
}

export const handleUpdateSpendingPlanStatus = async ({
    data,
    hookUpdateStatus,
    callBackRefetchAPI,
    setDataTableConfig,
}: GenericTypeSpendingPlan<{ id: string, status: string }>
) => {
    hookUpdateStatus(data, {
        onSuccess: (res: any) => {
            if (res.statusCode === 200 || res.statusCode === 201) {
                callBackRefetchAPI(["getAllSpendingPlans"])
                setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
                toast.success("Spending plan status updated successfully!")
            }
        },
    })
}

export const handleUpdateTargetStatus = async ({
    data,
    hookUpdateStatus,
    callBackRefetchAPI,
    setDataTableConfig,
}: GenericTypeSpendingPlan<{ id: string, status: string }>) => {
    hookUpdateStatus(data, {
        onSuccess: (res: any) => {
            if (res.statusCode === 200 || res.statusCode === 201) {
                callBackRefetchAPI(["getAllTargets"])
                setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
                toast.success("Target status updated successfully!")
            }
        },
    })
}
