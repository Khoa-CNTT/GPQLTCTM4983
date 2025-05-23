import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { translate } from '@/libraries/utils'
import { EFieldType } from '@/types/formZod.interface'
import { z } from 'zod'

export const createFundSavingPlanSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string'
    })
    .min(3, {
      message: 'Name must be at least 3 characters'
    })
    .max(50, {
      message: 'Name must be at most 50 characters'
    }),
  description: z
    .string()
    .max(255, {
      message: 'Description must be at most 255 characters'
    })
    .optional(),
  targetAmount: z
    .string({
      required_error: 'Target amount is required',
      invalid_type_error: 'Target amount must be a string'
    })
    .min(1, {
      message: 'Target amount is required'
    })
    .refine((val) => !isNaN(Number(val.replace(/[^\d.-]/g, ''))) && Number(val.replace(/[^\d.-]/g, '')) > 0, {
      message: 'Target amount must be positive'
    }),
  trackerTypeId: z.string({
    required_error: 'Please select Category',
    invalid_type_error: 'Category must be a string'
  }),
  type: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ANNUAL'], {
    required_error: 'Type is required',
    invalid_type_error: 'Type must be one of: Daily, Weekly, Monthly, Annual'
  }),
  expectedDate: z
    .date({
      required_error: 'Expected date is required',
      invalid_type_error: 'Expected date must be a valid date'
    })
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
  expenseTrackerType,
  setOpenEditTrackerTxTypeDialog,
  openEditTrackerTxTypeDialog,
  typeOfEditTrackerType,
  setTypeOfEditTrackerType,
  handleCreateTrackerType,
  handleUpdateTrackerType,
  handleDeleteTrackerType,
  expenditureFund,
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
        dataArr: modifiedTrackerTypeForComboBox(expenseTrackerType),
        dialogEdit: EditTrackerTypeDialog({
          openEditDialog: openEditTrackerTxTypeDialog,
          setOpenEditDialog: setOpenEditTrackerTxTypeDialog,
          dataArr: modifiedTrackerTypeForComboBox(expenseTrackerType),
          typeDefault: ETypeOfTrackerTransactionType.EXPENSE,
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
