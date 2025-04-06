import { translate } from '@/libraries/utils'
import { EFieldType } from '@/types/formZod.interface'
import { z } from 'zod'
import { EAccountSourceType } from '../models'
import i18next from 'i18next'

// Hàm lấy nội dung dựa trên ngôn ngữ hiện tại
const getTranslation = (enText: string, viText: string) => {
  // Kiểm tra ngôn ngữ hiện tại, nếu là 'vi' thì trả về tiếng Việt, ngược lại trả về tiếng Anh
  try {
    const lang = i18next.language || localStorage.getItem('i18nextLng') || 'en'
    return lang.startsWith('vi') ? viText : enText
  } catch (e) {
    // Fallback nếu có lỗi khi đọc ngôn ngữ
    return viText
  }
}

export const updateAccountSourceSchema = z.object({
  accountSourceName: z
    .string({ message: getTranslation('Source Name is required', 'Tên nguồn tài khoản là bắt buộc') })
    .min(5, {
      message: getTranslation(
        'Source Name must be at least 5 characters long',
        'Tên nguồn tài khoản phải có ít nhất 5 ký tự'
      )
    })
    .max(30, {
      message: getTranslation(
        'Source Name must be at most 30 characters long',
        'Tên nguồn tài khoản không được quá 30 ký tự'
      )
    }),
  accountSourceType: z.nativeEnum(EAccountSourceType, {
    message: getTranslation(
      'Account source type must be either "Wallet" or "Banking"',
      'Loại nguồn tài khoản phải là "Ví điện tử" hoặc "Ngân hàng"'
    )
  }),
  id: z.string()
})

export const updateAccountSourceFormBody = (setTypeState: any) => {
  return [
    {
      name: 'accountSourceName',
      type: EFieldType.Input,
      label: getTranslation('Source Name', 'Tên nguồn tài khoản'),
      placeHolder: getTranslation('Enter your source name', 'Nhập tên nguồn tài khoản của bạn'),
      props: {
        autoComplete: 'name'
      }
    },
    {
      name: 'accountSourceType',
      type: EFieldType.Select,
      label: getTranslation('Type', 'Loại tài khoản'),
      dataSelector: [
        {
          value: 'WALLET',
          label: getTranslation('Wallet', 'Ví điện tử')
        },
        {
          value: 'BANKING',
          label: getTranslation('Banking', 'Ngân hàng')
        }
      ],
      placeHolder: getTranslation('Select type', 'Chọn loại tài khoản'),
      props: {
        onchange: (value: string) => {
          setTypeState(value)
        }
      }
    }
  ]
}
