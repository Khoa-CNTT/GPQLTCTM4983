import { z } from 'zod'
import { EFieldType } from '@/types/formZod.interface'

// Schema based directly on IUpdateFundSavingPlantRequest interface
export const editFundSavingPlantSchema = z.object({
  name: z.string().min(1, { message: 'Tên kế hoạch không được để trống' }),
  description: z.string().min(1, { message: 'Mô tả không được để trống' }),
  targetAmount: z.string().refine(val => !isNaN(Number(val)), {
    message: 'Số tiền mục tiêu phải là số'
  }),
  startDate: z.date({
    required_error: 'Vui lòng chọn ngày bắt đầu',
  }),
  type: z.string().min(1, { message: 'Loại kế hoạch không được để trống' })
})

export const defineEditFundSavingPlantFormBody = () => [
  {
    name: 'name',
    label: 'Tên kế hoạch',
    type: EFieldType.Input,
    placeHolder: 'Nhập tên kế hoạch'
  },
  {
    name: 'description',
    label: 'Mô tả',
    type: EFieldType.Textarea,
    placeHolder: 'Nhập mô tả chi tiết',
    props: {
      rows: 3
    }
  },
  {
    name: 'targetAmount',
    label: 'Số tiền mục tiêu',
    type: EFieldType.MoneyInput,
    placeHolder: 'Nhập số tiền mục tiêu'
  },
  {
    name: 'startDate',
    label: 'Ngày bắt đầu',
    type: EFieldType.DatePicker,
    placeHolder: 'Chọn ngày bắt đầu',
    props: {
      locale: 'vi'
    }
  },
  {
    name: 'type',
    label: 'Loại kế hoạch',
    type: EFieldType.Select,
    placeHolder: 'Chọn loại kế hoạch',
    dataSelector: [
      { value: 'MONTHLY', label: 'Hàng tháng' },
      { value: 'QUARTERLY', label: 'Hàng quý' },
      { value: 'YEARLY', label: 'Hàng năm' },
      { value: 'ONE_TIME', label: 'Một lần' }
    ]
  }
]
