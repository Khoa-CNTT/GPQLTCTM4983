import { z } from 'zod'
import { EFieldType } from '@/types/formZod.interface'
import { translate } from '@/libraries/utils'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'

// Zod schema for the Edit Plan form
export const editFundSavingPlanSchema = z.object({
  name: z.string().min(3).max(100),
  description: z
    .string()
    .trim()
    .transform((val) => (val === '' ? null : val))
    .refine((val) => val === null || (val.length >= 5 && val.length <= 256), {
      message: 'Description must be between 5 and 256 characters long.'
    })
    .nullable(),
  targetAmount: z
    .string()
    .min(1)
    .refine((val) => !isNaN(Number(val.replace(/[^\d.-]/g, ''))) && Number(val.replace(/[^\d.-]/g, '')) > 0, {
      message: 'Target amount must be positive'
    })
    .transform((val) => Number(val.replace(/[^\d.-]/g, ''))),
  trackerTypeId: z.string(),
  type: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ANNUAL']),
  day: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : undefined))
    .refine((val) => val === undefined || (val >= 1 && val <= 31), {
      message: 'Day must be between 1 and 31'
    }),
  month: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : undefined))
    .refine((val) => val === undefined || (val >= 1 && val <= 12), {
      message: 'Month must be between 1 and 12'
    }),
  dayOfWeek: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : undefined))
    .refine((val) => val === undefined || (val >= 0 && val <= 6), {
      message: 'Day of week must be between 0 and 6'
    }),
  dayOfMonth: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : undefined))
    .refine((val) => val === undefined || (val >= 1 && val <= 31), {
      message: 'Day of month must be between 1 and 31'
    }),
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
    .optional()
})

// Form fields definition
export const defineEditPlanFormBody = ({
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
    }
  ]
}
