import { IGetAllDataFundSavingTarget, IDialogFlags, IPagination } from '@/core/fund-saving-target/models'
import { IDataTableConfig } from '@/types/common.i'
import { Dispatch, SetStateAction } from 'react'
export interface ISpendingPlan {
  id: string
  fundId: string
  trackerTypeId: string
  name: string
  description: string
  targetAmount: number
  expectedDate: string
  type: 'ANNUAL' | 'MONTHLY' | 'WEEKLY' | 'DAILY'
  fundName: string
  trackerTypeName: string
  remainingDays: number | null
  expiredDate: string
}

export interface IGetAllFundSavingPlanResponse {
  pagination: IPagination
  data: ISpendingPlan[]
  statusCode: number
}

export interface ICreateFundSavingPlanRequest {
  name?: string
  description?: string
  targetAmount: number
  fundId: string
  month: number
  day: number
  type: 'ANNUAL' | 'MONTHLY' | 'WEEKLY' | 'DAILY'
  trackerTypeId?: string
}

export interface IUpdateFundSavingPlanRequest {
  id?: string
  name?: string
  description?: string
  targetAmount?: number
  startDate?: string
  type: 'ANNUAL' | 'MONTHLY' | 'WEEKLY' | 'DAILY'
}

export interface IGetFundSavingPlanByIdParams {
  id: string
  enable?: boolean
  condition?: string | null
}

export interface ISpendingPlanTable {
  name?: string
  description?: string
  targetAmount: number
  trackerTypeId?: string
  expectedDate: string
  expiredDate: string
}

export type TSpendingPlanActions =
  | 'getAllSpendingPlans'
  | 'getAllTargets'
  | 'getExpenditureFund'
  | 'getAllTrackerTransactionType'

export type GenericTypeSpendingPlan<T> = {
  data: T
  hookUpdate?: any
  hookCreate?: any
  hookDelete?: any
  hookRestore?: any
  hookUpdateStatus?: any
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogFlags>>
  callBackRefetchAPI: (actions: TSpendingPlanActions[]) => void
  setDataTableConfig: Dispatch<SetStateAction<IDataTableConfig>>
}

export interface ISpendingPlanDialogProps {
  isDialogOpen: IDialogFlags
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogFlags>>
  selectedPlan: ISpendingPlan | null
  selectedBudget: IGetAllDataFundSavingTarget | null
  onCreatePlan: (plan: Omit<ISpendingPlan, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdatePlan: (plan: ISpendingPlan) => void
  onCreateBudget: (budget: Omit<IGetAllDataFundSavingTarget, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdateBudget: (budget: IGetAllDataFundSavingTarget) => void
  isLoading: boolean
  onDeleteBudget: (id: string) => void
}

export type RecurringFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL'
