import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'

export interface ITotalBudgetTarget {
  id: string
  fundId: string
  name: string
  description: string | null
  targetAmount: number
  currentAmount: number
  startDate: string
  endDate: string
  status: 'ACTIVE' | 'INACTIVE'
  trackerTypeId: string | null
  fundName: string
  trackerTypeName: string | null
  remain: number
  progress: number
  remainingDays: string
  averageDailyPercentage: number
}

export interface IBudgetTarget {
  id: string
  fundId: string
  name: string
  description: string | null
  targetAmount: number
  currentAmount: number
  startDate: string
  endDate: string
  status: 'ACTIVE' | 'INACTIVE'
  trackerTypeId: string | null
  fundName: string
  trackerTypeName: string | null
  trackerTypeDirection: ETypeOfTrackerTransactionType
  remain: number
  progress: number
  remainingDays: number
  averageDailyPercentage: number
}

export interface IGetAllDataFundSavingTarget {
  pagination: IPagination
  data: IBudgetTarget[]
}

export interface IGetAllDataFundSavingTargetResponse {
  data: {
    spentAmount: number
    totalBudgetTarget: number
    remainAmount: number
    budgetTargets: IGetAllDataFundSavingTarget
  }
  statusCode: number
}

export interface IGetAllDataFundSavingTargetTable {
  name: string
  description: string | null
  targetAmount: number
  currentAmount: number
  startDate: string
  endDate: string
  status: 'ACTIVE' | 'INACTIVE'
  trackerTypeName: string | null
}

export interface IDialogFlags {
  isDialogCreatePlanOpen: boolean
  isDialogEditPlanOpen: boolean
  isDialogDetailPlanOpen: boolean
  isDialogDeletePlanOpen: boolean
  isDialogCreateTargetOpen: boolean
  isDialogEditTargetOpen: boolean
  isDialogDetailTargetOpen: boolean
  isDialogDeleteTargetOpen: boolean
  isDialogViewAllDataOpen: boolean
  isDialogViewAllPlansOpen: boolean
  isDialogChangeStatusTargetOpen: boolean
  isDialogChangeStatusPlanOpen: boolean
}

export interface GetColumnsProps<T> {
  headers: string[]
  isSort: boolean
  customRenderers?: {
    [key: string]: (row: T) => React.ReactNode
  }
}
export interface ICreateFundSavingTargetRequest {
  name: string
  description: string
  targetAmount: number
  fundId: string
  trackerTypeId: string
  startDate: string
  endDate: string
  isCreateNormally: boolean
}
export interface IFundSavingTargetResponse {
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

export interface IGetFundSavingTargettByIdParams {
  id: string
  enable?: boolean
  condition?: string | null
}

export interface IUpdateFundSavingTargetRequest {
  id: string
  name?: string
  description?: string
  targetAmount?: number
  startDate?: string
  endDate?: string
}

export interface IPagination {
  totalPage: number
  currentPage: number
  limit: number
  skip: number
}
