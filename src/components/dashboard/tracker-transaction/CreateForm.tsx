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
  expenditureFund
}: ICreateTrackerTransactionFormProps) {
  const [currentDirection, setCurrentDirection] = useState<ETypeOfTrackerTransactionType>(
    ETypeOfTrackerTransactionType.INCOMING
  )
  const [typeOfEditTrackerType, setTypeOfEditTrackerType] = useState<ETypeOfTrackerTransactionType>(
    ETypeOfTrackerTransactionType.INCOMING
  )

  // Thêm state để lưu trữ trackerTypeId cho mỗi direction
  const [directionCategoryMap, setDirectionCategoryMap] = useState<Record<ETypeOfTrackerTransactionType, string>>({
    [ETypeOfTrackerTransactionType.INCOMING]: '',
    [ETypeOfTrackerTransactionType.EXPENSE]: ''
  })

  // Handler để cập nhật trackerTypeId khi direction thay đổi
  const handleDirectionChange = (value: ETypeOfTrackerTransactionType) => {
    // Lưu lại direction cũ để sau này có thể khôi phục giá trị
    const oldDirection = currentDirection
    // Cập nhật direction mới
    setCurrentDirection(value)

    // Reset form để cập nhật giá trị mặc định cho các trường
    const currentForm = formCreateRef.current
    if (currentForm && typeof currentForm.getValues === 'function') {
      // Lấy dữ liệu hiện tại của form
      const formValues = currentForm.getValues()

      // Cập nhật directionCategoryMap với category hiện tại
      if (formValues.trackerTypeId) {
        setDirectionCategoryMap((prev) => ({
          ...prev,
          [oldDirection]: formValues.trackerTypeId
        }))
      }

      // Cập nhật form với giá trị category đã lưu cho direction mới (nếu có)
      setTimeout(() => {
        if (currentForm && typeof currentForm.setValue === 'function') {
          currentForm.setValue('trackerTypeId', directionCategoryMap[value] || '')
        }
      }, 0)
    }
  }

  // Handler để cập nhật trackerTypeId trong state khi người dùng chọn category
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
