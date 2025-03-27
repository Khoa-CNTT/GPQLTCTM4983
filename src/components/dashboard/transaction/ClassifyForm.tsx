import { IClassiFyFormProps, IClassifyTransactionBody } from '@/core/transaction/models'
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
}) {
  const [typeOfEditTrackerType, setTypeOfEditTrackerType] = useState<ETypeOfTrackerTransactionType>(
    editTrackerTypeDialogProps.typeDefault || ETypeOfTrackerTransactionType.INCOMING
  )

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
        openEditDialog: isOpenDialogEditTrackerType
      })}
      onSubmit={(data) => handleClassify({ ...data, transactionId } as IClassifyTransactionBody)}
      submitRef={formClassifyRef}
    />
  )
}
