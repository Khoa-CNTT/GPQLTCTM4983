import { ITrackerTransaction } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { IBaseResponseData } from '@/types/common.i'

export type ITransaction = {
  id: string
  direction: string
  transactionId: string
  amount: number
  toAccountNo: string | null
  toAccountName: string | null
  toBankName: string | null
  currency: string
  description: string
  accountBankId: string
  ofAccountId: string
  ofAccount: {
    id: string
    accountNo: string
    accountBankId: string
  }
  time: string
  TrackerTransaction: ITrackerTransaction | null
}

export type IGetTransactionResponse = IBaseResponseData<ITransaction[]>

export interface IDialogTransaction {
  isDialogDetailOpen: boolean
  isDialogTransactionTodayOpen: boolean
  isDialogUnclassifiedTransactionOpen: boolean
  isDialogClassifyTransactionOpen: boolean
  isDialogCreateTrackerTxTypeOpen: boolean
}

export interface IDataTransactionTable {
  id: string
  transactionId: string
  amount: string
  direction: string
  accountBank: string | null
  currency: string
  accountNo: string | null
  description: string
  time: string
  TrackerTransaction: ITrackerTransaction | null
}

export interface IClassifyTransactionFormData {
  transactionId?: string
  trackerTypeId: string
  reasonName: string
  description: string
}

export interface ICreateTrackerTransactionFormData {
  trackerTypeId: string
  reasonName: string
  description?: string
  direction: string
  amount?: number
  accountSourceId: string
}

interface ITransactionSummaryData {
  count: number
  incomeAmount: number
  expenseAmount: number
  data: IDataTransactionTable[]
}

export interface ITransactionSummary {
  transactionToday: ITransactionSummaryData
  unclassifiedTransaction: ITransactionSummaryData
}
