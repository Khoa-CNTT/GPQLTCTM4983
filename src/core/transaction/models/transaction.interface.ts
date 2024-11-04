import { IAccountBank } from '@/core/account-bank/models'
import { IAccountSource } from '@/core/account-source/models'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { ITrackerTransaction } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { IBaseResponseData } from '@/types/common.i'

export type ITransaction = {
  id: string
  transactionDateTime: string
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
  accountSource: IAccountSource
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
  amount: string
  direction: string
  accountNo: string
  accountSource: string | null
  description: string
  date: string
  TrackerTransaction: ITrackerTransaction | null
}

export interface IClassifyTransactionBody {
  transactionId?: string
  trackerTypeId: string
  reasonName: string
  description: string
}

export interface ICreateTrackerTransactionBody {
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

export interface IUpdateTransactionBody {
  id: string
  amount: number
  direction: ETypeOfTrackerTransactionType
}
