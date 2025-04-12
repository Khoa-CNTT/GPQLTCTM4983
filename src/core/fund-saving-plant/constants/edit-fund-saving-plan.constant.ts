import { z } from 'zod';
import { EFieldType } from '@/types/formZod.interface';

// Zod schema for the Edit Plan form
export const editFundSavingPlanSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Tiêu đề kế hoạch phải có ít nhất 3 ký tự" })
    .max(100, { message: "Tiêu đề kế hoạch không được vượt quá 100 ký tự" }),
  description: z
    .string()
    .max(500, { message: "Mô tả không được vượt quá 500 ký tự" })
    .optional(),
  targetAmount: z
    .string()
    .min(1, { message: "Vui lòng nhập số tiền cần chi tiêu" })
    .refine(val => !isNaN(Number(val.replace(/[^\d.-]/g, ''))) && Number(val.replace(/[^\d.-]/g, '')) > 0, {
      message: "Số tiền chi tiêu phải lớn hơn 0"
    }),
  startDate: z.date({
    required_error: "Vui lòng chọn ngày bắt đầu",
  }),
  type: z
    .enum(["DAILY", "WEEKLY", "MONTHLY", "ANNUAL"], {
      message: "Vui lòng chọn tần suất lặp lại hợp lệ"
    }),
});

// Form fields definition
export const defineEditFundSavingPlanFormBody = () => [
  {
    name: 'name',
    label: 'Tiêu đề kế hoạch',
    type: EFieldType.Input,
    placeHolder: 'Nhập tiêu đề kế hoạch chi tiêu',
    props: {
      className: 'col-span-2 mb-4'
    }
  },
  {
    name: 'description',
    label: 'Mô tả (Không bắt buộc)',
    type: EFieldType.Textarea,
    placeHolder: 'Nhập mô tả chi tiết',
    props: {
      className: 'col-span-2 mb-4',
      rows: 3
    }
  },
  {
    name: 'targetAmount',
    label: 'Số tiền',
    type: EFieldType.MoneyInput,
    placeHolder: 'Nhập số tiền cần chi tiêu',
    props: {
      className: 'col-span-2 mb-4'
    }
  },
  {
    name: 'startDate',
    label: 'Ngày thực hiện',
    type: EFieldType.DatePicker,
    placeHolder: 'Chọn ngày',
    props: {
      className: 'col-span-2 mb-4'
    }
  },
  {
    name: 'type',
    label: 'Tần suất lặp lại',
    type: EFieldType.Select,
    placeHolder: 'Chọn tần suất lặp lại',
    dataSelector: [
      { value: 'DAILY', label: 'Hàng ngày' },
      { value: 'WEEKLY', label: 'Hàng tuần' },
      { value: 'MONTHLY', label: 'Hàng tháng' },
      { value: 'ANNUAL', label: 'Hàng năm' }
    ],
    props: {
      className: 'col-span-2 mb-4'
    }
  }
];
