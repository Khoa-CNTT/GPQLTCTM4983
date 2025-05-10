import { IGetAllDataFundSavingTarget, IDialogFlags, IPagination } from '@/core/fund-saving-target/models'
import { IDataTableConfig } from '@/types/common.i'
import { Dispatch, SetStateAction } from 'react'
import { IExpectedDateParams } from '.'
export interface ISpendingPlan {
  id: string
  fundId: string
  trackerTypeId: string
  name: string
  description?: string | undefined
  targetAmount: number
  expectedDate: string
  type: 'ANNUAL' | 'MONTHLY' | 'WEEKLY' | 'DAILY'
  fundName: string
  trackerTypeName: string
  remainingDays: { day: number; month: number; year: number }
  expiredDate: { day: number; month: number; year: number }
  expectedDateParams: IExpectedDateParams
}

export interface IGetAllFundSavingPlanResponse {
  pagination: IPagination
  data: ISpendingPlan[]
  statusCode: number
}

export interface ICreateFundSavingPlanRequest extends IExpectedDateParams {
  name?: string
  description?: string
  targetAmount: number
  fundId: string
  day: number
  type: 'ANNUAL' | 'MONTHLY' | 'WEEKLY' | 'DAILY'
  trackerTypeId?: string
}

export interface IUpdateFundSavingPlanRequest extends IExpectedDateParams {
  id?: string
  name?: string
  description?: string
  targetAmount?: number
  trackerTypeId?: number
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
  | 'getStatisticOverviewPage'

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
