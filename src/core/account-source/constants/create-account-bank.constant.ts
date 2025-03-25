import { translate } from '@/libraries/utils'
import { EFieldType } from '@/types/formZod.interface'
import { z } from 'zod'

const t = translate(['accountSource'])
export const createAccountBankFormBody = [
  {
    name: 'type',
    type: EFieldType.Select,
    label: t('form.createAccountSourceFormBody.bankType.label'),
    dataSelector: [
      {
        value: 'MB_BANK',
        label: 'MB BANK'
      }
    ],
    placeHolder: t('form.createAccountSourceFormBody.bankType.placeholder')
  },
  {
    name: 'login_id',
    type: EFieldType.Input,
    label: t('form.createAccountSourceFormBody.loginId.label'),
    placeHolder: t('form.createAccountSourceFormBody.loginId.placeholder'),
    props: {
      autoComplete: 'login_id'
    }
  },
  {
    name: 'password',
    type: EFieldType.Input,
    label: 'Password',
    placeHolder: 'Enter your password',
    props: {
      autoComplete: 'password',
      type: 'password'
    }
  },
  {
    name: 'accounts',
    type: EFieldType.MultiInput,
    label: t('form.createAccountSourceFormBody.accounts.label'),
    placeHolder: t('form.createAccountSourceFormBody.accounts.placeholder'),
    props: {
      placeholder: t('form.createAccountSourceFormBody.accounts.placeholder')
    }
  }
]

export const createAccountBankSchema = z.object({
  type: z.enum(['MB_BANK'], {
    message: 'Bank type must be either "MB_BANK"'
  }),
  login_id: z
    .string()
    .trim()
    .min(6, 'Username must be at least 6 characters')
    .max(50, 'Username cannot exceed 50 characters'),
  password: z
    .string()
    .trim()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password cannot exceed 50 characters'),
  accounts: z
    .array(
      z
        .string()
        .trim()
        .min(10, 'Account number must be at least 10 digits')
        .max(14, 'Account number cannot exceed 14 digits')
    )
    .min(1, 'At least one account number is required')
    .max(5, 'Maximum 5 account numbers allowed')
})
