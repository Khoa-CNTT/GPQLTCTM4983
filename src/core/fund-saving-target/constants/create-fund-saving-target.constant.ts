import { z } from 'zod';
import { EFieldType } from '@/types/formZod.interface';
import { mockDataTrackerType } from '@/app/dashboard/spending-plan/constant';

// Tạo schema cơ bản trước
export const createFundSavingTargetSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Tên mục tiêu phải có ít nhất 3 ký tự" })
    .max(100, { message: "Tên mục tiêu không được vượt quá 100 ký tự" }),
  description: z
    .string()
    .min(5, { message: "Mô tả phải có ít nhất 5 ký tự" })
    .max(500, { message: "Mô tả không được vượt quá 500 ký tự" }),
  targetAmount: z
    .string()
    .min(1, { message: "Vui lòng nhập số tiền mục tiêu" })
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Số tiền mục tiêu phải lớn hơn 0"
    }),
  trackerTypeId: z
    .string()
    .min(1, { message: "Vui lòng chọn loại theo dõi" }),
  startDate: z.date({
    required_error: "Vui lòng chọn ngày bắt đầu",
  }),
  endDate: z.date({
    required_error: "Vui lòng chọn ngày kết thúc",
  })
}).refine(
  (data) => data.endDate > data.startDate,
  {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["endDate"],
  }
);

// Schema cho tạo tổng ngân sách (đơn giản)
export const createSimplifiedBudgetSchema = z.object({
  targetAmount: z
    .string()
    .min(1, { message: "Vui lòng nhập số tiền mục tiêu" })
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Số tiền mục tiêu phải lớn hơn 0"
    })
});

export const dateConstraint = (data: any) => {
  if (data.startDate && data.endDate) {
    return data.endDate > data.startDate;
  }
  return true;
};

export const defineCreateFundSavingTargetFormBody = () => [
  {
    name: 'name',
    label: 'Tên mục tiêu',
    type: EFieldType.Input,
    placeHolder: 'Nhập tên mục tiêu',
    props: {
      className: 'col-span-2 mb-4'
    }
  },
  {
    name: 'description',
    label: 'Mô tả',
    type: EFieldType.Textarea,
    placeHolder: 'Nhập mô tả chi tiết về mục tiêu',
    props: {
      className: 'col-span-2 mb-4',
      rows: 3
    }
  },
  {
    name: 'targetAmount',
    label: 'Số tiền mục tiêu',
    type: EFieldType.MoneyInput,
    placeHolder: 'Nhập số tiền mục tiêu',
    props: {
      className: 'mb-4'
    }
  },
  {
    name: 'trackerTypeId',
    label: 'Phân loại chi tiêu',
    type: EFieldType.Select,
    placeHolder: 'Chọn phân loại',
    dataSelector: mockDataTrackerType,
    props: {
      className: 'mb-4'
    }
  },
  {
    name: 'startDate',
    label: 'Từ ngày',
    type: EFieldType.DatePicker,
    placeHolder: 'Chọn ngày bắt đầu',
    props: {
      className: 'mb-4'
    }
  },
  {
    name: 'endDate',
    label: 'Đến ngày',
    type: EFieldType.DatePicker,
    placeHolder: 'Chọn ngày kết thúc',
    props: {
      className: 'mb-4'
    }
  },
];

// Form fields cho chế độ tạo tổng ngân sách (đơn giản)
export const defineCreateSimplifiedBudgetFormBody = () => [
  {
    name: 'targetAmount',
    label: 'Số tiền mục tiêu',
    type: EFieldType.MoneyInput,
    placeHolder: 'Nhập số tiền mục tiêu',
    props: {
      className: 'col-span-2 mb-4'
    }
  }];
