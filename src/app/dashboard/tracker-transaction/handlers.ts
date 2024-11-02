import {
  IAdvancedTrackerTransactionResponse,
  ICustomTrackerTransaction,
  IDialogTrackerTransaction,
  ITrackerTransaction,
  ITrackerTransactionResponse
} from '@/core/tracker-transaction/models/tracker-transaction.interface'
import {
  IClassifyTransactionFormData,
  ICreateTrackerTransactionFormData,
  IDataTransactionTable,
  IGetTransactionResponse,
  ITransaction,
  ITransactionSummary
} from '@/core/transaction/models'
import toast from 'react-hot-toast'
import { initCreateTrackerTransactionForm, initTrackerTypeForm } from '../transaction/constants'
import React from 'react'
import { modifyTransactionHandler } from '../transaction/handler'
import { IBaseResponsePagination, IDataTableConfig } from '@/types/common.i'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { formatArrayData, formatDateTimeVN, getTypes } from '@/libraries/utils'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { IQueryOptions } from '@/types/query.interface'
import { initTableConfig } from '@/constants/data-table'
import { IAccountSource } from '@/core/account-source/models'

// const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//   if (event.key === 'Enter') {
//     handleAddNewItem()
//   }
// }

export const handleCreateTrackerTransaction = async ({
  payload,
  hookCreate,
  setIsDialogOpen,
  hookResetCacheStatistic,
  hookResetTodayTxs,
  hookResetTransactions,
  setDataTableConfig,
  setUncDataTableConfig,
  resetAccountSource
}: {
  payload: ICreateTrackerTransactionFormData
  hookCreate: any
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
  hookResetCacheStatistic: any
  hookResetTodayTxs: any
  hookResetTransactions: any
  setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  setUncDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  resetAccountSource: any
}) => {
  hookCreate(payload, {
    onSuccess: (res: ITrackerTransactionResponse) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        hookResetCacheStatistic()
        hookResetTodayTxs()
        hookResetTransactions()
        resetAccountSource()
        setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
        setUncDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
        toast.success('Create tracker transaction successfully!')
        setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false }))
      }
    }
  })
}

export const handleClassifyTransaction = async ({
  payload,
  setIsDialogOpen,
  hookCreate,
  hookResetCacheUnclassified,
  hookSetCacheToday,
  hookResetCacheStatistic,
  hookResetTrackerTx,
  setUncDataTableConfig,
  setTodayDataTableConfig,
  setDataTableConfig
}: {
  payload: IClassifyTransactionFormData
  setIsDialogOpen: React.Dispatch<React.SetStateAction<any>>
  hookCreate: any
  hookResetCacheUnclassified: any
  hookResetTrackerTx: any
  hookResetCacheStatistic?: any
  hookSetCacheToday: any
  setUncDataTableConfig?: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  setTodayDataTableConfig?: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  setDataTableConfig?: React.Dispatch<React.SetStateAction<IDataTableConfig>>
}) => {
  hookCreate(payload, {
    onSuccess: (res: ITrackerTransactionResponse) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        hookResetCacheUnclassified()
        hookSetCacheToday(res.data)
        hookResetTrackerTx()
        if (hookResetCacheStatistic) hookResetCacheStatistic()
        if (setUncDataTableConfig) setUncDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
        if (setTodayDataTableConfig) setTodayDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
        if (setDataTableConfig) setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
        toast.success('Classify transaction successfully!')
        setIsDialogOpen((prev: any) => ({ ...prev, isDialogClassifyTransactionOpen: false, isDialogDetailOpen: false }))
      }
    }
  })
}

function isIsoStringInToday(isoString: string): boolean {
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0)
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)
  const inputDate = new Date(isoString)

  if (isNaN(inputDate.getTime())) {
    return false
  }

  return inputDate >= startOfToday && inputDate <= endOfToday
}

export const updateCacheDataClassifyFeat = (
  oldData: IAdvancedTrackerTransactionResponse,
  newData: ITrackerTransaction
): IAdvancedTrackerTransactionResponse => {
  return { ...oldData, data: oldData.data.filter((item: ITrackerTransaction) => item.id !== newData.transactionId) }
}

function instanceOfInterface<T>(object: any): object is T {
  return 'member' in object
}

export const updateCacheDataTodayTxClassifyFeat = (
  oldData: IAdvancedTrackerTransactionResponse,
  newData: ITrackerTransaction
): IAdvancedTrackerTransactionResponse => {
  const updatedData = oldData.data.map((item) => {
    return item.id === newData.transactionId ? { ...item, ...newData.Transaction } : item
  })
  return { ...oldData, data: updatedData }
}

export const updateCacheDataCreate = (
  oldData: IAdvancedTrackerTransactionResponse,
  newData: ITrackerTransaction
): IAdvancedTrackerTransactionResponse => {
  const updatedData = [newData, ...oldData.data]

  if (updatedData.length > (oldData.pagination as IBaseResponsePagination).limit) updatedData.pop()
  return { ...oldData, data: updatedData }
}

export const handleCreateTrackerTxType = ({
  payload,
  hookCreate,
  hookUpdateCache,
  setIsCreating
}: {
  payload: ITrackerTransactionTypeBody
  hookCreate: any
  hookUpdateCache: any
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  hookCreate(payload, {
    onSuccess: (res: ITrackerTransactionResponse) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        hookUpdateCache(res.data)
        toast.success('Create tracker transaction type successfully!')
        setIsCreating(false)
      }
    }
  })
}

export const handleUpdateTrackerTxType = ({
  payload,
  hookUpdate,
  hookUpdateCache
}: {
  payload: ITrackerTransactionTypeBody
  hookUpdate: any
  hookUpdateCache: any
}) => {
  hookUpdate(payload, {
    onSuccess: (res: ITrackerTransactionResponse) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        hookUpdateCache(res.data)
        toast.success('Update tracker transaction type successfully!')
      }
    }
  })
}

export const initTrackerTransactionDataTable = (
  isGetAdvancedPending: boolean,
  getAdvancedData: IAdvancedTrackerTransactionResponse | undefined,
  setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>,
  setTableData: React.Dispatch<React.SetStateAction<ICustomTrackerTransaction[]>>
) => {
  if (!isGetAdvancedPending && getAdvancedData) {
    const formattedData: ICustomTrackerTransaction[] = formatArrayData(
      getAdvancedData.data,
      formatTrackerTransactionData
    )

    setDataTableConfig((prev) => ({
      ...prev,
      types: getTypes(getAdvancedData.data, 'Transaction.direction'),
      totalPage: Number(getAdvancedData.pagination?.totalPage)
    }))
    setTableData(formattedData)
  }
}

export const formatTrackerTransactionData = (data: ITrackerTransaction): ICustomTrackerTransaction => {
  return {
    id: data.id || '',
    reasonName: data.reasonName || '',
    type: data.Transaction.direction || '',
    checkType: data.Transaction.direction || '',
    trackerType: data.TrackerType.name || '',
    amount: `${new Intl.NumberFormat('en-US').format(data.Transaction?.amount || 0)} ${data.Transaction?.currency}`,
    transactionDate: data.time ? formatDateTimeVN(data.time, false) : '',
    accountSource: data.Transaction?.accountSource?.name || ''
  }
}

export const filterTrackerTransactionWithType = (selectedTypes: string[], data: ITrackerTransaction[]) => {
  if (selectedTypes.length === 0)
    return formatArrayData<ITrackerTransaction, ICustomTrackerTransaction>(data, formatTrackerTransactionData)
  const validValues = data.filter((item: ITrackerTransaction) =>
    selectedTypes.includes(item.Transaction.direction as string)
  )

  return formatArrayData<ITrackerTransaction, ICustomTrackerTransaction>(validValues, formatTrackerTransactionData)
}

export const onRowClick = (
  rowData: ICustomTrackerTransaction,
  advancedTrackerTxData: IAdvancedTrackerTransactionResponse | undefined,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
) => {
  if (advancedTrackerTxData) {
    const transactionData = advancedTrackerTxData.data.find((item) => item.id === rowData.id)
    setIsDialogOpen((prev) => ({ ...prev, isDialogClassifyTransactionOpen: true }))
  }
}

export const modifiedTrackerTypeForComboBox = (type: any) => {
  return type.map((item: any) => ({
    value: item.id,
    label: item.name,
    ...item
  }))
}

export const initTrackerTypeData = (
  data: ITrackerTransactionType[],
  setIncomingTrackerType: React.Dispatch<React.SetStateAction<ITrackerTransactionType[]>>,
  setExpenseTrackerType: React.Dispatch<React.SetStateAction<ITrackerTransactionType[]>>
) => {
  setIncomingTrackerType(data.filter((item) => item.type === 'INCOMING'))
  setExpenseTrackerType(data.filter((item) => item.type === 'EXPENSE'))
}

export const handleCreateTrackerType = ({
  payload,
  hookCreate,
  hookUpdateCacheTrackerType,
  setIsCreating
}: {
  hookCreate: any
  hookUpdateCacheTrackerType: any
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
  payload: ITrackerTransactionTypeBody
}) => {
  hookCreate(payload, {
    onSuccess: (res: ITrackerTransactionResponse) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        hookUpdateCacheTrackerType(res.data)
        setIsCreating(false)
        toast.success('Create tracker transaction type successfully!')
      }
    }
  })
}
