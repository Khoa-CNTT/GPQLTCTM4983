import FormZod from '@/components/core/FormZod'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import { defineUpdateTransactionFormBody, updateTransactionSchema } from './constants'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { handleCancelEdit } from '@/app/chatbox/handler'
import { IAccountSource } from '@/core/account-source/models'
import { Transaction } from '@/app/chatbox/constants'
import toast from 'react-hot-toast'

interface IUpdateTransactionProps {
  transaction: Transaction
  incomeTrackerType: ITrackerTransactionType[]
  expenseTrackerType: ITrackerTransactionType[]
  trackerType: ITrackerTransactionType[]
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>
  accountSources: IAccountSource[]
  editedTransaction: any[]
  setEditedTransaction: React.Dispatch<React.SetStateAction<any[]>>
  setTransaction: React.Dispatch<React.SetStateAction<Transaction[]>>
}

export const UpdateTransaction = (props: IUpdateTransactionProps) => {
  const {
    incomeTrackerType,
    expenseTrackerType,
    trackerType,
    setEditingId,
    accountSources,
    transaction,
    setEditedTransaction,
    editedTransaction,
    setTransaction
  } = props
  const formRef = useRef<HTMLFormElement>(null)
  // state
  const [typeOfEditTrackerType, setTypeOfEditTrackerType] = useState<ETypeOfTrackerTransactionType>(
    trackerType[0].type as ETypeOfTrackerTransactionType
  )
  const [isOpenEditDialog, setIsOpenEditDialog] = useState<boolean>(false)

  // effect
  useEffect(() => {
    setTypeOfEditTrackerType(trackerType[0].type as ETypeOfTrackerTransactionType)
  }, [trackerType])

  return (
    <div>
      <FormZod
        defaultValues={{
          reasonName: transaction.description,
          amount: transaction.amount,
          trackerTypeId: transaction.categoryId,
          accountSourceId: transaction.accountSourceId || 'unknown'
        }}
        formFieldBody={defineUpdateTransactionFormBody({
          selectedTransaction: null, // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx cần fix
          incomeTrackerType,
          expenseTrackerType,
          currentDirection: typeOfEditTrackerType,
          accountSourceData: accountSources,
          typeOfEditTrackerType,
          setTypeOfEditTrackerType,
          openEditDialog: isOpenEditDialog,
          setOpenEditDialog: setIsOpenEditDialog,
          editTrackerTypeDialogProps: {
            typeDefault: trackerType[0].type as ETypeOfTrackerTransactionType,
            expenditureFund: [],
            handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => {},
            handleCreateTrackerType: (
              data: ITrackerTransactionTypeBody,
              setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
            ) => {},
            handleDeleteTrackerType: (id: string) => {}
          }
        })}
        formSchema={updateTransactionSchema}
        onSubmit={(data) => {
          const isExist = editedTransaction.find((item) => item.id === transaction.id)
          if (isExist) {
            setEditedTransaction((prev) =>
              prev.map((item) => {
                if (item.id === transaction.id) {
                  return {
                    ...item,
                    ...data,
                    accountSourceId: data.accountSourceId,
                    accountSourceName: accountSources.find((source) => source.id === data.accountSourceId)
                      ?.name as string,
                    categoryId: data.trackerTypeId,
                    categoryName: trackerType.find((type) => type.id === data.trackerTypeId)?.name as string,
                    type: incomeTrackerType.find((type) => type.id === data.trackerTypeId)
                      ? ETypeOfTrackerTransactionType.INCOMING
                      : ETypeOfTrackerTransactionType.EXPENSE
                  }
                }
                return item
              })
            )
          } else {
            setEditedTransaction((prev) => [
              ...prev,
              {
                ...data,
                id: transaction.id,
                accountSourceId: data.accountSourceId,
                accountSourceName: accountSources.find((source) => source.id === data.accountSourceId)?.name as string,
                categoryId: data.trackerTypeId,
                categoryName: trackerType.find((type) => type.id === data.trackerTypeId)?.name as string,
                type: incomeTrackerType.find((type) => type.id === data.trackerTypeId)
                  ? ETypeOfTrackerTransactionType.INCOMING
                  : ETypeOfTrackerTransactionType.EXPENSE
              }
            ])
          }
          setTransaction((prev) =>
            prev.map((item) => {
              if (item.id === transaction.id) {
                return {
                  ...item,
                  ...data,
                  description: data.reasonName,
                  type: incomeTrackerType.find((type) => type.id === data.trackerTypeId)
                    ? ETypeOfTrackerTransactionType.INCOMING
                    : ETypeOfTrackerTransactionType.EXPENSE,
                  categoryId: data.trackerTypeId,
                  accountSourceName: accountSources.find((source) => source.id === data.accountSourceId)
                    ?.name as string,
                  categoryName: trackerType.find((type) => type.id === data.trackerTypeId)?.name as string
                }
              }
              return item
            })
          )
          toast.success('Cập nhật giao dịch thành công')
        }}
        submitRef={formRef}
      />
      <div className='mt-4 flex items-center justify-end gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => {
            handleCancelEdit(setEditingId)
          }}
        >
          <X className='mr-2 h-4 w-4' />
          Hủy
        </Button>
        <Button
          size='sm'
          onClick={() => {
            formRef.current?.requestSubmit()
          }}
        >
          <Check className='mr-2 h-4 w-4' />
          Lưu
        </Button>
      </div>
    </div>
  )
}
