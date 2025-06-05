import { z } from 'zod'
import { EFieldType } from '@/types/formZod.interface'
import { mockDataTrackerType } from '@/app/dashboard/spending-plan/constant'
import { translate } from '@/libraries/utils'
import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'

// Create basic schema
export const createFundSavingTargetSchema = z
  .object({
    name: z.string().min(3).max(50),
    description: z.string().max(255).optional(),
    targetAmount: z
      .string()
      .min(1)
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Amount must be positive'
      }),
    trackerTypeId: z.string().min(1),
    startDate: z.date(),
    endDate: z.date(),
    direction: z.any()
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'end_date_after_start_date',
    path: ['endDate']
  })

// Schema for creating a simplified budget
export const createSimplifiedBudgetSchema = z.object({
  targetAmount: z
    .string()
    .min(1)
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'amount_must_be_positive'
    })
})

export const dateConstraint = (data: any) => {
  if (data.startDate && data.endDate) {
    return data.endDate > data.startDate
  }
  return true
}

export const defineCreateFundSavingTargetFormBody = ({
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
  setCurrentDirection
}: any) => {
  const t = translate(['spendingPlan', 'common', 'trackerTransaction'])

  return [
    {
      name: 'name',
      label: t('targetForm.fields.title'),
      type: EFieldType.Input,
      placeHolder: t('targetForm.fields.titlePlaceholder'),
      props: {
        className: 'col-span-2'
      }
    },
    {
      name: 'targetAmount',
      label: t('targetForm.fields.targetAmount'),
      type: EFieldType.MoneyInput,
      placeHolder: t('targetForm.fields.targetAmountPlaceholder'),
      props: {
        className: 'col-span-2'
      }
    },
    {
      name: 'description',
      label: t('targetForm.fields.description'),
      type: EFieldType.Textarea,
      placeHolder: t('targetForm.fields.descriptionPlaceholder'),
      props: {
        className: 'col-span-2'
      }
    },
    {
      name: 'direction',
      type: EFieldType.Select,
      label: t('form.defineCreateTrackerTransactionFormBody.direction.label'),
      placeHolder: t('form.defineCreateTrackerTransactionFormBody.direction.placeholder'),
      props: {
        autoComplete: 'direction',
        onchange: (value: any) => {
          const previousDirection = currentDirection
          setCurrentDirection(value as ETypeOfTrackerTransactionType)
        }
      },
      dataSelector: [
        {
          value: 'INCOMING',
          label: t('form.defineCreateTrackerTransactionFormBody.direction.options.incoming')
        },
        {
          value: 'EXPENSE',
          label: t('form.defineCreateTrackerTransactionFormBody.direction.options.expense')
        }
      ]
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
      name: 'startDate',
      label: t('targetForm.fields.startDate'),
      type: EFieldType.DatePicker,
      placeHolder: t('targetForm.fields.startDatePlaceholder')
    },
    {
      name: 'endDate',
      label: t('targetForm.fields.endDate'),
      type: EFieldType.DatePicker,
      placeHolder: t('targetForm.fields.endDatePlaceholder')
    }
  ]
}

// Form fields for simplified budget creation mode
export const defineCreateSimplifiedBudgetFormBody = () => {
  const t = translate(['spendingPlan', 'common'])

  return [
    {
      name: 'targetAmount',
      label: t('targetForm.fields.totalTargetAmount'),
      type: EFieldType.MoneyInput,
      placeHolder: t('targetForm.fields.totalTargetAmountPlaceholder'),
      props: {
        className: 'col-span-2 mb-4'
      }
    }
  ]
}
