import { z } from 'zod'
import { EFieldType } from '@/types/formZod.interface'
import { mockDataTrackerType } from '@/app/dashboard/spending-plan/constant'
import { translate } from '@/libraries/utils'

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
    .min(1)
    .optional(),
  day: z
    .string()
    .min(1)
    .optional(),
  startDate: z
    .date()
    .optional(),
  weekDay: z
    .string()
    .optional(),
  type: z
    .enum(["DAILY", "WEEKLY", "MONTHLY", "ANNUAL"]),
  notifyBefore: z
    .string()
    .default("3"),
})

// Generate month options with i18n support
export const generateMonths = () => {
  const t = translate(['common'])

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
  ]

  return months
}

// Get days in month
export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate()
}

// Generate frequency options
export const generateFrequencyOptions = () => {
  const t = translate(['spendingPlan'])

  return [
    { value: 'DAILY', label: t('frequency.daily') },
    { value: 'WEEKLY', label: t('frequency.weekly') },
    { value: 'MONTHLY', label: t('frequency.monthly') },
    { value: 'ANNUAL', label: t('frequency.annual') }
  ]
}

// Generate weekday options
export const generateWeekDayOptions = () => {
  const t = translate(['common'])

  return [
    { value: '0', label: t('calendar.weekdays.sunday') },
    { value: '1', label: t('calendar.weekdays.monday') },
    { value: '2', label: t('calendar.weekdays.tuesday') },
    { value: '3', label: t('calendar.weekdays.wednesday') },
    { value: '4', label: t('calendar.weekdays.thursday') },
    { value: '5', label: t('calendar.weekdays.friday') },
    { value: '6', label: t('calendar.weekdays.saturday') }
  ]
}

// Form fields definition
export const defineCreateFundSavingPlanFormBody = (daysInMonth: number[], frequency: string = 'MONTHLY') => {
  const t = translate(['spendingPlan', 'common'])

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
      name: 'type',
      label: t('form.planFields.frequency'),
      type: EFieldType.Select,
      placeHolder: t('form.planFields.frequencyPlaceholder'),
      dataSelector: generateFrequencyOptions(),
      props: {
        className: 'col-span-2 mb-4'
      }
    },
    {
      name: 'startDate',
      label: t('form.planFields.startDate'),
      type: EFieldType.DatePicker,
      placeHolder: t('form.planFields.startDatePlaceholder'),
      props: {
        // Use full width for Daily frequency
        className: `${frequency === 'DAILY' ? 'col-span-2' : 'col-span-1'} mb-4`
      }
    },
    {
      name: 'weekDay',
      label: t('form.planFields.weekday'),
      type: EFieldType.Select,
      placeHolder: t('form.planFields.weekdayPlaceholder'),
      dataSelector: generateWeekDayOptions(),
      props: {
        // Use full width for Weekly frequency
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
        className: 'col-span-1 mb-4'
      }
    },
    {
      name: 'day',
      label: t('form.planFields.day'),
      type: EFieldType.Select,
      placeHolder: t('form.planFields.dayPlaceholder'),
      dataSelector: daysInMonth.map(d => ({ value: d.toString(), label: d.toString() })),
      props: {
        className: 'col-span-1 mb-4'
      }
    }
  ]
}
