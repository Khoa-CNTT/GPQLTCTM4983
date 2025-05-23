import { IAccountBank } from '@/core/account-bank/models'
import { IAccountSource } from '@/core/account-source/models'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import {
  IEditTrackerTypeDialogProps,
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { ITrackerTransaction } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { IBaseResponseData } from '@/types/common.i'
import React from 'react'

export interface ITransaction {
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
  } | null
  time: string
  TrackerTransaction: ITrackerTransaction | null
  accountSource: IAccountSource
  accountBank: {
    id: string
    type: string
  }
}

export interface IUnclassifiedTransaction extends ITransaction {
  agentSuggest: IAgentRecommend[]
}

export interface IAgentRecommend {
  trackerTypeId?: string
  trackerTypeName?: string
  reasonName?: string
  message: string
}
export type IGetTransactionResponse = IBaseResponseData<ITransaction[]>
export type IGetUnclassifiedTransactionResponse = { data: IBaseResponseData<IUnclassifiedTransaction[]> }

export interface IDialogTransaction {
  isDialogDetailOpen: boolean
  isDialogTransactionTodayOpen: boolean
  isDialogUnclassifiedTransactionOpen: boolean
  isDialogClassifyTransactionOpen: boolean
  isDialogCreateTrackerTxTypeOpen: boolean
  isDialogDeleteOpen: boolean
  isDialogDeleteAllOpen: boolean
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
  fundId: string
}

export interface ICreateTrackerTransactionBody {
  trackerTypeId: string
  reasonName: string
  description?: string
  direction: string
  amount?: number
  accountSourceId: string
  fundId: string
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
  accountSourceId: string
  direction: ETypeOfTrackerTransactionType
  trackerTransactionTypeId?: string
}

export interface IClassiFyFormProps {
  indexSuggestSelected: number
  setIndexSuggestSelected: React.Dispatch<React.SetStateAction<number>>
  selectedTransaction: IUnclassifiedTransaction | null
  incomeTrackerType?: ITrackerTransactionType[]
  expenseTrackerType?: ITrackerTransactionType[]
  editTrackerTypeDialogProps?: Omit<
    IEditTrackerTypeDialogProps,
    'dataArr' | 'type' | 'setType' | 'setOpenEditDialog' | 'openEditDialog'
  >
  formClassifyRef?: React.RefObject<HTMLFormElement>
  handleClassify: (data: IClassifyTransactionBody) => void
  isPendingClassifyTransaction?: boolean
}

export interface IClassifyTransactionFormProps
  extends Omit<
    IClassiFyFormProps,
    'handleClassify' | 'formClassifyRef' | 'transactionId' | 'editTrackerTypeDialogProps'
  > {
  typeOfEditTrackerType: ETypeOfTrackerTransactionType
  setTypeOfEditTrackerType: React.Dispatch<React.SetStateAction<ETypeOfTrackerTransactionType>>
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>
  openEditDialog: boolean
  editTrackerTypeDialogProps: Omit<
    IEditTrackerTypeDialogProps,
    'dataArr' | 'type' | 'setType' | 'setOpenEditDialog' | 'openEditDialog'
  >
}

export type TTransactionActions =
  | 'getTransactions'
  | 'getTodayTransactions'
  | 'getUnclassifiedTransactions'
  | 'getAllAccountSource'
  | 'getStatistic'
  | 'getAllTrackerTransactionType'
  | 'getTrackerTransaction'
  | 'getAllExpenditureFund'
  | 'getExpenditureFund'
  | 'getStatisticOverview'
  | 'getBudgetTarget'
