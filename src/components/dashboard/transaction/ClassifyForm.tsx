import { IClassiFyFormProps, IClassifyTransactionBody, ITransaction } from '@/core/transaction/models'
import { useEffect, useState } from 'react'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import FormZod from '@/components/core/FormZod'
import {
  classifyTransactionSchema,
  defineClassifyTransactionFormBody
} from '@/core/transaction/constants/classify-transaction.constant'
import { IEditTrackerTypeDialogProps } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'

export default function ClassifyForm({
  transactionId,
  transaction,
  incomeTrackerType,
  expenseTrackerType,
  formClassifyRef,
  handleClassify,
  editTrackerTypeDialogProps
}: Omit<IClassiFyFormProps, 'editTrackerTypeDialogProps'> & {
  editTrackerTypeDialogProps: Omit<
    IEditTrackerTypeDialogProps,
    'dataArr' | 'type' | 'setType' | 'setOpenEditDialog' | 'openEditDialog'
  >
  transaction: ITransaction
}) {
  const [typeOfEditTrackerType, setTypeOfEditTrackerType] = useState<ETypeOfTrackerTransactionType>(
    editTrackerTypeDialogProps.typeDefault || ETypeOfTrackerTransactionType.INCOMING
  )

  useEffect(() => {
    console.log('111111111111111', transaction)
  }, [transaction])

  const [isOpenDialogEditTrackerType, setIsOpenDialogEditTrackerType] = useState<boolean>(false)
  useEffect(() => {
    setTypeOfEditTrackerType(editTrackerTypeDialogProps?.typeDefault || ETypeOfTrackerTransactionType.INCOMING)
  }, [editTrackerTypeDialogProps?.typeDefault])
  return (
    <FormZod
      formSchema={classifyTransactionSchema}
      formFieldBody={defineClassifyTransactionFormBody({
        editTrackerTypeDialogProps,
        expenseTrackerType,
        incomeTrackerType,
        typeOfEditTrackerType,
        setTypeOfEditTrackerType,
        setOpenEditDialog: setIsOpenDialogEditTrackerType,
        openEditDialog: isOpenDialogEditTrackerType,
        transaction
      })}
      onSubmit={(data) => handleClassify({ ...data, transactionId } as IClassifyTransactionBody)}
      submitRef={formClassifyRef}
    />
  )
}
