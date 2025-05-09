import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { translate } from '@/libraries/utils'
import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'
import { IClassifyTransactionFormProps } from '../models'

export const defineClassifyTransactionFormBody = ({
  editTrackerTypeDialogProps,
  expenseTrackerType,
  incomeTrackerType,
  typeOfEditTrackerType,
  setTypeOfEditTrackerType,
  setOpenEditDialog,
  openEditDialog,
  transaction
}: IClassifyTransactionFormProps): IBodyFormField[] => {
  const t = translate(['transaction', 'common'])
  console.log('transaction', transaction)

  return [
    {
      name: 'reasonName',
      type: EFieldType.Input,
      label: t('TransactionType.defineClassifyTransactionFormBody.reasonName.label'),
      placeHolder: t('TransactionType.defineClassifyTransactionFormBody.reasonName.placeholder'),
      props: {
        autoComplete: 'reasonName'
      }
    },
    {
      name: 'trackerTypeId',
      type: EFieldType.Combobox,
      label: t('TransactionType.defineClassifyTransactionFormBody.trackerTypeId.label'),
      placeHolder: t('TransactionType.defineClassifyTransactionFormBody.trackerTypeId.placeholder'),
      props: {
        autoComplete: 'trackerTypeId',
        setOpenEditDialog,
        dataArr: modifiedTrackerTypeForComboBox(
          editTrackerTypeDialogProps.typeDefault === ETypeOfTrackerTransactionType.INCOMING
            ? incomeTrackerType
            : expenseTrackerType
        ),
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
        label: t('TransactionType.defineClassifyTransactionFormBody.trackerTypeId.labelTrackerTransactionType')
      },
      subItems: [
        {
          // content: `<span className="suggestion-text font-medium"><strong className="font-bold text-gray-800">Agent có vài gợi ý cho bạn:</strong>${selectedTransaction.agentSuggest.map((item, index) => `${index !== selectedTransaction.agentSuggest.length - 1 ? item.trackerTypeName + ',' : item.trackerTypeName}`)}</span>`
          content: 'Agent có vài gợi ý cho bạn',
          suggestCategory:
            transaction.agentSuggest && transaction.agentSuggest.length > 0 ? transaction.agentSuggest : []
        }
      ]
    },
    {
      name: 'description',
      type: EFieldType.Textarea,
      label: t('TransactionType.defineClassifyTransactionFormBody.description.label'),
      placeHolder: t('TransactionType.defineClassifyTransactionFormBody.description.placeholder'),
      props: {
        autoComplete: 'description'
      }
    }
  ]
}

export const classifyTransactionSchema = z
  .object({
    reasonName: z.string().trim().min(5).max(100),
    trackerTypeId: z.string().uuid(),
    description: z.any()
  })
  .strict()
