import { translate } from '@/libraries/utils'
import { EFieldType } from '@/types/formZod.interface'
import { z } from 'zod'
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

export const updateAccountBankSchema = z.object({
  type: z.enum(['MB_BANK'], {
    message: getTranslation('Bank type must be "MB_BANK"', 'Loại ngân hàng phải là "MB_BANK"')
  }),
  login_id: z
    .string()
    .trim()
    .min(6, getTranslation('Username must be at least 6 characters', 'Tên đăng nhập phải có ít nhất 6 ký tự'))
    .max(50, getTranslation('Username cannot exceed 50 characters', 'Tên đăng nhập không được quá 50 ký tự')),
  password: z
    .string()
    .trim()
    .min(6, getTranslation('Password must be at least 6 characters', 'Mật khẩu phải có ít nhất 6 ký tự'))
    .max(50, getTranslation('Password cannot exceed 50 characters', 'Mật khẩu không được quá 50 ký tự')),
  accounts: z
    .array(
      z
        .string()
        .trim()
        .min(10, getTranslation('Account number must be at least 10 digits', 'Số tài khoản phải có ít nhất 10 chữ số'))
        .max(14, getTranslation('Account number cannot exceed 14 digits', 'Số tài khoản không được quá 14 chữ số'))
    )
    .min(1, getTranslation('At least one account number is required', 'Phải có ít nhất một số tài khoản'))
    .max(5, getTranslation('Maximum 5 account numbers allowed', 'Tối đa 5 số tài khoản được phép'))
})

export const updateAccountBankFormBody = [
  {
    name: 'type',
    type: EFieldType.Select,
    label: getTranslation('Bank Type', 'Loại ngân hàng'),
    dataSelector: [
      {
        value: 'MB_BANK',
        label: 'MB BANK'
      }
    ],
    placeHolder: getTranslation('Select Bank Type', 'Chọn loại ngân hàng')
  },
  {
    name: 'login_id',
    type: EFieldType.Input,
    label: getTranslation('Login Id', 'ID đăng nhập'),
    placeHolder: getTranslation('Enter your login id', 'Nhập ID đăng nhập của bạn'),
    props: {
      autoComplete: 'login_id'
    }
  },
  {
    name: 'password',
    type: EFieldType.Input,
    label: getTranslation('Password', 'Mật khẩu'),
    placeHolder: getTranslation('Enter your password', 'Nhập mật khẩu của bạn'),
    props: {
      type: 'password',
      autoComplete: 'password'
    }
  },
  {
    name: 'accounts',
    type: EFieldType.MultiInput,
    label: getTranslation('Accounts', 'Tài khoản'),
    placeHolder: getTranslation('Enter your accounts', 'Nhập tài khoản của bạn'),
    props: {
      autoComplete: 'accounts',
      placeholder: getTranslation('Enter your accounts', 'Nhập tài khoản của bạn')
    }
  }
]
