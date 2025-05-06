import { z } from 'zod';
import { EFieldType } from '@/types/formZod.interface';
import { translate } from '@/libraries/utils';

// Zod schema for the Edit Plan form
export const editFundSavingPlanSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(100),
  description: z
    .string()
    .max(500)
    .optional(),
  targetAmount: z
    .string()
    .min(1)
    .refine(val => !isNaN(Number(val.replace(/[^\d.-]/g, ''))) && Number(val.replace(/[^\d.-]/g, '')) > 0, {
      message: "amount_must_be_positive"
    }),
  startDate: z.date(),
  type: z
    .enum(["DAILY", "WEEKLY", "MONTHLY", "ANNUAL"]),
});

// Form fields definition
export const defineEditFundSavingPlanFormBody = () => {
  const t = translate(['spendingPlan', 'common']);

  return [
    {
      name: 'name',
      label: t('form.planFields.title'),
      type: EFieldType.Input,
      placeHolder: t('form.planFields.titlePlaceholder'),
      props: {
        className: 'col-span-2 mb-4'
      }
    },
    {
      name: 'description',
      label: t('form.planFields.description'),
      type: EFieldType.Textarea,
      placeHolder: t('form.planFields.descriptionPlaceholder'),
      props: {
        className: 'col-span-2 mb-4',
        rows: 3
      }
    },
    {
      name: 'targetAmount',
      label: t('form.planFields.amount'),
      type: EFieldType.MoneyInput,
      placeHolder: t('form.planFields.amountPlaceholder'),
      props: {
        className: 'col-span-2 mb-4'
      }
    },
    {
      name: 'startDate',
      label: t('form.planFields.date'),
      type: EFieldType.DatePicker,
      placeHolder: t('form.planFields.datePlaceholder'),
      props: {
        className: 'col-span-2 mb-4'
      }
    },
    {
      name: 'type',
      label: t('form.planFields.frequency'),
      type: EFieldType.Select,
      placeHolder: t('form.planFields.frequencyPlaceholder'),
      dataSelector: [
        { value: 'DAILY', label: t('frequency.daily') },
        { value: 'WEEKLY', label: t('frequency.weekly') },
        { value: 'MONTHLY', label: t('frequency.monthly') },
        { value: 'ANNUAL', label: t('frequency.annual') }
      ],
      props: {
        className: 'col-span-2 mb-4'
      }
    }
  ];
};
