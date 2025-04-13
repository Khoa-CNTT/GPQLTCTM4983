import { z } from 'zod';
import { EFieldType } from '@/types/formZod.interface';
import { mockDataTrackerType } from '@/app/dashboard/spending-plan/constant';
import { translate } from '@/libraries/utils';

// Zod schema for the Create Plan form
export const createFundSavingPlanSchema = z.object({
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
  trackerTypeId: z
    .string()
    .min(1),
  month: z
    .string()
    .min(1),
  day: z
    .string()
    .min(1),
  type: z
    .enum(["DAILY", "WEEKLY", "MONTHLY", "ANNUAL"]),
  notifyBefore: z
    .string()
    .default("3"),
});

// Generate month options with i18n support
export const generateMonths = () => {
  const t = translate(['common']);

  const months = [
    { value: '1', label: t('calendar.months.january') },
    { value: '2', label: t('calendar.months.february') },
    { value: '3', label: t('calendar.months.march') },
    { value: '4', label: t('calendar.months.april') },
    { value: '5', label: t('calendar.months.may') },
    { value: '6', label: t('calendar.months.june') },
    { value: '7', label: t('calendar.months.july') },
    { value: '8', label: t('calendar.months.august') },
    { value: '9', label: t('calendar.months.september') },
    { value: '10', label: t('calendar.months.october') },
    { value: '11', label: t('calendar.months.november') },
    { value: '12', label: t('calendar.months.december') }
  ];

  return months;
};

// Get days in month
export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};

// Form fields definition
export const defineCreateFundSavingPlanFormBody = (daysInMonth: number[]) => {
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
      name: 'trackerTypeId',
      label: t('form.planFields.category'),
      type: EFieldType.Select,
      placeHolder: t('form.planFields.categoryPlaceholder'),
      dataSelector: mockDataTrackerType,
      props: {
        className: 'col-span-2 mb-4'
      }
    },
    {
      name: 'month',
      label: t('form.planFields.month'),
      type: EFieldType.Select,
      placeHolder: t('form.planFields.monthPlaceholder'),
      dataSelector: generateMonths(),
      props: {
        className: 'mb-4'
      }
    },
    {
      name: 'day',
      label: t('form.planFields.day'),
      type: EFieldType.Select,
      placeHolder: t('form.planFields.dayPlaceholder'),
      dataSelector: daysInMonth.map(d => ({ value: d.toString(), label: d.toString() })),
      props: {
        className: 'mb-4'
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
    },
    {
      name: 'notifyBefore',
      label: t('form.planFields.notifyBefore'),
      type: EFieldType.Select,
      placeHolder: t('form.planFields.notifyBeforePlaceholder'),
      dataSelector: [
        { value: '0', label: t('form.planFields.notifyOptions.none') },
        { value: '1', label: t('form.planFields.notifyOptions.oneDay') },
        { value: '2', label: t('form.planFields.notifyOptions.twoDays') },
        { value: '3', label: t('form.planFields.notifyOptions.threeDays') },
        { value: '5', label: t('form.planFields.notifyOptions.fiveDays') },
        { value: '7', label: t('form.planFields.notifyOptions.sevenDays') }
      ],
      props: {
        className: 'col-span-2 mb-4'
      }
    }
  ];
};
