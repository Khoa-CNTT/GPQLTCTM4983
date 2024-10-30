import { IChartData } from '@/components/core/charts/DonutChart'
import { IAccountSource } from '@/core/account-source/models'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import {
  IClassifyTransactionFormData,
  ICreateTrackerTransactionFormData,
  IDataTransactionTable
} from '@/core/transaction/models'
import { IBaseResponseData, IDataTableConfig } from '@/types/common.i'

export interface IDialogTrackerTransaction {
  isDialogCreateOpen: boolean
  isDialogUpdateOpen: boolean
  isDialogClassifyTransactionOpen: boolean
  isDialogUnclassifiedOpen: boolean
  isDialogCreateTrackerTxTypeOpen: boolean
}

export interface ITrackerTransaction {
  id: string
  trackerTypeId: string
  reasonName: string
  description: string | null
  userId: string
  transactionId: string | null
  Transaction: {
    id: string
    direction: string
    amount: number
    currency: string
    accountSource: {
      id: string
      name: string
      type: string
      currentAmount: number
    }
  }
  TrackerType: {
    id: string
    name: string
    type: string
    description: string
    ownerIds: string[]
  }
  time: string
}

export interface ICustomTrackerTransaction {
  id: string
  reasonName: string
  trackerTypeName: string
  type: string
  amount: string
  transactionDate: string
  accountSourceName: string
  checkType: string
}

export type ITrackerTransactionResponse = IBaseResponseData<ITrackerTransaction>
export type IAdvancedTrackerTransactionResponse = IBaseResponseData<ITrackerTransaction[]>

export interface ITrackerTransactionDataFormat {
  id: string
  transactionName: string
  type: string
  amount: string
  fromAccount: string
  description?: string
  checkType?: string
}

export interface IClassifyTransactionBody {
  id?: string
  transactionId?: string
  trackerType: string
  description: string
}

export interface IStatisticData extends IChartData {
  statusCode: number
}
export type IStatisticDataResponse = IBaseResponseData<IStatisticData>

export interface IDateRange {
  startDay?: Date
  endDay?: Date
}

// UnclassifiedTransactionDialog
export interface IUnclassifiedTxDialog {
  columns: any[]
  unclassifiedTxTableData: IDataTransactionTable[]
  tableConfig: IDataTableConfig
  setTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
}
export interface IClassifyTransactionDialog {
  classifyTransaction: any
  handleClassify: (data: IClassifyTransactionFormData) => void
}
export interface ICreateTrackerTransactionDialog {
  formData: ICreateTrackerTransactionFormData
  setFormData: React.Dispatch<React.SetStateAction<ICreateTrackerTransactionFormData>>
  accountSourceData: IAccountSource[]
  handleCreate: (data: ICreateTrackerTransactionFormData) => void
}

export interface ICreateTrackerTransactionTypeDialog {
  formData: ITrackerTransactionTypeBody
  setFormData: React.Dispatch<React.SetStateAction<ITrackerTransactionTypeBody>>
  createTrackerTransactionType: any
  hookUpdateCache: any
}

export interface ISharedDialogElements {
  incomeTrackerType: ITrackerTransactionType[]
  expenseTrackerType: ITrackerTransactionType[]
  isDialogOpen: IDialogTrackerTransaction
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
  hookResetCacheStatistic: any
  handleCreateTrackerType: (
    data: ITrackerTransactionTypeBody,
    setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
  ) => void
  handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => void
}

export interface ITrackerTransactionDialogProps {
  unclassifiedTxDialog: IUnclassifiedTxDialog
  classifyTransactionDialog: IClassifyTransactionDialog
  createTrackerTransactionDialog: ICreateTrackerTransactionDialog
  sharedDialogElements: ISharedDialogElements
  createTrackerTransactionTypeDialog: ICreateTrackerTransactionTypeDialog
}
