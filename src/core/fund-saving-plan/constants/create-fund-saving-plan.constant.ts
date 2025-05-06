import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { translate } from '@/libraries/utils'
import { EFieldType } from '@/types/formZod.interface'
import { z } from 'zod'
export const createFundSavingPlanSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  targetAmount: z
    .string()
    .min(1)
    .refine((val) => !isNaN(Number(val.replace(/[^\d.-]/g, ''))) && Number(val.replace(/[^\d.-]/g, '')) > 0, {
      message: 'Target amount must be positive'
    }),
  trackerTypeId: z.string().min(1),
  type: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ANNUAL']),
  expectedDate: z
    .date()
    .refine(
      (date) => {
        const today = new Date(new Date().setHours(0, 0, 0, 0))
        return date >= today
      },
      {
        message: 'Expected date must be greater than or equal to today'
      }
    )
    .optional(),
  dayOfWeek: z.string().optional(),
  month: z.string().optional(),
  day: z.string().optional()
})

export const defineCreatePlanFormBody = ({
  incomeTrackerType,
  expenseTrackerType,
  currentDirection,
  setOpenEditTrackerTxTypeDialog,
  openEditTrackerTxTypeDialog,
  typeOfEditTrackerType,
  setTypeOfEditTrackerType,
  handleCreateTrackerType,
  handleUpdateTrackerType,
  handleDeleteTrackerType,
  expenditureFund,
  directionCategoryMap,
  onCategoryChange,
  onFrequencyChange
}: any) => {
  const t = translate(['spendingPlan'])
  return [
    {
      name: 'name',
      type: EFieldType.Input,
      label: t('spendingPlan:form.planFields.title'),
      placeHolder: t('spendingPlan:form.planFields.titlePlaceholder'),
      props: {
        autoComplete: 'name'
      }
    },

    {
      name: 'targetAmount',
      type: EFieldType.MoneyInput,
      label: t('spendingPlan:form.planFields.amount'),
      placeHolder: t('spendingPlan:form.planFields.amountPlaceholder'),
      props: {
        autoComplete: 'targetAmount'
      }
    },
    {
      name: 'trackerTypeId',
      type: EFieldType.Combobox,
      label: t('spendingPlan:form.planFields.category'),
      placeHolder: t('spendingPlan:form.planFields.categoryPlaceholder'),
      props: {
        autoComplete: 'trackerTypeId',
        setOpenEditDialog: setOpenEditTrackerTxTypeDialog,
        dataArr: modifiedTrackerTypeForComboBox(
          currentDirection === ETypeOfTrackerTransactionType.INCOMING ? incomeTrackerType : expenseTrackerType
        ),
        onValueChange: (value: string) => {
          if (onCategoryChange) {
            onCategoryChange(value)
          }
        },
        value: directionCategoryMap?.[currentDirection] || '',
        dialogEdit: EditTrackerTypeDialog({
          openEditDialog: openEditTrackerTxTypeDialog,
          setOpenEditDialog: setOpenEditTrackerTxTypeDialog,
          dataArr: modifiedTrackerTypeForComboBox(
            typeOfEditTrackerType === ETypeOfTrackerTransactionType.INCOMING ? incomeTrackerType : expenseTrackerType
          ),
          typeDefault: currentDirection || ETypeOfTrackerTransactionType.INCOMING,
          type: typeOfEditTrackerType,
          setType: setTypeOfEditTrackerType,
          handleCreateTrackerType,
          handleUpdateTrackerType,
          handleDeleteTrackerType,
          expenditureFund
        })
      }
    },
    {
      name: 'description',
      type: EFieldType.Textarea,
      label: t('spendingPlan:form.planFields.description'),
      placeHolder: t('spendingPlan:form.planFields.descriptionPlaceholder'),
      props: {
        autoComplete: 'description'
      }
    },
    {
      name: 'type',
      type: EFieldType.Select,
      label: t('spendingPlan:form.planFields.frequency'),
      placeHolder: t('spendingPlan:form.planFields.frequencyPlaceholder'),
      props: {
        autoComplete: 'type',
        onchange: (value: string) => {
          console.log('hus')
          onFrequencyChange(value)
        }
      },
      dataSelector: [
        { value: 'DAILY', label: t('spendingPlan:frequency.daily') },
        { value: 'WEEKLY', label: t('spendingPlan:frequency.weekly') },
        { value: 'MONTHLY', label: t('spendingPlan:frequency.monthly') },
        { value: 'ANNUAL', label: t('spendingPlan:frequency.annual') }
      ]
    }
  ]
}

export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate()
}
