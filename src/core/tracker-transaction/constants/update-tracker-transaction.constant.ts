import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { ITrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { IClassifyTransactionFormProps } from '@/core/transaction/models'
import { translate } from '@/libraries/utils'
import { EFieldType } from '@/types/formZod.interface'
import { z } from 'zod'

interface IUpdateTrackerTransactionFormBody extends IClassifyTransactionFormProps {
  trackerTypeData: ITrackerTransactionType[]
}

export const defineUpdateTrackerTransactionFormBody = ({
  editTrackerTypeDialogProps,
  expenseTrackerType,
  incomeTrackerType,
  typeOfEditTrackerType,
  setTypeOfEditTrackerType,
  setOpenEditDialog,
  openEditDialog,
  trackerTypeData
}: IUpdateTrackerTransactionFormBody) => {
  const t = translate(['accountSource'])
  return [
    {
      name: 'reasonName',
      type: EFieldType.Input,
      label: t('form.defineCreateAccountSourceFormBody.reasonName.label'),
      placeHolder: t('form.defineCreateAccountSourceFormBody.reasonName.placeholder'),
      props: {
        autoComplete: 'reasonName'
      }
    },
    {
      name: 'trackerTypeId',
      type: EFieldType.Combobox,
      label: t('form.defineCreateAccountSourceFormBody.trackerTypeId.label'),
      placeHolder: t('form.defineCreateAccountSourceFormBody.trackerTypeId.placeholder'),
      props: {
        autoComplete: 'trackerTypeId',
        setOpenEditDialog,
        dataArr: trackerTypeData,
        dialogEdit: EditTrackerTypeDialog({
          ...editTrackerTypeDialogProps,
          dataArr: modifiedTrackerTypeForComboBox(
            typeOfEditTrackerType === ETypeOfTrackerTransactionType.INCOMING ? incomeTrackerType : expenseTrackerType
          ),
          type: typeOfEditTrackerType,
          setType: setTypeOfEditTrackerType,
          setOpenEditDialog,
          openEditDialog
        }),
        label: 'Tracker Transaction Type'
      }
    },
    {
      name: 'description',
      type: EFieldType.Textarea,
      label: t('form.defineCreateAccountSourceFormBody.description.label'),
      placeHolder: t('form.defineCreateAccountSourceFormBody.description.placeholder'),
      props: {
        autoComplete: 'description'
      }
    }
  ]
}

export type TUpdateTrackerTransactionSchema = z.infer<typeof updateTrackerTransactionSchema>

export const updateTrackerTransactionSchema = z
  .object({
    reasonName: z
      .string({ message: 'Reason name is required' })
      .trim()
      .min(1, { message: 'Reason name cannot be empty' })
      .max(100, { message: 'Reason name must be at most 100 characters long' }),
    trackerTypeId: z.string().uuid('Please select a specific category'),
    description: z
      .string()
      .trim()
      .transform((val) => (val === '' ? null : val))
      .refine((val) => val === null || val.length <= 256, {
        message: 'Description must not exceed 256 characters.'
      })
      .nullable()
  })
  .strict()
