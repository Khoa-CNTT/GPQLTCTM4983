import { ICreateTrackerTransactionBody } from '@/core/transaction/models'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { IAccountSource } from '@/core/account-source/models'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { useEffect, useState } from 'react'
import FormZod from '@/components/core/FormZod'
import {
  createTrackerTransactionSchema,
  defineCreateTrackerTransactionFormBody
} from '@/core/tracker-transaction/constants/create-tracker-transaction.constant'

interface ICreateTrackerTransactionFormProps {
  incomeTrackerType: ITrackerTransactionType[]
  expenseTrackerType: ITrackerTransactionType[]
  accountSourceData: IAccountSource[]
  openEditTrackerTxTypeDialog: boolean
  setOpenEditTrackerTxTypeDialog: React.Dispatch<React.SetStateAction<boolean>>
  handleCreate: (data: ICreateTrackerTransactionBody) => void
  handleCreateTrackerType: (
    data: ITrackerTransactionTypeBody,
    setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
  ) => void
  handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => void
  handleDeleteTrackerType: (id: string) => void
  formCreateRef: React.RefObject<HTMLFormElement>
  expenditureFund: { label: string; value: string | number }[]
}

export default function CreateTrackerTransactionForm({
  incomeTrackerType,
  expenseTrackerType,
  accountSourceData,
  openEditTrackerTxTypeDialog,
  formCreateRef,
  setOpenEditTrackerTxTypeDialog,
  handleCreate,
  handleCreateTrackerType,
  handleUpdateTrackerType,
  handleDeleteTrackerType,
  expenditureFund
}: ICreateTrackerTransactionFormProps) {
  const [currentDirection, setCurrentDirection] = useState<ETypeOfTrackerTransactionType>(
    ETypeOfTrackerTransactionType.INCOMING
  )
  const [typeOfEditTrackerType, setTypeOfEditTrackerType] = useState<ETypeOfTrackerTransactionType>(
    ETypeOfTrackerTransactionType.INCOMING
  )

  const [directionCategoryMap, setDirectionCategoryMap] = useState<Record<ETypeOfTrackerTransactionType, string>>({
    [ETypeOfTrackerTransactionType.INCOMING]: '',
    [ETypeOfTrackerTransactionType.EXPENSE]: '',
    [ETypeOfTrackerTransactionType.TRANSFER]: ''
  })

  const handleDirectionChange = (value: ETypeOfTrackerTransactionType) => {
    const oldDirection = currentDirection

    setCurrentDirection(value)

    const currentForm = formCreateRef.current
    if (currentForm && typeof currentForm.getValues === 'function') {
      const formValues = currentForm.getValues()

      if (formValues.trackerTypeId) {
        setDirectionCategoryMap((prev) => ({
          ...prev,
          [oldDirection]: formValues.trackerTypeId
        }))
      }

      setTimeout(() => {
        if (currentForm && typeof currentForm.setValue === 'function') {
          currentForm.setValue('trackerTypeId', directionCategoryMap[value] || '')
        }
      }, 0)
    }
  }

  const handleCategoryChange = (value: string) => {
    setDirectionCategoryMap((prev) => ({
      ...prev,
      [currentDirection]: value
    }))
  }

  useEffect(() => {
    setTypeOfEditTrackerType(currentDirection)
  }, [currentDirection])

  return (
    <FormZod
      formSchema={createTrackerTransactionSchema}
      formFieldBody={defineCreateTrackerTransactionFormBody({
        accountSourceData,
        incomeTrackerType,
        expenseTrackerType,
        currentDirection,
        setCurrentDirection: handleDirectionChange,
        setOpenEditTrackerTxTypeDialog,
        openEditTrackerTxTypeDialog,
        typeOfEditTrackerType,
        setTypeOfEditTrackerType,
        handleCreateTrackerType,
        handleUpdateTrackerType,
        handleDeleteTrackerType,
        expenditureFund,
        directionCategoryMap,
        onCategoryChange: handleCategoryChange
      })}
      onSubmit={(data: any) => {
        const payload = { ...data, amount: Number(data.amount) }
        handleCreate(payload)
      }}
      submitRef={formCreateRef}
    />
  )
}
