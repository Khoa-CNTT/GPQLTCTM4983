import { z } from 'zod';
import { EFieldType } from '@/types/formZod.interface';
import { translate } from '@/libraries/utils';

// Schema for changing target status
export const changeStatusTargetSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["ACTIVE", "INACTIVE", "CANCELLED"])
});

export type IChangeStatusTargetFormValues = z.infer<typeof changeStatusTargetSchema>;

// Form fields definition
export const defineChangeStatusTargetFormBody = () => {
  const t = translate(['spendingPlan', 'common']);

  return [
    {
      name: 'status',
      label: t('targetForm.changeStatus.selectNewStatus'),
      type: EFieldType.Select,
      placeHolder: t('targetForm.changeStatus.statusPlaceholder'),
      dataSelector: [
        { value: 'ACTIVE', label: t('targetForm.changeStatus.active') },
        { value: 'CANCELLED', label: t('targetForm.changeStatus.cancelled') }
      ],
      props: {
        className: 'col-span-2 mb-4'
      }
    }
  ];
};
