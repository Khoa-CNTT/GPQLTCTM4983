import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
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
      message: 'amount_must_be_positive'
    }),
  trackerTypeId: z.string().min(1),
  type: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ANNUAL'])
  // expectedDate: z.date().optional(),
  // dayOfWeek: z.string().optional(),
  // month: z.string().optional(),
  // day: z.string().optional(),
  // notifyBefore: z.string().default('3')
})

export const defineCreatePlanFormBody = ({
  accountSourceData,
  incomeTrackerType,
  expenseTrackerType,
  currentDirection,
  setCurrentDirection,
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
  isPending
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
      name: 'description',
      type: EFieldType.Textarea,
      label: t('spendingPlan:form.planFields.description'),
      placeHolder: t('spendingPlan:form.planFields.descriptionPlaceholder'),
      props: {
        autoComplete: 'description'
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
          currentDirection === 'INCOMING' ? incomeTrackerType : expenseTrackerType
        ),
        onValueChange: onCategoryChange,
        dialogEdit: EditTrackerTypeDialog({
          openEditDialog: openEditTrackerTxTypeDialog,
          setOpenEditDialog: setOpenEditTrackerTxTypeDialog,
          dataArr: modifiedTrackerTypeForComboBox(
            typeOfEditTrackerType === 'INCOMING' ? incomeTrackerType : expenseTrackerType
          ),
          typeDefault: currentDirection || 'INCOMING',
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
      name: 'type',
      type: EFieldType.Select,
      label: t('spendingPlan:form.planFields.frequency'),
      placeHolder: t('spendingPlan:form.planFields.frequencyPlaceholder'),
      props: {
        autoComplete: 'type'
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
