import { z } from 'zod';
import { EFieldType } from '@/types/formZod.interface';
import { mockDataTrackerType } from '@/app/dashboard/spending-plan/constant';
import { translate } from '@/libraries/utils';

// Create basic schema
export const createFundSavingTargetSchema = z.object({
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
  trackerTypeId: z
    .string()
    .min(1),
  startDate: z.date(),
  endDate: z.date()
}).refine(
  (data) => data.endDate > data.startDate,
  {
    message: "end_date_after_start_date",
    path: ["endDate"],
  }
);

// Schema for creating a simplified budget
export const createSimplifiedBudgetSchema = z.object({
  targetAmount: z
    .string()
    .min(1)
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: "amount_must_be_positive"
    })
});

export const dateConstraint = (data: any) => {
  if (data.startDate && data.endDate) {
    return data.endDate > data.startDate;
  }
  return true;
};

export const defineCreateFundSavingTargetFormBody = () => {
  const t = translate(['spendingPlan', 'common']);

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
        className: 'mb-4'
      }
    },
    {
      name: 'trackerTypeId',
      label: t('targetForm.fields.category'),
      type: EFieldType.Select,
      placeHolder: t('targetForm.fields.categoryPlaceholder'),
      dataSelector: mockDataTrackerType,
      props: {
        className: 'mb-4'
      }
    },
    {
      name: 'startDate',
      label: t('targetForm.fields.startDate'),
      type: EFieldType.DatePicker,
      placeHolder: t('targetForm.fields.startDatePlaceholder'),
      props: {
        className: 'mb-4'
      }
    },
    {
      name: 'endDate',
      label: t('targetForm.fields.endDate'),
      type: EFieldType.DatePicker,
      placeHolder: t('targetForm.fields.endDatePlaceholder'),
      props: {
        className: 'mb-4'
      }
    },
  ];
};

// Form fields for simplified budget creation mode
export const defineCreateSimplifiedBudgetFormBody = () => {
  const t = translate(['spendingPlan', 'common']);

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
  ];
};
