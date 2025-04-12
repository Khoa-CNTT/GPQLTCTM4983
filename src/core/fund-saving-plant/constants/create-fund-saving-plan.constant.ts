import { z } from 'zod';
import { EFieldType } from '@/types/formZod.interface';
import { mockDataTrackerType } from '@/app/dashboard/spending-plan/constant';

// Zod schema for the Create Plan form
export const createFundSavingPlanSchema = z.object({
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
  trackerTypeId: z
    .string()
    .min(1, { message: "Vui lòng chọn phân loại chi tiêu" }),
  month: z
    .string()
    .min(1, { message: "Vui lòng chọn tháng" }),
  day: z
    .string()
    .min(1, { message: "Vui lòng chọn ngày" }),
  type: z
    .enum(["DAILY", "WEEKLY", "MONTHLY", "ANNUAL"], {
      message: "Vui lòng chọn tần suất lặp lại hợp lệ"
    }),
  notifyBefore: z
    .string()
    .default("3"),
});

// Generate month options
export const generateMonths = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: new Date(0, i).toLocaleString('default', { month: 'long' })
  }));
};

// Get days in month
export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};

// Form fields definition
export const defineCreateFundSavingPlanFormBody = (daysInMonth: number[]) => [
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
    name: 'trackerTypeId',
    label: 'Phân loại chi tiêu',
    type: EFieldType.Select,
    placeHolder: 'Chọn phân loại',
    dataSelector: mockDataTrackerType,
    props: {
      className: 'col-span-2 mb-4'
    }
  },
  {
    name: 'month',
    label: 'Tháng',
    type: EFieldType.Select,
    placeHolder: 'Chọn tháng',
    dataSelector: generateMonths(),
    props: {
      className: 'mb-4'
    }
  },
  {
    name: 'day',
    label: 'Ngày',
    type: EFieldType.Select,
    placeHolder: 'Chọn ngày',
    dataSelector: daysInMonth.map(d => ({ value: d.toString(), label: d.toString() })),
    props: {
      className: 'mb-4'
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
  },
  {
    name: 'notifyBefore',
    label: 'Thông báo trước (ngày)',
    type: EFieldType.Select,
    placeHolder: 'Chọn thời gian thông báo',
    dataSelector: [
      { value: '0', label: 'Không thông báo' },
      { value: '1', label: '1 ngày' },
      { value: '2', label: '2 ngày' },
      { value: '3', label: '3 ngày' },
      { value: '5', label: '5 ngày' },
      { value: '7', label: '7 ngày' }
    ],
    props: {
      className: 'col-span-2 mb-4'
    }
  }
];
