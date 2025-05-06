import { z } from 'zod'
import { EFieldType } from '@/types/formZod.interface'
import { translate } from '@/libraries/utils'

// Update the schema to match the create form, but omitting non-updatable fields
export const updateFundSavingTargetSchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .min(3)
    .max(100),
  description: z
    .string()
    .min(5)
    .max(500),
  targetAmount: z
    .string()
    .min(1)
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: "amount_must_be_positive"
    }),
  startDate: z.date(),
  endDate: z.date()
}).refine(
  (data) => data.endDate > data.startDate,
  {
    message: "end_date_after_start_date",
    path: ["endDate"],
  }
)

export type IUpdateFundSavingTargetFormValues = z.infer<typeof updateFundSavingTargetSchema>

// Updated to place date fields side by side
export const defineUpdateFundSavingTargetFormBody = () => {
  const t = translate(['spendingPlan', 'common']);

  return [
    {
      name: 'name',
      label: t('targetForm.fields.title'),
      type: EFieldType.Input,
      placeHolder: t('targetForm.fields.titlePlaceholder'),
      props: {
        className: 'col-span-2 mb-4'
      }
    },
    {
      name: 'description',
      label: t('targetForm.fields.description'),
      type: EFieldType.Textarea,
      placeHolder: t('targetForm.fields.descriptionPlaceholder'),
      props: {
        className: 'col-span-2 mb-4',
        rows: 3
      }
    },
    {
      name: 'targetAmount',
      label: t('targetForm.fields.targetAmount'),
      type: EFieldType.MoneyInput,
      placeHolder: t('targetForm.fields.targetAmountPlaceholder'),
      props: {
        className: 'col-span-2 mb-4'
      }
    },
    // Date fields are now each col-span-1 to appear side by side in a grid-cols-2 layout
    {
      name: 'startDate',
      label: t('targetForm.fields.startDate'),
      type: EFieldType.DatePicker,
      placeHolder: t('targetForm.fields.startDatePlaceholder'),
      props: {
        className: 'mb-4'  // col-span-1 by default
      }
    },
    {
      name: 'endDate',
      label: t('targetForm.fields.endDate'),
      type: EFieldType.DatePicker,
      placeHolder: t('targetForm.fields.endDatePlaceholder'),
      props: {
        className: 'mb-4'  // col-span-1 by default
      }
    }
  ];
}
